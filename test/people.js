'use strict';

var request  = require('request'),
    assert   = require('assert'),
    should   = require('should'),
    config   = require('./testsettings');
var BASE = config.SETTINGS.URL;

describe('people', function() {
    var person = {
        params: {
            name: "Bilbo Baggins",
            number: "+18002125550"
        }
    }

    describe('POST /v1/people', function () {
        it('Should respond 200 with person', 
           function(done) {
               var path = BASE + 'people';
               console.log('POST ', path, JSON.stringify(person));

               request.post(path, {form: person}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   should.exist(response._id);
                   person._id = response._id; 

                   response.params.name.should.equal(person.params.name);
                   response.params.number.should.equal(person.params.number);

                   done()
               });
           });
    });

    describe('GET /v1/people', function () {
        it('Should respond with people', 
           function(done) {
               var path = BASE + 'people';
               console.log('GET ', path);

               request.get(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.people.should.not.be.empty;
                   response.people[0].params.name.should.equal(person.params.name);
                   response.people[0].params.number.should.equal(person.params.number);

                   done()
               });
           });
    });

    describe('POST /v1/person/:id', function () {
        it('Should respond with updated person', 
           function(done) {
               var path = BASE + 'person/' + person._id;
               var params = { active: false, params: { age: 152, number: '+17776666666' }};
               person.active = params.active;
               person.params.age = params.params.age;
               person.params.number = params.params.number;

               console.log('POST ', path, params);

               request.post(path, {form: params}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.active.should.be.false;
                   response.params.name.should.equal(person.params.name);
                   response.params.number.should.equal(person.params.number);

                   done()
               });
           });
    });

    describe('GET /v1/person/:id', function () {
        it('Should respond with person', 
           function(done) {
               var path = BASE + 'person/' + person._id;
               console.log('GET ', path);

               request.post(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.active.should.be.false;
                   response.params.name.should.equal(person.params.name);
                   response.params.number.should.equal(person.params.number);

                   done()
               });
           });
    });

    describe('DELETE /v1/person/:id', function () {
        it('Should respond with person', 
           function(done) {
               var path = BASE + 'person/' + person._id;
               var params = {confirm: true};
               console.log('DELETE ', path, params);

               request.del(path, {form: params}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.active.should.be.false;
                   response.params.name.should.equal(person.params.name);
                   response.params.number.should.equal(person.params.number);

                   done()
               });
           });
    });
});
