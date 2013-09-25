// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    db     = require('./db'),
    utils  = require('../lib/utils'),
    logger = require('../lib/logger').logger;


exports.allResponses = function(org, callback) {
    db.Response.find({ organization: org }, callback);
};

exports.createResponse = function(org, params, callback) {
    params = _.extend(params, { organization: org });
    db.Response(params).save(callback);
};

exports.getResponse = function(org, responseId, callback) {
    var query = { organization: org, _id: responseId };
    db.Response.findOne(query, callback);
};

exports.updateResponse = function(org, responseId, params, callback) {
    var query = { organization: org, _id: responseId };
    db.Response.findOne(query, function(err, response) {
        if(!response) return callback(err, null);
        // TK TODO -- implement properly (or use .update instead)
        for(var key in params)
            response[key] = params[key];
        return response.save(callback);
    });
};

exports.deleteResponse = function(org, responseId, callback) {
    var query = { organization: org, _id: responseId };
    db.Response.findOne(query, function(err, response) {
        return response.remove(function(err) { callback(err, response); });
    });
};
