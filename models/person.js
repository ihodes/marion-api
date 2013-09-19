// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    db     = require('./db'),
    utils  = require('../utils');


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
    db.Person.findOne(query, function(err, person) {
        if(!person) return callback(err, null);
        if(params.active) person.active = params.active;
        // TK TODO -- implement properly (or use .update instead)
        for(var key in params.params) {
            person.params[key] = params.params[key];
            person.markModified('params.'+key);
        }
        return person.save(callback);
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
