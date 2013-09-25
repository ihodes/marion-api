// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    db     = require('./db'),
    U      = require('../lib/utils'),
    loch   = require('loch'),
    logger = require('../lib/logger').logger;


exports.allPeople = function(org, callback) {
    db.Person.find({ organization: org }, callback);
};

exports.createPerson = function(org, params, callback) {
    params = _.extend(params, { organization: org });
    db.Person(params).save(callback);
};

exports.getPerson = function(org, personId, callback) {
    var query = { organization: org, _id: personId };
    db.Person.findOne(query, callback);
};

exports.updatePerson = function(org, personId, params, callback) {
    var query = { organization: org, _id: personId };
    db.Person.findOne(query, function (err, person) {
        person = _.omit(person.toObject(), '__v', '_id');
        var newPerson = U.deepMergeJSON(person, params);
        db.Person.update(query, newPerson, function() {
            db.Person.findOne(query, callback);
        });
    });
};

exports.deletePerson = function(org, personId, params, callback) {
    var query = { organization: org, _id: personId };
    db.Person.findOne(query, function(err, person) {
        if(person && params.confirm == 'true')
            return person.remove(function(err) { callback(err, person); });
        else
            return callback(err, person);
    });
};
