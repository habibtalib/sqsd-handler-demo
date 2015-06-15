console.log("====================================================================================");
console.log("Starting sqsd-handler-demo at " + (new Date()).toString());


// Quick Start --------------------

var express = require("express");
var app = express();
var sqsdHandler = require("sqsd-handler");

// Create message handler
var handler = sqsdHandler.create(function (msg) {
    console.log("Received worker message", msg);
});

// Mount handler to Express at ElasticBeanstalk worker path
app.use("/", handler);


// SNS Notification Messages --------------------

handler.sns(function (msg) {
    console.log("Received sns notification: ", msg.sns);
});


// Scheduled Tasks --------------------

var scheduledTaskHandler = sqsdHandler.create();

scheduledTaskHandler.task("job1", function (msg) {
    console.log("Scheduled task 'job1': ", msg);
});

app.use("/scheduled", scheduledTaskHandler);



// Logging --------------------

scheduledTaskHandler.log(function (msg) {
    console.log("Logging msgid" + msg.msgid);
});


// ------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// Generic Express app error handler
app.use(function(err, req, res, next) {
    console.log("Server error handler: " + err.message + "- \n" + err.stack);
    res.status(err.status || 500).send();
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
    console.log("Express server listening on port " + server.address().port);
});

module.exports = app;
