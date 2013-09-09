// (C) Isaac Hodes
// Sept 2013
'use strict';

// mock for now
var success = function (msg) { return { success: msg }; };

exports.getResponses = function (req, res) {
    res.send(success('getResponses'));
}

exports.createResponse = function (req, res) {
    res.send(success('createResponse'));
}

exports.getResponse = function (req, res) {
    res.send(success('getResponse ' + req.params.responseid));
}

exports.updateResponse = function (req, res) {
    res.send(success('updateResponse ' + req.params.responseid));
}

exports.deleteResponse = function (req, res) {
    res.send(success('deleteResponse ' + req.params.responseid));
}

