var cfenv = require('cfenv');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var ceStore = require('./ceStore/ceStore');

ceStore.reset();

var MemoryStore = require('./memoryStore/memoryStore')(session);

app.use(bodyParser.json());
app.use(session({
  name: 'ce-editor',
  secret: 'bramble',
  store: new MemoryStore({
    expires: 60 * 60 * 24, // 1 day expiry time (option in seconds)
    checkperiod: 60 * 60 // 1 hour check time, checks for dead sessions every hour
  })
}));

app.use('/', express.static(path.join(__dirname, '../app')));
app.use('/bower_components', express.static(path.join(__dirname, '../app', 'bower_components')));
app.use('/assets', express.static(path.join(__dirname, '../app', 'assets')));
app.use('/routes', express.static(path.join(__dirname, '../app', 'routes')));
app.use('/services', express.static(path.join(__dirname, '../app', 'services')));
app.use('/styles', express.static(path.join(__dirname, '../app', 'styles')));

app.use('/api', require('./api'));

app.all('/*', function (req, res) {
  'use strict';

  res.sendFile(path.join(__dirname, '../app', 'index.html'));
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
server.listen(appEnv.port, function() {
  'use strict';
  console.log("server starting on " + appEnv.url);
});
