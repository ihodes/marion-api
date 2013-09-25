// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    db     = require('./db'),
    U      = require('../lib/utils'),
    logger = require('../lib/logger').logger;


exports.allProtocolInstances = function(org, callback) {
    db.ProtocolInstance.find({ organization: org }, callback);
};

exports.createProtocolInstance = function(org, params, callback) {
    params = _.extend(params, { organization: org });
    db.ProtocolInstance(params).save(callback);
};

exports.getProtocolInstance = function(org, protocolInstanceId, callback) {
    var query = { organization: org, _id: protocolInstanceId };
    db.ProtocolInstance.findOne(query, callback);
};

exports.updateProtocolInstance = function(org, protocolInstanceId, params, callback) {
    var query = { organization: org, _id: protocolInstanceId };
    db.ProtocolInstance.findOne(query, function (err, protocolInstance) {
        if (!protocolInstance) return callback(err, null);
        protocolInstance = _.omit(protocolInstance.toObject(), '__v', '_id');
        var newProtocolInstance = U.deepMergeJSON(protocolInstance, params);
        db.ProtocolInstance.update(query, newProtocolInstance, function() {
            db.ProtocolInstance.findOne(query, callback);
        });
    });
};

exports.deleteProtocolInstance = function(org, protocolInstanceId, callback) {
    var query = { organization: org, _id: protocolInstanceId };
    db.ProtocolInstance.findOne(query, function(err, protocolInstance) {
        return protocolInstance.remove(function(err) { callback(err, protocolInstance); });
    });
};
