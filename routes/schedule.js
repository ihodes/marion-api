// (C) Isaac Hodes
// Sept 2013
'use strict';


var Schedule = require('../models/schedule'),
    utils    = require('../utils');


exports.getSchedules = function (req, res) {
    Schedule.allSchedules(req.personid, req.body, function(err, results) {
        if(err) console.log(error);
        else res.send({schedules: results});
    });
};

exports.createSchedule = function(req, res) {
    Schedule.createSchedule(req.params.personid, req.body,
                            utils.sendBack(res));
};

exports.getSchedule = function(req, res) {
    Schedule.getSchedule(req.params.scheduleid, utils.sendBack(res));
};

exports.updateSchedule = function(req, res) {
    Schedule.updateSchedule(req.params.scheduleid, req.body,
                            utils.sendBack(res));
};

exports.deleteSchedule = function(req, res) {
    Schedule.deleteSchedule(req.params.scheduleid, utils.sendBack(res));
};
