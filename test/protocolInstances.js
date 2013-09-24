'use strict';

var request  = require('request'),
    assert   = require('assert'),
    should   = require('should'),
    config   = require('./testsettings'),
    logger = require('../logger').logger;
var BASE = config.auth_url(config.SETTINGS.ORG_KEY);


describe('ProtocolInstances', function() {
    var protocolInstance = {
        protocol: '52404329ea3eb60200000001', // fake
        schedule: '52404329ea3eb60200000001', // fake
        currentState: '52404329ea3eb60200000001', // fake
    }

    describe('POST /v1/protocolInstances...', function () {
        it('Should respond 201 with protocolInstance',
           function(done) {
               var path = BASE + 'protocolInstances';

               request.post(path, {form: protocolInstance}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 201) throw new Error('Status != 201');

                   var response = JSON.parse(body);
                   should.exist(response.id);
                   protocolInstance.id = response.id;
                   protocolInstance.createdAt = response.createdAt;

                   response.protocol.should.equal(protocolInstance.protocol);

                   done();
               });
           });
    });

    describe('GET /v1/protocolInstances...', function () {
        it('Should respond with protocolInstances',
           function(done) {
               var path = BASE + 'protocolInstances';

               request.get(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);

                   response.protocolInstances.should.not.be.empty;
                   response.protocolInstances[0].protocol
                       .should.equal(protocolInstance.protocol);

                   done();
               });
           });
    });

    describe('POST /v1/protocolInstance/:id...', function () {
        it('Should respond with updated protocolInstance',
           function(done) {
               var path = BASE + 'protocolInstance/' + protocolInstance.id;
               var params = { completedAt: '2013-09-24T17:55:55.319Z' };
               protocolInstance.completedAt = params.completedAt;

               request.post(path, {form: params}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200 is ('+res.statusCode+')');

                   var response = JSON.parse(body);
                   should.exist(response.protocol);
                   response.completedAt.should.equal(protocolInstance.completedAt);

                   done();
               });
           });
    });

    describe('GET /v1/protocolInstance/:id...', function () {
        it('Should respond with protocolInstance',
           function(done) {
               var path = BASE + 'protocolInstance/' + protocolInstance.id;

               request.post(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);

                   // testing all fields 9/24/13 iah (see TK TODO for making this DRY)
                   response.currentState.should.equal(protocolInstance.currentState);
                   response.completedAt.should.equal(protocolInstance.completedAt);
                   response.createdAt.should.equal(protocolInstance.createdAt);
                   response.schedule.should.equal(protocolInstance.schedule);
                   response.protocol.should.equal(protocolInstance.protocol);
                   response.id.should.equal(protocolInstance.id);

                   done();
               });
           });
    });

    describe('DELETE /v1/protocolInstance/:id...', function () {
        it('Should respond with protocolInstance',
           function(done) {
               var path = BASE + 'protocolInstance/' + protocolInstance.id;

               request.del(path, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   response.protocol.should.equal(protocolInstance.protocol);

                   done();
               });
           });
    });
});
