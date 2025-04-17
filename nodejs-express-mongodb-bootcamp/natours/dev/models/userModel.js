const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        delete ret._id;
        return ret;
      },
    },
  },
);

userSchema.pre('save', async function (next) {
  // Check if the password is modified before hashing
  // If the password is not modified, skip hashing
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12); // 12 is the number of rounds
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined; // Remove passwordConfirm from the document
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  console.log({ resetToken, passwordResetToken: this.passwordResetToken });

  return resetToken;
};

userSchema.pre('save', function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password') || this.isNew) return next();

  // Set the passwordChangedAt property to the current date
  this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure the token is valid
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ isActive: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
