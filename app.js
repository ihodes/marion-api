'use strict';

var _            = require('underscore'),
    express      = require('express'),
    config       = require('./config'),
    Organization = require('./models/organization'),
    logging       = require('./lib/logger');
require('express-namespace');
var logger = logging.logger;


// App init
logger.info('Starting application...');

var app = express();
app.use(express.bodyParser());
app.use(express.basicAuth(Organization.authenticate));
app.use(logging.requestLogger);


// Routing
var api = require('./routes');

app.all('v1', function(req, res) {
    res.send({message: "You are connected to the API", status: 200});
});

app.namespace('/v1', api.routes(app));

app.all('*', function (req, res) {
    res.status(404).send({error: "Not Found", status: 404,
                          message: "Method does not exist."});
});

// App server setup
app.listen(config.settings.PORT, function () {
    logger.info("Listening on port " + config.settings.PORT);
});

