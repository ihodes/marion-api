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

app.get('/people', people.getPeople)
app.post('/people', people.createPerson)
app.get('/person/:personid', people.getPerson)
app.post('/person/:personid', people.updatePerson)
app.delete('/person/:personpid', people.deletePerson)

app.get('/person/:personid/schedules', schedules.getSchedules)
app.post('/person/:personid/schedules', schedules.createSchedule)
app.get('/person/:personid/schedule/:scheduleid', schedules.getSchedule)
app.post('/person/:personid/schedule/:scheduleid', schedules.updateSchedule)
app.delete('/person/:personid/schedule/:scheduleid', schedules.deleteSchedule)

app.get('/person/:personid/responses', responses.getResponses)
app.post('/person/:personid/responses', responses.createResponse)
app.get('/person/:personid/response/:responseid', responses.getResponse)
app.post('/person/:personid/response/:responseid', responses.updateResponse)
app.delete('/person/:personid/response/:responseid', responses.deleteResponse)

app.get('/protocols', protocols.getProtocols)
app.post('/protocols', protocols.createProtocol)
app.get('/protocol/:protocolid', protocols.getProtocol)
app.post('/protocol/:protocolid', protocols.updateProtocol)
app.delete('/protocol/:protocolpid', protocols.deleteProtocol)

app.get('/protocol/:protocolid/states', states.getStates)
app.post('/protocol/:protocolid/states', states.createState)
app.get('/protocol/:protocolid/state/:stateid', states.getState)
app.post('/protocol/:protocolid/state/:stateid', states.updateState)
app.delete('/protocol/:protocolid/state/:stateid', states.deleteState)


// App server setup
app.listen(config.settings.PORT, function () {
    console.log("Listening on port " + config.settings.PORT);
});

