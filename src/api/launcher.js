'use strict';
require('babel-register');
var config = require('config');
var path =  require('path');

var app = require('./server').default;

if (!module.parent) {
    global.console.log('Server listening on port ' + config.port);
    global.console.log('Press CTRL+C to stop server');
    app.listen(config.port);
}
