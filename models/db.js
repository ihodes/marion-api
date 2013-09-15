'use strict';


var mongoose = require('mongoose'),
    config   = require('../config'),
    _        = require('underscore'),
    uuid     = require('node-uuid');


var connect = function () {
    mongoose.connect(config.settings.MONGO);

    mongoose.connection.on('error', function () {
        console.log('Mongoose error: ' + config.settings.MONGO);
    });

    mongoose.connection.on('connecting', function () {
        console.log('Mongoose connecting: ' + config.settings.MONGO);
    });

    mongoose.connection.on('connected', function () {
        console.log('Mongoose connected: ' + config.settings.MONGO);
    });

    mongoose.connection.on('open', function () {
        console.log('Mongoose open: ' + config.settings.MONGO);
    });

    mongoose.connection.on('disconnecting', function () {
        console.log('Mongoose disconnecting: ' + config.settings.MONGO);
    });

    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose disconnected: ' + config.settings.MONGO);
    });

    mongoose.connection.on('close', function () {
        console.log('Mongoose close: ' + config.settings.MONGO);
    });

    mongoose.connection.on('reconnected', function () {
        console.log('Mongoose reconnected: ' + config.settings.MONGO);
    });

    mongoose.connection.on('fullsetup', function () {
        console.log('Mongoose fullsetup: ' + config.settings.MONGO);
    });
};

connect();


var personSchema = new mongoose.Schema({
    organizationId: {type: mongoose.Schema.ObjectId, required: true},
    params: {type: Object},
    active: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now}
});
exports.Person = mongoose.model('person', personSchema);


var scheduleSchema = new mongoose.Schema({
    organizationId: {type: mongoose.Schema.ObjectId, required: true},
    personId: {type: mongoose.Schema.ObjectId, required: true},
    protocolId: {type: mongoose.Schema.ObjectId, required: true},

    active: {type: Boolean, default: true},
    time: {type: Date, required: true},
    frequency: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});
exports.Schedule = mongoose.model('schedule', scheduleSchema);


var organizationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    key: {type: String, default: function() { 
        return uuid.v4().toString('base64'); 
    }},
    timezone: {type: String, default: 'UTC'}
});
exports.Organization = mongoose.model('organization', organizationSchema);
