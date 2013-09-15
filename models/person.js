// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    db     = require('./db'),
    utils  = require('../utils');


var PERSON_PARAM_WHITELIST = ['_id', 'active', 'params'];

var cleaner = utils.cleaner(PERSON_PARAM_WHITELIST);
var screen = utils.safeCallbacks(cleaner);


exports.allPeople = function(org,  callback) {
    db.Person.find({ organizationId: org._id }, screen(callback));
};

exports.createPerson = function(org, params, callback) {
    var params = cleaner(params);
    params = _.extend(params, { organizationId: org._id });
    db.Person(params).save(screen(callback));
};

exports.getPerson = function(org, personid, callback) {
    var query = { organizationId: org._id, _id: personid };
    db.Person.findOne(query, screen(callback));
};

exports.updatePerson = function(org, personid, params, callback) {
    var query = { organizationId: org._id, _id: personid };
    db.Person.findOne(query, function(err, person) {
        var cb = screen(callback);
        if(!person) return cb(err, null);
        if(params.active)
            person.active = params.active;
        for(var key in params.params) {
            person.params[key] = params.params[key];
            person.markModified('params.'+key);
        }
        return person.save(cb);
    });
};

exports.deletePerson = function(org, personid, params, callback) {
    var query = { organizationId: org._id, _id: personid };
    db.Person.findOne(query, function(err, person) {
        var cb = screen(callback);
        if(person && params.confirm == 'true')
            return person.remove(function(err) { cb(err, person); });
        else
            return cb(err, person);
    });
};
