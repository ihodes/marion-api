// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    loch   = require('loch'),
    U      = require('../lib/utils'),
    Person = require('../models/person'),
    logger = require('../lib/logger').logger;


var API = {
    publicFields: {_id: U._idToId, params: null, active: null},
    createParams: {params: [false, {}], active: false},
    updateParams: {params: [false, {}], active: false}
};
var cleaner = loch.allower(API.publicFields);
var createValidator = _.partial(loch.validates, API.createParams);
var updateValidator = _.partial(loch.validates, API.updateParams);


exports.getPeople = function (req, res) {
    Person.allPeople(req.user, U.sendBack(res, function(res) {
        return { people: _.map(res, cleaner) };
    }));
};

exports.createPerson = function(req, res) {
    var errors = createValidator(req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
    Person.createPerson(req.user, req.body,
                        U.sendBack(res, 201, cleaner));
};

exports.getPerson = function(req, res) {
    Person.getPerson(req.user, req.params.personId, U.sendBack(res, cleaner));
};

exports.updatePerson = function(req, res) {
    var errors = updateValidator(req.body);
    if(_.isObject(errors))
       return U.error(res, U.ERRORS.badRequest, {errors: errors});
    Person.updatePerson(req.user, req.params.personId, req.body,
                        U.sendBack(res, cleaner));
};

exports.deletePerson = function(req, res) {
    Person.deletePerson(req.user, req.params.personId, req.body,
                        U.sendBack(res, cleaner));
};
