// (C) Isaac Hodes
// Sept 2013
'use strict';


// Requires
var express = require('express'),
    config  = require('./config');

// Routes
var people    = require('./routes/people'),
    schedules = require('./routes/schedule'),
    responses = require('./routes/responses'),
    protocols = require('./routes/protocols'),
    states    = require('./routes/states');



// Globals
var app = express();


// Routing functions
var root = function (req, res) {
    return res.send({message: "See api docs at marion.io/api"});
};


// Request Routing
app.get('/', root);

app.get('/v1/people', people.getPeople)
app.post('/v1/people', people.createPerson)
app.get('/v1/person/:personid', people.getPerson)
app.post('/v1/person/:personid', people.updatePerson)
app.delete('/v1/person/:personpid', people.deletePerson)

app.get('/v1/person/:personid/schedules', schedules.getSchedules)
app.post('/v1/person/:personid/schedules', schedules.createSchedule)
app.get('/v1/person/:personid/schedule/:scheduleid', schedules.getSchedule)
app.post('/v1/person/:personid/schedule/:scheduleid', schedules.updateSchedule)
app.delete('/v1/person/:personid/schedule/:scheduleid', schedules.deleteSchedule)

app.get('/v1/person/:personid/responses', responses.getResponses)
app.post('/v1/person/:personid/responses', responses.createResponse)
app.get('/v1/person/:personid/response/:responseid', responses.getResponse)
app.post('/v1/person/:personid/response/:responseid', responses.updateResponse)
app.delete('/v1/person/:personid/response/:responseid', responses.deleteResponse)

app.get('/v1/protocols', protocols.getProtocols)
app.post('/v1/protocols', protocols.createProtocol)
app.get('/v1/protocol/:protocolid', protocols.getProtocol)
app.post('/v1/protocol/:protocolid', protocols.updateProtocol)
app.delete('/v1/protocol/:protocolpid', protocols.deleteProtocol)

app.get('/v1/protocol/:protocolid/states', states.getStates)
app.post('/v1/protocol/:protocolid/states', states.createState)
app.get('/v1/protocol/:protocolid/state/:stateid', states.getState)
app.post('/v1/protocol/:protocolid/state/:stateid', states.updateState)
app.delete('/v1/protocol/:protocolid/state/:stateid', states.deleteState)


// App server setup
app.listen(config.settings.PORT, function () {
    console.log("Listening on port " + config.settings.PORT);
});

