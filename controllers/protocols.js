// (C) Isaac Hodes
// Sept 2013
'use strict';

var _        = require('underscore'),
    loch   = require('loch'),
    U        = require('../utils'),
    db       = require('../models/db'),
    Protocol = require('../models/protocol'),
    logger = require('../logger').logger;


var DISPLAY_WHITELIST = {_id: U._idToId, initialState: null,
                         name: null, description: null, createdAt: null}
var cleaner = loch.allower(DISPLAY_WHITELIST);


exports.getProtocols = function (req, res) {
    Protocol.allProtocols(req.user, U.sendBack(res, function(res) {
        return {protocols: _.map(res, cleaner) };
    }));
};

exports.createProtocol = function(req, res) {
    var validation = {initialState: false, name: true, description: true};
    var errors = loch.validates(validation, req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    return Protocol.createProtocol(req.user, req.body,
                                   U.sendBack(res, cleaner, 201));
};

exports.getProtocol = function(req, res) {
    Protocol.getProtocol(req.user, req.params.protocolId, U.sendBack(res, cleaner));
};

exports.updateProtocol = function(req, res) {
    var validation = {initialState: false, name: false, description: false};
    var errors = loch.validates(validation, req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    Protocol.updateProtocol(req.user, req.params.protocolId,
                            req.body, U.sendBack(res, cleaner));
};

exports.deleteProtocol = function(req, res) {
    Protocol.deleteProtocol(req.user, req.params.protocolId,
                            U.sendBack(res, cleaner));
};
