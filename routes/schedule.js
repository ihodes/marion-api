// (C) Isaac Hodes
// Sept 2013
'use strict';

// mock for now
var success = function (msg) { return { success: msg }; };

exports.getSchedules = function (req, res) {
    res.send(success('getSchedules'));
}

exports.createSchedule = function (req, res) {
    res.send(success('createSchedule'));
}

exports.getSchedule = function (req, res) {
    res.send(success('getSchedule ' + req.params.scheduleid));
}

exports.updateSchedule = function (req, res) {
    res.send(success('updateSchedule ' + req.params.scheduleid));
}

exports.deleteSchedule = function (req, res) {
    res.send(success('deleteSchedule ' + req.params.scheduleid));
}

