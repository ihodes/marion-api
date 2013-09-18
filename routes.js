// (C) Isaac Hodes
// Sept 2013
'use strict';

// Routes
var people    = require('./controllers/people'),
    schedules = require('./controllers/schedules'),
    responses = require('./controllers/responses'),
    protocols = require('./controllers/protocols'),
    states    = require('./controllers/states');


exports.routes = function(app) {
    return function() {
        app.get('/people', people.getPeople);
        app.post('/people', people.createPerson);
        app.get('/person/:personId', people.getPerson);
        app.post('/person/:personId', people.updatePerson);
        app.delete('/person/:personId', people.deletePerson);
        
        app.get('/schedules', schedules.getSchedules);
        app.post('/schedules', schedules.createSchedule);
        app.get('/schedule/:scheduleId', schedules.getSchedule);
        app.post('/schedule/:scheduleId', schedules.updateSchedule);
        app.delete('/schedule/:scheduleId', schedules.deleteSchedule);
        
        app.get('/responses', responses.getResponses);
        app.post('/responses', responses.createResponse);
        app.get('/response/:responseId', responses.getResponse);
        app.post('/response/:responseId', responses.updateResponse);
        app.delete('/response/:responseId', responses.deleteResponse);

        // app.namespace('/person/:personId', function () {
        //     app.get('/protocolinstances',
        //             protocalInstances.getProtocolInstances);
        //     app.post('/protocolinstances',
        //              protocalInstances.createProtocolInstance);
        //     app.get('/protocolinstance/:protocolid',
        //             protocalInstances.getProtocolInstance);
        //     app.post('/protocolinstance/:protocolid',
        //              protocalInstances.updateProtocolInstance);
        //     app.delete('/protocolinstance/:protocolpid',
        //                protocalInstances.deleteProtocolInstance);
        // });
        
        app.get('/protocols', protocols.getProtocols);
        app.post('/protocols', protocols.createProtocol);
        app.get('/protocol/:protocolId', protocols.getProtocol);
        app.post('/protocol/:protocolId', protocols.updateProtocol);
        app.delete('/protocol/:protocolId', protocols.deleteProtocol);
        
        app.namespace('/protocol/:protocolId', function () {
            app.get('/states', states.getStates);
            app.post('/states', states.createState);
            app.get('/state/:stateId', states.getState);
            app.post('/state/:stateId', states.updateState);
            app.delete('/state/:stateId', states.deleteState);
        });
    }
};
