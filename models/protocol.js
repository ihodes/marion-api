// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    db     = require('./db'),
    utils  = require('../utils'),
    logger = require('../logger').logger;


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
    db.Protocol.findOne(query, function(err, protocol) {
        if(!protocol) return callback(err, null);
        // TK TODO -- implement properly (or use .update instead)
        for(var key in params)
            protocol[key] = params[key];
        return protocol.save(callback);
    });
};

exports.deleteProtocol = function(org, protocolId, callback) {
    var query = { organization: org, _id: protocolId };
    db.Protocol.findOne(query, function(err, protocol) {
        return protocol.remove(function(err) { callback(err, protocol); });
    });
};
