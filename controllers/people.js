// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    loch   = require('loch'),
    U      = require('../utils'),
    Person = require('../models/person'),
    logger = require('../logger').logger;


var DISPLAY_WHITELIST = {_id: null, params: null, active: null};
var cleaner = loch.allower(DISPLAY_WHITELIST);


exports.getPeople = function (req, res) {
    var errors = loch.validates({params: [false, {}], active: false}, req.body);
    if(_.isObject(errors))
       return U.error(res, U.ERRORS.badRequest, {errors: errors});
    Person.allPeople(req.user, U.sendBack(res, function(res) {
        return { people: _.map(res, cleaner) };
    }));
};

exports.createPerson = function(req, res) {
    Person.createPerson(req.user, req.body,
                        U.sendBack(res, cleaner, 201));
};

exports.getPerson = function(req, res) {
    Person.getPerson(req.user, req.params.personId, U.sendBack(res, cleaner));
};

exports.updatePerson = function(req, res) {
    var errors = loch.validates({params: [false, {}], active: [false, ['true', 'false']]},
                             req.body);
    if(_.isObject(errors))
       return U.error(res, U.ERRORS.badRequest, {errors: errors});
    Person.updatePerson(req.user, req.params.personId, req.body,
                        U.sendBack(res, cleaner));
};

exports.deletePerson = function(req, res) {
    Person.deletePerson(req.user, req.params.personId, req.body,
                        U.sendBack(res, cleaner));
};
