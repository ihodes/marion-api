// (C) Isaac Hodes
// Sept 2013
'use strict';

// mock for now
var success = function (msg) { return { success: msg }; };

exports.getProtocols = function (req, res) {
    res.send(success('getProtocols'));
}

exports.createProtocol = function (req, res) {
    res.send(success('createProtocol'));
}

exports.getProtocol = function (req, res) {
    res.send(success('getProtocol ' + req.params.protocolid));
}

exports.updateProtocol = function (req, res) {
    res.send(success('updateProtocol ' + req.params.protocolid));
}

exports.deleteProtocol = function (req, res) {
    res.send(success('deleteProtocol ' + req.params.protocolid));
}

