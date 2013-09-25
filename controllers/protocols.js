// (C) Isaac Hodes
// Sept 2013
'use strict';

var _        = require('underscore'),
    loch     = require('loch'),
    U        = require('../lib/utils'),
    db       = require('../models/db'),
    Protocol = require('../models/protocol'),
    logger   = require('../lib/logger').logger;


var API = {
    publicFields: {_id: U._idToId, initialState: null,
                   name: null, description: null, createdAt: null},
    createParams: {initialState: false, name: true,
                   description: true},
    updateParams: {initialState: false, name: false,
                   description: false}
};
var cleaner = loch.allower(API.publicFields);
var createValidator = _.partial(loch.validates, API.createParams);
var updateValidator = _.partial(loch.validates, API.updateParams);


exports.getProtocols = function (req, res) {
    Protocol.allProtocols(req.user, U.sendBack(res, function(res) {
        return {protocols: _.map(res, cleaner) };
    }));
};

exports.createProtocol = function(req, res) {
    var errors = createValidator(req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    return Protocol.createProtocol(req.user, req.body,
                                   U.sendBack(res, 201, cleaner));
};

exports.getProtocol = function(req, res) {
    Protocol.getProtocol(req.user, req.params.protocolId, U.sendBack(res, cleaner));
};

exports.updateProtocol = function(req, res) {
    var errors = updateValidator(req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    Protocol.updateProtocol(req.user, req.params.protocolId,
                            req.body, U.sendBack(res, cleaner));
};

exports.deleteProtocol = function(req, res) {
    Protocol.deleteProtocol(req.user, req.params.protocolId,
                            U.sendBack(res, cleaner));
};
