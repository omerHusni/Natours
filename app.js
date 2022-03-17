const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// eslint-disable-next-line no-unused-vars
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./tour/tourRoutes');
const userRouter = require('./tour/userRoutes');
const reviewRouter = require('./tour/reviewRoutes');
const bookingRouter = require('./tour/bookingRoutes');
const viewsRouter = require('./tour/viewsRoutes');

////////////////////////////////
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARE
// for serving static file
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP
// app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line prettier/prettier
  app.use(morgan('dev'));
}

// Limit req from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP! Try again in an hour.',
});
app.use('/api', limiter);

// Body parser from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use((req, res, next) => {
  req.RequestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3)ROUTES

app.use('/', viewsRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// TO HANDLE ALL UNDIFIEND ROUTS
app.all('*', (req, res, next) => {
  next(new AppError(`this route is not supported ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
