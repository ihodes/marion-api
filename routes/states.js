// (C) Isaac Hodes
// Sept 2013
'use strict';

// mock for now
var success = function (msg) { return { success: msg }; };

exports.getStates = function (req, res) {
    res.send(success('getStates'));
}

exports.createState = function (req, res) {
    res.send(success('createState'));
}

exports.getState = function (req, res) {
    res.send(success('getState ' + req.params.stateid));
}

exports.updateState = function (req, res) {
    res.send(success('updateState ' + req.params.stateid));
}

exports.deleteState = function (req, res) {
    res.send(success('deleteState ' + req.params.stateid));
}

