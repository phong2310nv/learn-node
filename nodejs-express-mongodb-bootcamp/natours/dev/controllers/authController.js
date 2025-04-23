const { promisify } = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const createSendToken = (user, statusCode, res, withUser = false) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date().setDate(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // Serve secure cookies
  if (process.env.NODE_ENV === 'development') cookieOptions.secure = false; // Serve secure cookies in development
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: withUser
      ? {
          user,
        }
      : undefined,
  });
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  newUser.password = undefined; // Remove password from the response

  createSendToken(newUser, 201, res, true);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // If everything ok, send token to client
  createSendToken(user, 200, res, true);
});

exports.protected = (...roles) => {
  return catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access', 401),
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist',
          401,
        ),
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again',
          401,
        ),
      );
    }

    // 5) Check if user has the required role

    if (!!roles.length && !roles.includes(currentUser.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  });
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies?.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!!roles.length && !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }
  // 2) Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/resetPassword/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message: `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to:
    ${resetURL}
    If you didn't forget your password, please ignore this email!`,
    });
    // 3) Send it to user's email
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // 3) Update user and return the token

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); // Save the updated user document

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // 2) Check if POSTed current password is correct

  if (!user.correctPassword(req.body.currentPassword, user.password)) {
    return next(new AppError('Current password not correct', 400));
  }
  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // Save the updated user document

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
