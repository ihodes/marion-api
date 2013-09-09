// (C) Isaac Hodes
// Sept 2013
'use strict';

// mock for now
var success = function (msg) { return { success: msg }; };

exports.getPeople = function (req, res) {
    res.send(success('getPeople'));
}

exports.createPerson = function (req, res) {
    res.send(success('createPerson'));
}

exports.getPerson = function (req, res) {
    res.send(success('getPerson ' + req.params.personid));
}

exports.updatePerson = function (req, res) {
    res.send(success('updatePerson ' + req.params.personid ));
}

exports.deletePerson = function (req, res) {
    res.send(success('deletePerson ' + req.params.personid));
}

