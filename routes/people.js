// (C) Isaac Hodes
// Sept 2013
'use strict';

var Person = require('../models/person'),
    utils  = require('../utils');


exports.getPeople = function (req, res) {
    Person.allPeople(req.user, utils.sendBack(res, function(res) {
        return { people: res };
    }));
};

exports.createPerson = function(req, res) {
    Person.createPerson(req.user, req.body, utils.sendBack(res));
};

exports.getPerson = function(req, res) {
    Person.getPerson(req.user, req.params.personid, utils.sendBack(res));
};

exports.updatePerson = function(req, res) {
    Person.updatePerson(req.user, req.params.personid, req.body,
                        utils.sendBack(res));
};

exports.deletePerson = function(req, res) {
    Person.deletePerson(req.user, req.params.personid, req.body,
                        utils.sendBack(res));
};
