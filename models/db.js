'use strict';


var mongoose = require('mongoose'),
    config   = require('../config'),
    _        = require('underscore'),
    uuid     = require('node-uuid');
var ObjectId = mongoose.Schema.ObjectId;

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
    organization: {type: ObjectId, required: true, ref: 'organization'},
    params: {type: Object},
    active: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now}
});
exports.Person = mongoose.model('person', personSchema);


var scheduleSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    person: {type: ObjectId, required: true, ref: 'person'},
    protocol: {type: ObjectId, required: true, ref: 'protocol'},

    active: {type: Boolean, default: true},
    sendTime: {type: String, required: true},
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


var protocolSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    initialState: {type: ObjectId, required: false, ref: 'state'},
    name: {type: String, required: true},
    description: {type: String, required: false},
});
exports.Protocol = mongoose.model('protocol', protocolSchema);


var stateSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    protocol: {type: ObjectId, required: true, ref: 'protocol'},
    messages: {type: Object, required: false},
    transition: {type: Object, required: false},
    isTerminal: {type: Boolean, default: false}
});
exports.State = mongoose.model('state', stateSchema);


var responseSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    protocolInstance: {type: ObjectId, required: true, ref: 'protocolInstance'},
    state: {type: ObjectId, required: false, ref: 'state'},
    completedAt: {type: Date, required: false},
    createdAt: {type: Date, default: Date.now},
    responseText: {type: String, required: false}
});
exports.Response = mongoose.model('response', responseSchema);


var protocolInstanceSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    protocol: {type: ObjectId, required: true, ref: 'protocol'},
    schedule: {type: ObjectId, required: false, ref: 'schedule'},
    completedAt: {type: Date, required: false},
    createdAt: {type: Date, default: Date.now},
});
exports.ProtocolInstance = mongoose.model('protocolInstance', protocolInstanceSchema);
