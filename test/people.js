'use strict';

var request  = require('request'),
    assert   = require('assert'),
    should   = require('should'),
    config   = require('./testsettings');
var BASE = config.auth_url(config.SETTINGS.ORG_KEY);
var UNAUTH_BASE = config.auth_url('bad-key');


describe('People', function() {
    var person = {
        params: {
            name: "Bilbo Baggins",
            number: "+18002125550"
        }
    }

    describe('POST /v1/people...', function () {
        it('Should respond 201 with person', 
           function(done) {
               var path = BASE + 'people';

               request.post(path, {form: person}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 201) throw new Error('Status != 201');

                   var response = JSON.parse(body);
                   should.exist(response.id);
                   person.id = response.id; 

                   response.params.name.should.equal(person.params.name);
                   response.params.number.should.equal(person.params.number);

                   done();
               });
           });
    });

    describe('POST /v1/people unauthorized...', function () {
        it('Should respond with 401 unauthorized', 
           function(done) {
               var path = UNAUTH_BASE + 'people';

               request.post(path, {form: person}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 401) throw new Error('Status != 401');
                   done();
               });
           });
    });

    describe('GET /v1/people...', function () {
        it('Should respond with people', 
           function(done) {
               var path = BASE + 'people';

               request.get(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   response.people.should.not.be.empty;
                   should.exist(response.people[0].params.name);
                   should.exist(response.people[0].params.number);

                   done();
               });
           });
    });

    describe('POST /v1/person/:id...', function () {
        it('Should respond with updated person', 
           function(done) {
               var path = BASE + 'person/' + person.id;
               var params = { active: false, params: { age: 152, number: '+17776666666' }};
               person.active = params.active;
               person.params.age = params.params.age;
               person.params.number = params.params.number;

               request.post(path, {form: params}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   response.active.should.be.false;
                   response.params.name.should.equal(person.params.name);
                   response.params.number.should.equal(person.params.number);

                   done();
               });
           });
    });

    describe('GET /v1/person/:id...', function () {
        it('Should respond with person', 
           function(done) {
               var path = BASE + 'person/' + person.id;

               request.post(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   response.active.should.be.false;
                   response.params.name.should.equal(person.params.name);
                   response.params.number.should.equal(person.params.number);

                   done();
               });
           });
    });

    describe('GET /v1/person/:id wrong id...', function () {
        it('Should respond with 404', 
           function(done) {
               var path = BASE + 'person/' + 'no-id-here';

               request.post(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 404) throw new Error('Status != 200');
                   done();
               });
           });
    });

    describe('DELETE /v1/person/:id...', function () {
        it('Should respond with person', 
           function(done) {
               var path = BASE + 'person/' + person.id;
               var params = {confirm: true};

               request.del(path, {form: params}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   response.active.should.be.false;
                   response.params.name.should.equal(person.params.name);
                   response.params.number.should.equal(person.params.number);

                   done();
               });
           });
    });
});
