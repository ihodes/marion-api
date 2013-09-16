'use strict';

var request  = require('request'),
    assert   = require('assert'),
    should   = require('should'),
    config   = require('./testsettings');
var BASE = config.auth_url(config.SETTINGS.ORG_KEY);


describe('Schedules', function() {
    var schedule = {
        frequency: 'daily',
        sendTime: '12:00:00',
        person: '52363f8cb591000000000001',
        protocol: '41224d776a326fb40f000001'
    }

    describe('POST /v1/schedules...', function () {
        it('Should respond 200 with schedule',
           function(done) {
               var path = BASE + 'schedules';
               console.log('POST ', path, JSON.stringify(schedule));

               request.post(path, {form: schedule}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   should.exist(response._id);
                   schedule._id = response._id;

                   response.frequency.should.equal(schedule.frequency);
                   response.sendTime.should.equal(schedule.sendTime);

                   done()
               });
           });
    });

    describe('GET /v1/schedules...', function () {
        it('Should respond with schedules',
           function(done) {
               var path = BASE + 'schedules';
               console.log('GET ', path);

               request.get(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.schedules.should.not.be.empty;
                   response.schedules[0].frequency.should.equal(schedule.frequency);
                   response.schedules[0].sendTime.should.equal(schedule.sendTime);

                   done()
               });
           });
    });

    describe('POST /v1/schedule/:id...', function () {
        it('Should respond with updated schedule',
           function(done) {
               var path = BASE + 'schedule/' + schedule._id;
               var params = { active: false, frequency: 'mondays'};
               schedule.active = params.active;
               schedule.frequency = params.frequency;

               console.log('POST ', path, params);

               request.post(path, {form: params}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.active.should.be.false;
                   response.frequency.should.equal(schedule.frequency);

                   done()
               });
           });
    });

    describe('GET /v1/schedule/:id...', function () {
        it('Should respond with schedule',
           function(done) {
               var path = BASE + 'schedule/' + schedule._id;
               console.log('GET ', path);

               request.post(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.active.should.be.false;
                   response.sendTime.should.equal(schedule.sendTime);
                   response.frequency.should.equal(schedule.frequency);

                   done()
               });
           });
    });

    describe('DELETE /v1/schedule/:id...', function () {
        it('Should respond with schedule',
           function(done) {
               var path = BASE + 'schedule/' + schedule._id;
               console.log('DELETE ', path);

               request.del(path, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');
                   // console.log('\nResponse: ', body, '\n\n');

                   var response = JSON.parse(body);
                   response.active.should.be.false;
                   response.sendTime.should.equal(schedule.sendTime);
                   response.frequency.should.equal(schedule.frequency);

                   done()
               });
           });
    });
});
