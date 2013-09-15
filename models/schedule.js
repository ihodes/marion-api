// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    db     = require('./db'),
    config = require('../config'),
    utils  = require('../utils');


var SCHEDULE_PARAM_WHITELIST = ['_id', 'frequency', 'time', 'active',
                                'personId', 'protocolId', 'createdAt'];


var cleaner = utils.cleaner(SCHEDULE_PARAM_WHITELIST);
var screen = utils.safeCallbacks(cleaner);


exports.allSchedules = function(params, callback) {
    db.Schedule.find(screen(callback));
};

exports.createSchedule = function(params, callback) {
    db.Schedule(cleaner(params)).save(screen(callback));
};

exports.getSchedule = function(scheduleid, callback) {
    db.Schedule.findById(scheduleid, screen(callback));
};

exports.updateSchedule = function(scheduleid, params, callback) {
    db.Schedule.findById(scheduleid, function(err, schedule) {
        params = cleaner(params);
        for(var key in params)
            schedule[key] = params[key];
        schedule.save(screen(callback));
    });
};

exports.deleteSchedule = function(scheduleid, callback) {
    db.Schedule.findByIdAndRemove(scheduleid, screen(callback));
};
