// (C) Isaac Hodes
// Sept 2013
'use strict';

var Person = require('../models/person'),
    utils  = require('../utils');
var ERRORS = utils.ERRORS;


exports.getPeople = function (req, res) {
    Person.allPeople(req, utils.sendBack(res, function(res) {
        return { people: res };
    }));
};

exports.createPerson = function(req, res) {
    Person.createPerson(req, utils.sendBack(res));
};

exports.getPerson = function(req, res) {
    Person.getPerson(req, utils.sendBack(res));
};

exports.updatePerson = function(req, res) {
    Person.updatePerson(req, utils.sendBack(res));
};

exports.deletePerson = function(req, res) {
    Person.deletePerson(req, utils.sendBack(res));
};
