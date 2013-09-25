// (C) Isaac Hodes
// Sept 2013
'use strict';

var _                = require('underscore'),
    loch             = require('loch'),
    U                = require('../lib/utils'),
    db               = require('../models/db'),
    ProtocolInstance = require('../models/protocolInstance'),
    logger           = require('../lib/logger').logger;


var API = {
    publicFields: {_id: U._idToId, protocol: null, schedule: null,
                   completedAt: null, createdAt: null,
                   currentState: null},
    createParams: {protocol: true, schedule: true,
                   currentState: true, completedAt: false},
    updateParams: {currentState: false, completedAt: false}
};
var cleaner = loch.allower(API.publicFields);
var createValidator = _.partial(loch.validates, API.createParams);
var updateValidator = _.partial(loch.validates, API.updateParams);


exports.getProtocolInstances = function (req, res) {
    ProtocolInstance.allProtocolInstances(req.user, U.sendBack(res, function(res) {
        return { protocolInstances: _.map(res, cleaner) };
    }));
}

exports.createProtocolInstance = function (req, res) {
    var errors = createValidator(req.body);
    if (_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    return ProtocolInstance.createProtocolInstance(req.user, req.body,
                                                   U.sendBack(res, 201, cleaner));
}

exports.getProtocolInstance = function (req, res) {
    ProtocolInstance.getProtocolInstance(req.user, req.params.protocolInstanceId,
                                         U.sendBack(res, cleaner));
}

exports.updateProtocolInstance = function (req, res) {
    var errors = updateValidator(req.body);
    if (_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    ProtocolInstance.updateProtocolInstance(req.user, req.params.protocolInstanceId, req.body,
                                            U.sendBack(res, cleaner));
}

exports.deleteProtocolInstance = function (req, res) {
    ProtocolInstance.deleteProtocolInstance(req.user, req.params.protocolInstanceId,
                                            U.sendBack(res, cleaner));
}

