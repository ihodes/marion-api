// (C) Isaac Hodes
// Sept 2013
'use strict';

var Person = require('../models/person'),
    U      = require('../utils');


exports.getPeople = function (req, res) {
    var allowed = {params: {}, active: ['true', 'false']};
    if(!U.validates(req.body, allowed, {}))
       return U.error(res, U.ERRORS.badRequest);
    Person.allPeople(req.user, U.sendBack(res, function(res) {
        return { people: res };
    }));
};

exports.createPerson = function(req, res) {
    Person.createPerson(req.user, req.body, U.sendBack(res));
};

exports.getPerson = function(req, res) {
    Person.getPerson(req.user, req.params.personId, U.sendBack(res));
};

exports.updatePerson = function(req, res) {
    var allowed = {params: {}, active: ['true', 'false']};
    if(!U.validates(req.body, allowed, {}))
       return U.error(res, U.ERRORS.badRequest);
    Person.updatePerson(req.user, req.params.personId, req.body,
                        U.sendBack(res));
};

exports.deletePerson = function(req, res) {
    Person.deletePerson(req.user, req.params.personId, req.body,
                        U.sendBack(res));
};

