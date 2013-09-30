'use strict';


var mongoose = require('mongoose'),
    config   = require('../config'),
    _        = require('underscore'),
    uuid     = require('node-uuid'),
    logger   = require('../lib/logger').logger,
    U        = require('../lib/utils'),
    loch     = require('loch');
require('../lib/db_initializer'); // connect to db
var ObjectId = mongoose.Schema.ObjectId;


var personSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    createdAt:    {type: Date, default: Date.now},

    params:       {type: Object},
    active:       {type: Boolean, default: true},
});
personSchema.post('save', function(doc) {
    logger.info('Saved Person: ' + JSON.stringify(doc.toObject()));
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
scheduleSchema.post('save', function(doc) {
    logger.info('Saved Schedule: '+JSON.stringify(doc.toObject()));
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
organizationSchema.post('save', function(doc) {
    logger.info('Saved Organization: '+JSON.stringify(doc.toObject()));
});
exports.Organization = mongoose.model('organization', organizationSchema);


var protocolSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    createdAt:    {type: Date, default: Date.now},

    initialState: {type: ObjectId, required: false, ref: 'state'},
    name:         {type: String, required: true},
    description:  {type: String, required: false},
});
protocolSchema.post('save', function(doc) {
    logger.info('Saved Protocol: '+JSON.stringify(doc.toObject()));
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
stateSchema.post('save', function(doc) {
    logger.info('Saved State: '+JSON.stringify(doc.toObject()));
});
exports.State = mongoose.model('state', stateSchema);


var responseSchema = new mongoose.Schema({
    organization: {type: ObjectId, required: true, ref: 'organization'},
    createdAt:    {type: Date, default: Date.now},

    protocolInstance: {type: ObjectId, required: true, ref: 'protocolInstance'},

    state:       {type: ObjectId, required: false, ref: 'state'},
    messageName: {type: String, required: true},
    text:        {type: String, required: false},
});
responseSchema.post('save', function(doc) {
    logger.info('Saved Response: '+JSON.stringify(doc.toObject()));
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
protocolInstanceSchema.post('save', function(doc) {
    logger.info('Saved ProtocolInstance: '+JSON.stringify(doc.toObject()));
});
exports.ProtocolInstance = mongoose.model('protocolInstance', protocolInstanceSchema);
