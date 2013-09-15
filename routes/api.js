// (C) Isaac Hodes
// Sept 2013
'use strict';

// Routes
var people    = require('./people'),
    schedules = require('./schedule'),
    responses = require('./responses'),
    protocols = require('./protocols'),
    states    = require('./states');


exports.routes = function(app) {
    return function() {
        app.get('/people', people.getPeople);
        app.post('/people', people.createPerson);
        app.get('/person/:personid', people.getPerson);
        app.post('/person/:personid', people.updatePerson);
        app.delete('/person/:personid', people.deletePerson);
        
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

        // app.namespace('/person/:personid', function () {
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
        app.get('/protocol/:protocolid', protocols.getProtocol);
        app.post('/protocol/:protocolid', protocols.updateProtocol);
        app.delete('/protocol/:protocolid', protocols.deleteProtocol);
        
        app.namespace('/protocol/:protocolid', function () {
            app.get('/states', states.getStates);
            app.post('/states', states.createState);
            app.get('/state/:stateid', states.getState);
            app.post('/state/:stateid', states.updateState);
            app.delete('/state/:stateid', states.deleteState);
        });
    }
};
