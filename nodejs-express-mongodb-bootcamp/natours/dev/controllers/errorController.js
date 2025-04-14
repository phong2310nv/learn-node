const AppError = require('../utils/appError');

function sendErrorForDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
}
function sendErrorForProd(err, res) {
  if (err.isOperational) {
    // Operational, trusted error: send message to client
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
    error: err,
  });
}

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err) {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

function handleJWTError(err) {
  return new AppError('Invalid token. Please login again', 400);
}

function handleJWTExpiredError(err) {
  return new AppError('Your token has expired! Please log in again', 400);
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // Development error handler
    sendErrorForDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    // Cast error: eg. invalid ID
    if (err.name === 'CastError') error = handleCastErrorDB(err);

    // Handle Mongoose duplicate key error
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);

    // Handle Mongoose validation error
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

    if (err.name === 'JsonWebTokenError') error = handleJWTError(err);

    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(err);

    sendErrorForProd(error, res);
  }
};
