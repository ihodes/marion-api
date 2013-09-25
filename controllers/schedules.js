// (C) Isaac Hodes
// Sept 2013
'use strict';

var _        = require('underscore'),
    loch     = require('loch'),
    U        = require('../lib/utils'),
    db       = require('../models/db'),
    Schedule = require('../models/schedule'),
    logger   = require('../lib/logger').logger;


var API = {
    publicFields: {_id: U._idToId, frequency: null, sendTime: null,
                   active: null, person: null, protocol: null,
                   createdAt: null},
    createParams: {active: [false, ['true', 'false']], person: true,
                   protocol: true, sendTime: [true, U.isTime],
                   frequency: [true, frequencies]},
    updateParams: {active: [false, ['true', 'false']],
                   sendTime: [false, U.isTime],
                   frequency: [false, frequencies]}
};
var cleaner = loch.allower(API.publicFields);
var createValidator = _.partial(loch.validates, API.createParams);
var updateValidator = _.partial(loch.validates, API.updateParams);

var frequencies  = ['sundays', 'mondays', 'tuesdays', 'wednesdays',
                    'thursdays', 'fridays', 'saturdays', 'daily',
                    'once'];


exports.getSchedules = function (req, res) {
    Schedule.allSchedules(req.user, U.sendBack(res, function(res) {
        return { schedules: _.map(res, cleaner) };
    }));
};

exports.createSchedule = function(req, res) {
    var errors = createValidator(req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    return Schedule.createSchedule(req.user, req.body,
                                   U.sendBack(res, 201, cleaner));
};

exports.getSchedule = function(req, res) {
    Schedule.getSchedule(req.user, req.params.scheduleId, U.sendBack(res, cleaner));
};

exports.updateSchedule = function(req, res) {
    var errors = updateValidator(req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    Schedule.updateSchedule(req.user, req.params.scheduleId,
                            req.body, U.sendBack(res, cleaner));
};

exports.deleteSchedule = function(req, res) {
    Schedule.deleteSchedule(req.user, req.params.scheduleId,
                            U.sendBack(res, cleaner));
};
