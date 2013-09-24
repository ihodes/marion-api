'use strict';

var request  = require('request'),
    assert   = require('assert'),
    should   = require('should'),
    config   = require('./testsettings'),
    logger = require('../logger').logger;
var BASE = config.auth_url(config.SETTINGS.ORG_KEY);


describe('Protocols', function() {
    var protocol = {
        name: 'test protocol',
        description: 'the test protocol for the test suite.'
    }

    describe('POST /v1/protocols...', function () {
        it('Should respond 201 with protocol',
           function(done) {
               var path = BASE + 'protocols';

               request.post(path, {form: protocol}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 201) throw new Error('Status != 201');

                   var response = JSON.parse(body);
                   should.exist(response.id);
                   protocol.id = response.id;

                   response.name.should.equal(protocol.name);
                   response.description.should.equal(protocol.description);

                   done();
               });
           });
    });

    describe('GET /v1/protocols...', function () {
        it('Should respond with protocols',
           function(done) {
               var path = BASE + 'protocols';

               request.get(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   response.protocols.should.not.be.empty;
                   should.exist(response.protocols[0].name);

                   done();
               });
           });
    });

    describe('POST /v1/protocol/:id...', function () {
        it('Should respond with updated protocol',
           function(done) {
               var path = BASE + 'protocol/' + protocol.id;
               var params = { initialState: '523b244a948b0f75a1000002' };
               protocol.initialState = params.initialState;

               request.post(path, {form: params}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   should.exist(response.initialState);
                   response.initialState.should.equal(protocol.initialState);

                   done();
               });
           });
    });

    describe('GET /v1/protocol/:id...', function () {
        it('Should respond with protocol',
           function(done) {
               var path = BASE + 'protocol/' + protocol.id;

               request.post(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   response.initialState.should.equal(protocol.initialState);
                   response.name.should.equal(protocol.name);

                   done();
               });
           });
    });

    describe('DELETE /v1/protocol/:id...', function () {
        it('Should respond with protocol',
           function(done) {
               var path = BASE + 'protocol/' + protocol.id;

               request.del(path, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   response.initialState.should.equal(protocol.initialState);

                   done();
               });
           });
    });
});
