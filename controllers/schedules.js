// (C) Isaac Hodes
// Sept 2013
'use strict';

var _        = require('underscore'),
    U        = require('../utils'),
    db       = require('../models/db'),
    Schedule = require('../models/schedule'),
    logger = require('../logger').logger;


var DISPLAY_WHITELIST = {'_id': null, 'frequency': null, 'sendTime': null,
                         'active': null, 'person': null, 'protocol': null,
                         'createdAt': null}
var cleaner = U.cleaner(DISPLAY_WHITELIST);


exports.getSchedules = function (req, res) {
    Schedule.allSchedules(req.user, req.body,
                          U.sendBack(res, function(res) {
                              return { schedules: _.map(res, cleaner) };
                          }));
};

exports.createSchedule = function(req, res) {
    var validation = {active: [false, ['true', 'false']], person: true,
                      protocol: true, sendTime: U.isTime,
                      frequency: [true, Schedule.FREQUENCIES]}
    var errors = U.validates(validation, req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    return Schedule.createSchedule(req.user, req.body,
                                   U.sendBack(res, cleaner, 201));
};

exports.getSchedule = function(req, res) {
    Schedule.getSchedule(req.user, req.params.scheduleId, U.sendBack(res, cleaner));
};

exports.updateSchedule = function(req, res) {
    var validation = {active: [false, ['true', 'false']],
                      sendTime: [false, U.isTime],
                      frequency: [false, Schedule.FREQUENCIES]}
    var errors = U.validates(validation, req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    Schedule.updateSchedule(req.user, req.params.scheduleId,
                            req.body, U.sendBack(res, cleaner));
};

exports.deleteSchedule = function(req, res) {
    Schedule.deleteSchedule(req.user, req.params.scheduleId,
                            U.sendBack(res, cleaner));
};
