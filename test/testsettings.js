'use strict';

var SETTINGS = {
    ORG_KEY: 'test-key',
    SERVER: 'localhost',
    PORT: process.env.PORT,
    API_VERSION: 'v1',
}
exports.SETTINGS = SETTINGS;

exports.auth_url = function(auth) {
    var end  = SETTINGS.SERVER + ':' + SETTINGS.PORT + '/' + SETTINGS.API_VERSION + '/';
    return 'http://:' + auth + '@' + end;
}
