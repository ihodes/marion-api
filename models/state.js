// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    db     = require('./db'),
    logger = require('../lib/logger').logger,
    U      = require('../lib/utils');


exports.allStates = function(org, protocolId, callback) {
    db.State.find({ organization: org, protocol: protocolId }, callback);
};

exports.createState = function(org, protocolId, params, callback) {
    params = _.extend(params, { organization: org, protocol: protocolId });
    db.State(params).save(callback);
};

exports.getState = function(org, stateId, callback) {
    var query = { organization: org, _id: stateId };
    db.State.findOne(query, callback);
};

exports.updateState = function(org, stateId, params, callback) {
    var query = { organization: org, _id: stateId };
    db.State.findOne(query, function (err, state) {
        if (!state) return callback(err, null);
        state = _.omit(state.toObject(), '__v', '_id');
        var newState = U.deepMergeJSON(state, params);
        db.State.update(query, newState, function() {
            db.State.findOne(query, callback);
        });
    });
};

exports.deleteState = function(org, stateId, callback) {
    var query = { organization: org, _id: stateId };
    db.State.findOne(query, function(err, state) {
        return state.remove(function(err) { callback(err, state); });
    });
};
