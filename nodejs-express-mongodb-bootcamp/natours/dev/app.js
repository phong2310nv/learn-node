const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewsRoutes');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const xssMiddleware = require('./utils/xssMiddleware');
const hpp = require('hpp');
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});

// 1) MIDDLEWARES
// Set security HTTP headers
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  // Development logging
  app.use(morgan('dev'));
}
// Apply rate limiting to all requests to /api
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS

app.use(xssMiddleware());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Pong', app: 'Natours' });
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );
  next(err);
});
app.use(globalErrorHandler);

module.exports = app;
