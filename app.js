var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
// const bcrypt = require('bcryptjs');


var usersRouter = require('./routes/userRoutes');
var playGroundsRouter = require('./routes/playrGroundRoutes');
var reservationsRouter = require('./routes/reservationRoutes');
var playerRouter = require('./routes/playerRouter');
var cancelRouter = require('./routes/cancelRouter');

var schedule = require('node-schedule');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash('a112h', salt, function(err, hash) {
//         console.log("this is the hashed password : " + hash);
//     });
// });

app.use('/', usersRouter);
app.use('/playgrounds', playGroundsRouter);
app.use('/reservation', reservationsRouter);
app.use('/player', playerRouter);
app.use('/cancel', cancelRouter);





var rule = new schedule.RecurrenceRule();
rule.date = 15;
var j = schedule.scheduleJob(rule, function() {
    console.log('Today is recognized by Rebecca Black!');
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.data = err.data;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    // res.status(err.statusCode || 500);
    res.json({ message: err.message, Errors: err.data });
});

module.exports = app;