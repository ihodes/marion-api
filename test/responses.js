'use strict';

var request  = require('request'),
    assert   = require('assert'),
    should   = require('should'),
    logger   = require('../logger').logger,
    config   = require('./testsettings');
var BASE = config.auth_url(config.SETTINGS.ORG_KEY);
var UNAUTH_BASE = config.auth_url('bad-key');


describe('Responses', function() {
    var response = {
        protocolInstance: '52404329ea3eb60200000001', // fake
        state: '5240459dea3eb60200000004', // fake
        messageName: 'theSimpleQuestion', // so, also fake
        text: 'I FEEL BAD, OKAY?' // all too real
    };

    describe('POST /v1/responses...', function () {
        it('Should respond 201 with response',
           function(done) {
               var path = BASE + 'responses';

               request.post(path, {form: response}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 201) throw new Error('Status != 201, is ('+res.statusCode+')');

                   var resp = JSON.parse(body);

                   should.exist(resp.id);
                   response.id = resp.id;

                   resp.messageName.should.equal(response.messageName);

                   done();
               });
           });
    });

    describe('POST /v1/responses unauthorized...', function () {
        it('Should respond with 401 unauthorized',
           function(done) {
               var path = UNAUTH_BASE + 'responses';

               request.post(path, {form: response}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 401) throw new Error('Status != 401');
                   done();
               });
           });
    });

    describe('GET /v1/responses...', function () {
        it('Should respond with responses', 
           function(done) {
               var path = BASE + 'responses';

               request.get(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var resp = JSON.parse(body);
                   resp.responses.should.not.be.empty;
                   should.exist(resp.responses[0].text);

                   done();
               });
           });
    });

    describe('POST /v1/response/:id...', function () {
        it('Should respond with updated response', 
           function(done) {
               var path = BASE + 'response/' + response.id;
               var params = { messageName: 'newVarName' };
               response.messageName = params.messageName;

               request.post(path, {form: params}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var resp = JSON.parse(body);
                   resp.messageName.should.equal(response.messageName);

                   done();
               });
           });
    });

    describe('GET /v1/response/:id...', function () {
        it('Should respond with response', 
           function(done) {
               var path = BASE + 'response/' + response.id;

               request.post(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var resp = JSON.parse(body);
                   should.exist(resp.text);

                   done();
               });
           });
    });

    describe('GET /v1/response/:id wrong id...', function () {
        it('Should respond with 404', 
           function(done) {
               var path = BASE + 'response/' + 'no-id-here';

               request.post(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 404) throw new Error('Status != 200');
                   done();
               });
           });
    });

    describe('DELETE /v1/response/:id...', function () {
        it('Should respond with response', 
           function(done) {
               var path = BASE + 'response/' + response.id;
               var params = {confirm: true};

               request.del(path, {form: params}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var resp = JSON.parse(body);
                   resp.messageName.should.equal(response.messageName);
                   resp.text.should.equal(response.text);

                   done();
               });
           });
    });
});
