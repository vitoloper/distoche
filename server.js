var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var logger = require("./backend/config/winston");
var fs = require("fs");
var path = require("path");

var app = express();
app.use(bodyParser.json());

// *********************** morgan configuration section *************

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname + '/logs', 'access.log'), { flags: 'a' })

// :method :url :status :res[content-length] - :response-time ms
app.use(morgan("tiny"));

// Standard Apache combined log output (append to file)
app.use(morgan("combined", { stream: accessLogStream }));

// ******************************************************************

// Create link to Angular build directory
var distDir = __dirname + "/dist/distoche";
app.use(express.static(distDir));

// Routes
require('./backend/routes/user.routes')(app);
require('./backend/routes/image.routes')(app);
require('./backend/routes/asset.routes')(app);
require('./backend/routes/story.routes')(app);

// "UnauthorizedError" error handler
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Invalid token' });
  } else {
    next(err);
  }
});

// Initialize the app
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  logger.info(`App running on port ${port}`);
});

module.exports = app;