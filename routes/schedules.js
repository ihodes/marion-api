// (C) Isaac Hodes
// Sept 2013
'use strict';

var Schedule = require('../models/schedule'),
    utils    = require('../utils'),
    _        = require('underscore');


var DISPLAY_WHITELIST = ['_id', 'frequency', 'sendTime', 'active',
                         'person', 'protocol', 'createdAt'];

var cleaner = utils.cleaner(DISPLAY_WHITELIST);
var screen = utils.safeCallbacks(cleaner);

exports.getSchedules = function (req, res) {
    Schedule.allSchedules(req.user, req.body,
                          utils.sendBack(res, function(res) {
                              return { schedules: _.map(res, cleaner) };
                          }));
};

exports.createSchedule = function(req, res) {
    var required   = ['person', 'protocol', 'sendTime', 'frequency'];
    var addnl      = ['active'];
    var missing    = _.difference(required, _.keys(req.body));
    var extraneous = _.difference(_.keys(req.body), _.union(required, addnl));
    var isValid    = _.isEmpty(missing) && _.isEmpty(extraneous);
    if(!isValid)
        return utils.error(res, utils.ERRORS.badRequest,
                           { missingParams: missing,
                             notAllowed: extraneous });

    return Schedule.createSchedule(req.user, req.body,
                                   utils.sendBack(res, cleaner));
};

exports.getSchedule = function(req, res) {
    Schedule.getSchedule(req.user, req.params.scheduleId,
                         utils.sendBack(res));
};

exports.updateSchedule = function(req, res) {
    var allowed = ['active', 'sendTime', 'frequency'];
    var extraneous = _.difference(_.keys(req.body), allowed);
    if(!_.isEmpty(extraneous))
        return utils.error(res, utils.ERRORS.badRequest,
                           {notAllowed: extraneous});

    Schedule.updateSchedule(req.user, req.params.scheduleId,
                            req.body, utils.sendBack(res, cleaner));
};

exports.deleteSchedule = function(req, res) {
    Schedule.deleteSchedule(req.user, req.params.scheduleId,
                            utils.sendBack(res, cleaner));
};
