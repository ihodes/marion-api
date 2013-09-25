'use strict';

var _      = require('underscore'),
    db     = require('./db'),
    config = require('../config'),
    utils  = require('../lib/utils');


exports.authenticate = function(username, password, callback) {
    db.Organization.findOne({key: password}, callback);
};
