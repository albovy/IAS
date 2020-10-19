const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('express-jwt')
const unless = require('express-unless');
const mongoose = require("mongoose");
const cors = require('cors');

const config = require('./config.json')

const loginRouter = require('./routes/login')
const usersRouter = require('./routes/users');
const pictureRouter = require('./routes/picture');

const app = express();


const mongoDB = "mongodb://127.0.0.1:27017/iasdb";
//BD
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
process.env.JWT_SECRET = config.secret
process.env.JWT_EXP = config.exp

const jwtCheck = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: function fromHeader (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } 
    return null;
  }
});

app.use('*', (req, res, next) => {
  console.log(req.params);
  console.log(req.body);
  console.log(req.cookies);
  next();
});

jwtCheck.unless = unless;
app.use(jwtCheck.unless({
  path: [
    '/api/login', {
    url: '/api/users',
    methods: ['POST']
  }
]
}));

app.use('/api/login',loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/pictures', pictureRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send();
});

module.exports = app;