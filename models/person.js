// (C) Isaac Hodes
// Sept 2013
'use strict';

var _      = require('underscore'),
    db     = require('./db'),
    config = require('../config'),
    utils  = require('../utils');


var PERSON_PARAM_WHITELIST = ['_id', 'active', 'params'];

var cleaner = utils.cleaner(PERSON_PARAM_WHITELIST);
var screen = utils.safeCallbacks(cleaner);


exports.allPeople = function(req, callback) {
    db.Person.find({ organizationId: req.user._id }, screen(callback));
};

exports.createPerson = function(req, callback) {
    var params = cleaner(req.body);
    params = _.extend(params, { organizationId: req.user._id });
    db.Person(params).save(screen(callback));
};

exports.getPerson = function(req, callback) {
    var query = { organizationId: req.user._id, _id: req.params.personid };
    db.Person.findOne(query, screen(callback));
};

exports.updatePerson = function(req, callback) {
    var query = { organizationId: req.user._id, _id: req.params.personid };
    db.Person.findOne(query, function(err, person) {
        var params = req.body;
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

exports.deletePerson = function(req, callback) {
    var query = { organizationId: req.user._id, _id: req.params.personid };
    db.Person.findOne(query, function(err, person) {
        var params = req.body;
        var cb = screen(callback);
        if(person && params.confirm == 'true') {
            return person.remove(function(err) { cb(err, person); });
        } else {
            return cb(err, person);
        }
    });
};
