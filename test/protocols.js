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
               console.log('POST ', path, JSON.stringify(protocol));

               request.post(path, {form: protocol}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 201) throw new Error('Status != 201');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   should.exist(response._id);
                   protocol._id = response._id;

                   response.name.should.equal(protocol.name);
                   response.description.should.equal(protocol.description);

                   done()
               });
           });
    });

    describe('GET /v1/protocols...', function () {
        it('Should respond with protocols',
           function(done) {
               var path = BASE + 'protocols';
               console.log('GET ', path);

               request.get(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.protocols.should.not.be.empty;
                   response.protocols[0].name.should.equal(protocol.name);
                   response.protocols[0].description.should.equal(protocol.description);

                   done()
               });
           });
    });

    describe('POST /v1/protocol/:id...', function () {
        it('Should respond with updated protocol',
           function(done) {
               var path = BASE + 'protocol/' + protocol._id;
               var params = { initialState: '523b244a948b0f75a1000002' };
               protocol.initialState = params.initialState;

               console.log('POST ', path, params);

               request.post(path, {form: params}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   should.exist(response.initialState);
                   response.initialState.should.equal(protocol.initialState);

                   done()
               });
           });
    });

    describe('GET /v1/protocol/:id...', function () {
        it('Should respond with protocol',
           function(done) {
               var path = BASE + 'protocol/' + protocol._id;
               console.log('GET ', path);

               request.post(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.initialState.should.equal(protocol.initialState);
                   response.name.should.equal(protocol.name);

                   done()
               });
           });
    });

    describe('DELETE /v1/protocol/:id...', function () {
        it('Should respond with protocol',
           function(done) {
               var path = BASE + 'protocol/' + protocol._id;
               console.log('DELETE ', path);

               request.del(path, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.initialState.should.equal(protocol.initialState);

                   done()
               });
           });
    });
});
