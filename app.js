// (C) Isaac Hodes
// Sept 2013
'use strict';


// Required
var express     = require('express'),
    __namespace = require('express-namespace'),
    config      = require('./config');

// Routes
var people    = require('./routes/people'),
    schedules = require('./routes/schedule'),
    responses = require('./routes/responses'),
    protocols = require('./routes/protocols'),
    states    = require('./routes/states');

// Globals
var app = express();


// Request Routing
app.get('/', function (req, res) { res.send({message: "See api docs at marion.io/api"}); });

app.namespace('/v1', function () {
    app.get('/people', people.getPeople);
    app.post('/people', people.createPerson);
    app.get('/person/:personid', people.getPerson);
    app.post('/person/:personid', people.updatePerson);
    app.delete('/person/:personpid', people.deletePerson);
    
    app.namespace('/person/:personid', function () {
        app.get('/schedules', schedules.getSchedules);
        app.post('/schedules', schedules.createSchedule);
        app.get('/schedule/:scheduleid', schedules.getSchedule);
        app.post('/schedule/:scheduleid', schedules.updateSchedule);
        app.delete('/schedule/:scheduleid', schedules.deleteSchedule);
        
        app.get('/responses', responses.getResponses);
        app.post('/responses', responses.createResponse);
        app.get('/response/:responseid', responses.getResponse);
        app.post('/response/:responseid', responses.updateResponse);
        app.delete('/response/:responseid', responses.deleteResponse);
    });
    
    app.get('/protocols', protocols.getProtocols);
    app.post('/protocols', protocols.createProtocol);
    app.get('/protocol/:protocolid', protocols.getProtocol);
    app.post('/protocol/:protocolid', protocols.updateProtocol);
    app.delete('/protocol/:protocolpid', protocols.deleteProtocol);
    
    app.namespace('/protocol/:protocolid', function () {
        app.get('/states', states.getStates);
        app.post('/states', states.createState);
        app.get('/state/:stateid', states.getState);
        app.post('/state/:stateid', states.updateState);
        app.delete('/state/:stateid', states.deleteState);
    });
})
app.all('*', function (req, res) { res.status(404).send({message: "Not Found."}); } );

// App server setup
app.listen(config.settings.PORT, function () {
    console.log("Listening on port " + config.settings.PORT);
});

