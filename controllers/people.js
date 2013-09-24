// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    loch   = require('loch'),
    U      = require('../utils'),
    Person = require('../models/person'),
    logger = require('../logger').logger;


var cleaner = loch.allower({_id: U._idToId, params: null, active: null});

exports.getPeople = function (req, res) {
    Person.allPeople(req.user, U.sendBack(res, function(res) {
        return { people: _.map(res, cleaner) };
    }));
};

exports.createPerson = function(req, res) {
    var errors = loch.validates({params: [false, {}], active: false}, req.body);
    if(_.isObject(errors))
        return U.error(res, U.ERRORS.badRequest, {errors: errors});
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
