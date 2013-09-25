// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    db     = require('./db'),
    config = require('../config'),
    utils  = require('../lib/utils');


exports.allSchedules = function(org, callback) {
    db.Schedule.find({ organization: org }, callback);
};

exports.createSchedule = function(org, params, callback) {
    db.Schedule(_.extend(params, { organization: org }))
               .save(callback);
};

exports.getSchedule = function(org, scheduleId, callback) {
    var query = { _id: scheduleId, organization: org };
    db.Schedule.findOne(query, callback);
};

exports.updateSchedule = function(org, scheduleId, params, callback) {
    var query = { _id: scheduleId, organization: org };
    db.Schedule.findOne(query, function(err, schedule) {
        if(!schedule) return callback(err, null);
        // TK TODO -- implement properly (or use .update instead)
        for(var key in params)
            schedule[key] = params[key];
        schedule.save(callback);
    });
};

exports.deleteSchedule = function(org, scheduleId, callback) {
    var query = { _id: scheduleId, organization: org };
    db.Schedule.findOne(query, function(err, schedule) {
        return schedule.remove(function(err) { callback(err, schedule); });
    });
};
