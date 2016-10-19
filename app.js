var cfenv = require('cfenv');
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/bower_components'));

app.all('/*', function (req, res) {
  'use strict';

  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
server.listen(appEnv.port, function() {
  console.log("server starting on " + appEnv.url);
});
