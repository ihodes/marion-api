"use strict";

var db    = require('../models/db'),
   logger = require('../lib/logger').logger;
var REDIS_URL = require('../config').settings.REDIS_URL;

var rtg  = require('url').parse(REDIS_URL),
    host = rtg.hostname,
    port = rtg.port,
    pass = rtg.auth.split(":")[1];


// Queue...

var resque = require('coffee-resque').connect({
    host:     host,
    port:     port,
    password: pass
});


var getSchedulesForNow = function(nowHour, callback) {
    db.Schedule.find({ active: true, sendTime: String(nowHour) })
        .populate('protocol')
        .exec(callback);
});


// NB: schedules must have a populated Protocol field
var dispatchScheduledMessages = function(err, schedules) {
    _.each(schedules, function(schedule) {
        if (err) throw new Error(err);
        db.State.findOne(schedule.protocol.initialState, dispatchStatesMessages);
    });
};


var dispatchStatesMessages = function(err, state) {
    newProtocolInstanceFromSchedule(schedule, function(err, pi) {
        if (err) throw new Error(err);
        _.each(state.messages, function(message) {
            resque.enqueue('messages', message.type, [pi, message.destination, message.body]); 
            logger.info("Enqueued message " + JSON.stringify(message));
        });
    });
};


// NB: schedule must have a populated Protocol field
var createProtocolInstanceFromSchedule = function(schedule, callback) {
    var pi = { organization: schedule.organization,
               person:       schedule.person,
               protocol:     schedule.protocol,
               currentState: schedule.protocol.initialState };
    db.ProtocolInstance(pi, callback);
};

// the magic

var processSchedules = function(nowHour) {
    logger.info('Beginning processing scheduled protocols...')
    getSchedulesForNow(nowHour, dispatchScheduledMessages);
    logger.info('Processing scheduled protocols ended...')
};


var main = exports.main = function() {
    processSchedules((new Date).getHours());
}
