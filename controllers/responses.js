// (C) Isaac Hodes
// Sept 2013
'use strict';

var _        = require('underscore'),
    loch     = require('loch'),
    U        = require('../utils'),
    db       = require('../models/db'),
    Response = require('../models/response'),
    logger   = require('../logger').logger;


var DISPLAY_WHITELIST = {_id: null, person: null, state: null,
                         protocolInstance: null,
                         intent: null, createdAt: null,
                         responseText: null, completedAt: null}
var cleaner = loch.allower(DISPLAY_WHITELIST);


exports.getResponses = function (req, res) {
    Response.allResponses(req.user, U.sendBack(res, function(res) {
        return {responses: _.map(res, cleaner) };
    }));
}

exports.createResponse = function (req, res) {
    var validation = {state: true, protocolInstance: true, completedAt: false,
                      responseText: false};
    var errors = loch.validates(validation, req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    return Response.createResponse(req.user, req.body, U.sendBack(res, cleaner, 201));
}

exports.getResponse = function (req, res) {
    Response.getResponse(req.user, req.params.responseId, U.sendBack(res, cleaner));
}

exports.updateResponse = function (req, res) {
    var validation = {completedAt: false, responseText: false};
    var errors = loch.validates(validation, req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    Response.updateResponse(req.user, req.params.responseId, req.body, U.sendBack(res, cleaner));
}

exports.deleteResponse = function (req, res) {
    Response.deleteResponse(req.user, req.params.responseId, U.sendBack(res, cleaner));
}

