// (C) Gleb Chuvpilo
// June 19, 2013
'use strict';

var node_uuid = require('node-uuid'),
    crypto = require('crypto');

exports.uuid = function () {
    var shasum = crypto.createHash('sha1'); // sha1 is short; sha256 is long
    shasum.update(node_uuid.v1() + node_uuid.v4()); // concatenate time-based and random uuid
    return shasum.digest('hex');
};
