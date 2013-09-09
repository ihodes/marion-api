// (C) Isaac Hodes
// Sept 2013
'use strict';


// Requires
var express = require('express'),
    config  = require('./config');



// Globals
var app = express();


// Routing functions
var root = function (req, res) {
    return res.send({message: "see api docs at marion.io/api"});
};


// Routes
app.get('/', root);


// App server setup
app.listen(config.settings.PORT, function () {
    console.log("Listening on port " + config.settings.PORT);
});

