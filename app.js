var createError = require('http-errors');
var express = require('express');
var dotenv = require('dotenv');
dotenv.config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('express-flash');
var db = require('./db');
var global_functions = require('./global_functions');
var global_variables = require('./global_variables');


db.connect();






// SİTE GENELİ ROUTER IMPORT İŞLEMLERİ
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// ADMİN SAYFASI ROUTER İMPORT İŞLEMLERİ
var adminIndexRouter = require('./routes/admin/adminIndexRouter');
var adminCategoryRouter = require('./routes/admin/adminCategoryRouter');
var adminPageRouter = require('./routes/admin/adminPageRouter');
var adminArticleRouter = require('./routes/admin/adminArticleRouter');
var adminMediaRouter = require('./routes/admin/adminMediaRouter');
var adminUserRouter = require('./routes/admin/adminUserRouter');
var adminContactRouter = require('./routes/admin/adminContactRouter');

// MIDDLEWARE IMPORT İŞLEMLERİ
var adminMiddlewareLoginControl = require('./middlewares/asw-admin-login-control');
var middlewareGlobalsForViews = require('./middlewares/asw-globals-for-views');
var middlewareSetup = require('./middlewares/asw-setup');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options')


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/sweetalert2')));
app.use(express.static(path.join(__dirname, 'node_modules/@popperjs/core/dist/umd')));
app.use(express.static(path.join(__dirname, 'node_modules/cropperjs/dist')));

// Session ve Flash Ayarlamaları.
app.use(session({
    secret: 'asw-njs-1-lisan',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());



// GENEL SİTE ROUTER BAĞLAMALARI
app.use(middlewareSetup);

app.use(middlewareGlobalsForViews);
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/asw-app-setup', require('./routes/setupRouter'));

// ADMİN PANELİ ROUTER BAĞLAMALARI
app.use('/admin', adminMiddlewareLoginControl);
app.use('/admin', adminIndexRouter);
app.use('/admin/category', adminCategoryRouter);
app.use('/admin/page', adminPageRouter);
app.use('/admin/article', adminArticleRouter);
app.use('/admin/media', adminMediaRouter);
app.use('/admin/user', adminUserRouter);
app.use('/admin/contact', adminContactRouter);



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
