'use strict';

var winston = require('winston'),
    _       = require('underscore');


var consoleopts = { colorize: true, timestamp: true, handleExceptions: true };
var levels = {
    levels: {
        debug: 4,
        request: 3,
        info: 2,
        warn: 1,
        error: 0
    },
    colors: {
        debug: 'blue',
        request: 'white',
        info: 'green',
        warn: 'yellow',
        error: 'red'
    }
};


var logger = new winston.Logger({
    levels: levels.levels,
    colors: levels.colors,
    transports: [
        new winston.transports.Console(consoleopts)
    ]});
exports.logger = logger;


exports.requestLogger = function(req, res, next) {
    var orginfo = '';
    if(req.user)
        orginfo = '<auth:'+req.user.name+'@'+req.ip+'>'
    else orginfo = '<unauth:@'+req.ip+'>';
    var info = [orginfo, req.method, req.path].join(' ');
    logger.request(info);
    next();
};
