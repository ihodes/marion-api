// (C) Isaac Hodes
// Sept 2013
'use strict';

var _        = require('underscore'),
    U        = require('../utils'),
    Schedule = require('../models/schedule');


var DISPLAY_WHITELIST = ['_id', 'frequency', 'sendTime', 'active',
                         'person', 'protocol', 'createdAt'];

var cleaner = U.cleaner(DISPLAY_WHITELIST);


exports.getSchedules = function (req, res) {
    Schedule.allSchedules(req.user, req.body,
                          U.sendBack(res, function(res) {
                              return { schedules: _.map(res, cleaner) };
                          }));
};

exports.createSchedule = function(req, res) {
    var expected = {person: null, protocol: null,
                    sendTime: U.isTime, frequency: Schedule.FREQUENCIES };
    var allowed = _.extend({ 'active': ['true', 'false'] }, expected);
    if(!U.validates(req.body, allowed, expected))
        return U.error(res, U.ERRORS.badRequest);
    return Schedule.createSchedule(req.user, req.body,
                                   U.sendBack(res, cleaner));
};

exports.getSchedule = function(req, res) {
    Schedule.getSchedule(req.user, req.params.scheduleId,
                         U.sendBack(res));
};

exports.updateSchedule = function(req, res) {
    console.log(req.body);
    var valid = U.allows(req.body, {active: ['true', 'false'], sendTime: U.isTime,
                                    frequency: Schedule.FREQUENCIES });
    if(!valid) return U.error(res, U.ERRORS.badRequest);
    Schedule.updateSchedule(req.user, req.params.scheduleId,
                            req.body, U.sendBack(res, cleaner));
};

exports.deleteSchedule = function(req, res) {
    Schedule.deleteSchedule(req.user, req.params.scheduleId,
                            U.sendBack(res, cleaner));
};
