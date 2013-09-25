// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    db     = require('./db'),
    U      = require('../lib/utils'),
    logger = require('../lib/logger').logger;


exports.allProtocols = function(org, callback) {
    db.Protocol.find({ organization: org }, callback);
};

exports.createProtocol = function(org, params, callback) {
    params = _.extend(params, { organization: org });
    db.Protocol(params).save(callback);
};

exports.getProtocol = function(org, protocolId, callback) {
    var query = { organization: org, _id: protocolId };
    db.Protocol.findOne(query, callback);
};

exports.updateProtocol = function(org, protocolId, params, callback) {
    var query = { organization: org, _id: protocolId };
    db.Protocol.findOne(query, function (err, protocol) {
        if (!protocol) return callback(err, null);
        protocol = _.omit(protocol.toObject(), '__v', '_id');
        var newProtocol = U.deepMergeJSON(protocol, params);
        db.Protocol.update(query, newProtocol, function() {
            db.Protocol.findOne(query, callback);
        });
    });
};

exports.deleteProtocol = function(org, protocolId, callback) {
    var query = { organization: org, _id: protocolId };
    db.Protocol.findOne(query, function(err, protocol) {
        return protocol.remove(function(err) { callback(err, protocol); });
    });
};
