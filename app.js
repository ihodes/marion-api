'use strict';

var express      = require('express'),
    config       = require('./config'),
    Organization = require('./models/organization');
require('express-namespace');


// App init
var app = express();
app.use(express.bodyParser());
app.use(express.basicAuth(Organization.authenticate));


// Routing
var api = require('./routes/api');

app.namespace('/v1', api.routes(app));

app.all('*', function (req, res) {
    res.status(404).send({error: "Not Found", status: 404,
                          message: "Method does not exist."});
});


// App server setup
app.listen(config.settings.PORT, function () {
    console.log("Listening on port " + config.settings.PORT);
});

