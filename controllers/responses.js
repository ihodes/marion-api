// (C) Isaac Hodes
// Sept 2013
'use strict';

var _        = require('underscore'),
    loch     = require('loch'),
    U        = require('../lib/utils'),
    db       = require('../models/db'),
    Response = require('../models/response'),
    logger   = require('../lib/logger').logger;

var API = {
    publicFields: {_id: U._idToId, person: null, state: null, text: null,
                   protocolInstance: null, messageName: null, createdAt: null,
                   completedAt: null},
    createParams: {state: true, protocolInstance: true, text: false,
                   messageName: true},
    updateParams: {text: false}
};
var cleaner = loch.allower(API.publicFields);
var createValidator = _.partial(loch.validates, API.createParams);
var updateValidator = _.partial(loch.validates, API.updateParams);


exports.getResponses = function (req, res) {
    Response.allResponses(req.user, U.sendBack(res, function(res) {
        return {responses: _.map(res, cleaner) };
    }));
}

exports.createResponse = function (req, res) {
    var errors = createValidator(req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    return Response.createResponse(req.user, req.body, U.sendBack(res, 201, cleaner));
}

exports.getResponse = function (req, res) {
    Response.getResponse(req.user, req.params.responseId, U.sendBack(res, cleaner));
}

exports.updateResponse = function (req, res) {
    var errors = updateValidator(req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    Response.updateResponse(req.user, req.params.responseId, req.body,
                            U.sendBack(res, cleaner));
}

exports.deleteResponse = function (req, res) {
    Response.deleteResponse(req.user, req.params.responseId, U.sendBack(res, cleaner));
}

