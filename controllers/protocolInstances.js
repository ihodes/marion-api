// (C) Isaac Hodes
// Sept 2013
'use strict';

var _                = require('underscore'),
    loch             = require('loch'),
    U                = require('../utils'),
    db               = require('../models/db'),
    ProtocolInstance = require('../models/protocolInstance'),
    logger           = require('../logger').logger;


var DISPLAY_WHITELIST = {_id: U._idToId, protocol: null, schedule: null,
                         completedAt: null, createdAt: null}
var cleaner = loch.allower(DISPLAY_WHITELIST);


exports.getProtocolInstances = function (req, res) {
    ProtocolInstance.allProtocolInstances(req.user, U.sendBack(res, function(res) {
        return {protocolInstances: _.map(res, cleaner) };
    }));
}

exports.createProtocolInstance = function (req, res) {
    var validation = {protocol: true, schedule: true};
    var errors = loch.validates(validation, req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    return ProtocolInstance.createProtocolInstance(req.user, req.body,
                                                   U.sendBack(res, cleaner, 201));
}

exports.getProtocolInstance = function (req, res) {
    ProtocolInstance.getProtocolInstance(req.user, req.params.protocolInstanceId,
                                         U.sendBack(res, cleaner));
}

exports.updateProtocolInstance = function (req, res) {
    return U.error(res, U.ERRORS.methodNotAllowed);
}

exports.deleteProtocolInstance = function (req, res) {
    ProtocolInstance.deleteProtocolInstance(req.user, req.params.protocolInstanceId,
                                            U.sendBack(res, cleaner));
}

