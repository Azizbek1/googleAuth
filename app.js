const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();


const indexRouter = require('./routes/index');
const chatRouter = require('./routes/chat');
const authRouter = require('./routes/auth');
const app = express();

// DB ulash 
const db = require('./helper/db')();
// middleware 
const inAthentacated = require('./middleware/isAuthenticated');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 14 * 24 * 3600000 }  // https ga ishlatish majjburlaydi 2 hafta
}))

app.use(passport.initialize()); // hamma sahifa uchun! 
app.use(passport.session());



app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/chat', inAthentacated, chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
