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
    createdAt:    {type: Date, default: Date.now},

    params:       {type: Object},
    active:       {type: Boolean, default: true},
});
exports.Person = mongoose.model('person', personSchema);


var scheduleSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    createdAt:    {type: Date, default: Date.now},
    protocol:     {type: ObjectId, required: true, ref: 'protocol'},
    person:       {type: ObjectId, required: true, ref: 'person'},

    active:       {type: Boolean, default: true},
    sendTime:     {type: String, required: true},
    frequency:    {type: String, required: true},

});
exports.Schedule = mongoose.model('schedule', scheduleSchema);


var organizationSchema = new mongoose.Schema({
    createdAt: {type: Date, default: Date.now},
    name:      {type: String, required: true},
    key:       {type: String, default: function() {
        return uuid.v4().toString('base64');
    }},
    timezone:  {type: String, default: 'UTC'},
});
exports.Organization = mongoose.model('organization', organizationSchema);


var protocolSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    createdAt:    {type: Date, default: Date.now},

    initialState: {type: ObjectId, required: false, ref: 'state'},
    name:         {type: String, required: true},
    description:  {type: String, required: false},
    published:    {type: Boolean, default: false},
});
exports.Protocol = mongoose.model('protocol', protocolSchema);


var stateSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    protocol:     {type: ObjectId, required: true, ref: 'protocol'},
    createdAt:    {type: Date, default: Date.now},

    messages:     [{type:        {type: String, default: 'text'},
                    body:        {type: String, required: false},
                    destination: {type: String, required: true},
                    name:        {type: String, required: false}}],
    transitions:  [{pending:     [String],
                    classifier:  {type: String, required: true},
                    toState:     {type: ObjectId, ref: 'state'}}],

    isTerminal:   {type: Boolean, default: false},
});
exports.State = mongoose.model('state', stateSchema);


var responseSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    createdAt:    {type: Date, default: Date.now},

    protocolInstance: {type: ObjectId, required: true, ref: 'protocolInstance'},

    state:    {type: ObjectId, required: false, ref: 'state'},
    message:  {type: String, required: true},
    text:     {type: String, required: false},
});
exports.Response = mongoose.model('response', responseSchema);


var protocolInstanceSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    createdAt:    {type: Date, default: Date.now},

    protocol:     {type: ObjectId, required: true, ref: 'protocol'},
    schedule:     {type: ObjectId, required: false, ref: 'schedule'},
    currentState: {type: ObjectId, required: false, ref: 'state'},
    completedAt:  {type: Date, required: false},
});
exports.ProtocolInstance = mongoose.model('protocolInstance', protocolInstanceSchema);
