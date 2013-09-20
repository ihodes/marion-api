'use strict';

var request  = require('request'),
    assert   = require('assert'),
    should   = require('should'),
    config   = require('./testsettings'),
    db       = require('../models/db'),
    logger   = require('../logger').logger;
var BASE = config.auth_url(config.SETTINGS.ORG_KEY);


var state = {};

db.Protocol.findOne(function(err, protocol) {
    state.protocol = protocol._id;
    BASE = BASE + 'protocol/' + state.protocol + '/';

describe('States', function() {

    describe('POST /v1/states...', function () {
        it('Should respond 201 with state',
           function(done) {
               var path = BASE + 'states';
               console.log('POST ', path);

               request.post(path, {form: {}}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 201) throw new Error('Status != 201 (is '+res.statusCode+')');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   should.exist(response._id);
                   state._id = response._id;

                   should.exist(response.protocol);

                   done()
               });
           });
    });

    describe('GET /v1/states...', function () {
        it('Should respond with states',
           function(done) {
               var path = BASE + 'states';
               console.log('GET ', path);

               request.get(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200 (is '+res.statusCode+')');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.states.should.not.be.empty;
                   should.exist(response.states[0].protocol);

                   done()
               });
           });
    });

    describe('POST /v1/state/:id...', function () {
        it('Should respond with updated state',
           function(done) {
               var path = BASE + 'state/' + state._id;
               var params = { messages: {id:'523b244a948b0f75a1000001'} };

               console.log('POST ', path, params);

               request.post(path, {form: params}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200 (is '+res.statusCode+')');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   should.exist(response.protocol);

                   done()
               });
           });
    });

    describe('GET /v1/state/:id...', function () {
        it('Should respond with state',
           function(done) {
               var path = BASE + 'state/' + state._id;
               console.log('GET ', path);

               request.post(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200 (is '+res.statusCode+')');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   should.exist(response.protocol);

                   done()
               });
           });
    });

    describe('DELETE /v1/state/:id...', function () {
        it('Should respond with state',
           function(done) {
               var path = BASE + 'state/' + state._id;
               console.log('DELETE ', path);

               request.del(path, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200 (is '+res.statusCode+')');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.protocol.should.equal(String(state.protocol));

                   done()
               });
           });
    });
});

});
