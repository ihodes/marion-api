// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    loch   = require('loch'),
    U      = require('../lib/utils'),
    State  = require('../models/state'),
    logger = require('../lib/logger').logger;


var API = {
    publicFields: {_id: U._idToId, protocol: null, isTerminal: null,
                   messages: null, transitions: null},
    createParams: {messages: [true,
                              [{ type: false, body: false,
                                 destination: true, name: false }]],
                   transitions: [false,
                                 [{pending: [true, loch.isArrayOfScalars],
                                   classifier: true,
                                   toState: true}]],
                   isTerminal: [false, _.isBoolean]},
    updateParams: {messages: [true,
                              [{ type: false, body: false,
                                 destination: true, name: false }]],
                   transitions: [false,
                                 [{pending: [true, loch.isArrayOfScalars],
                                   classifier: true,
                                   toState: true}]],
                   isTerminal: [false, _.isBoolean]}
};
var cleaner = loch.allower(API.publicFields);
var createValidator = _.partial(loch.validates, API.createParams);
var updateValidator = _.partial(loch.validates, API.updateParams);


exports.getStates = function (req, res) {
    State.allStates(req.user, req.params.protocolId, U.sendBack(res, function(res) {
        return { states: _.map(res, cleaner) };
    }));
};

exports.createState = function(req, res) {
    var errors = createValidator(req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    return State.createState(req.user, req.params.protocolId, req.body,
                             U.sendBack(res, 201, cleaner));
};

exports.getState = function(req, res) {
    State.getState(req.user, req.params.stateId, U.sendBack(res, cleaner));
};

exports.updateState = function(req, res) {
    var errors = updateValidator(req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    State.updateState(req.user, req.params.stateId, req.body,
                      U.sendBack(res, cleaner));
};

exports.deleteState = function(req, res) {
    State.deleteState(req.user, req.params.stateId,
                            U.sendBack(res, cleaner));
};
