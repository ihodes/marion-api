'use strict';

var request  = require('request'),
    assert   = require('assert'),
    should   = require('should'),
    config   = require('./testsettings');
var BASE = config.auth_url(config.SETTINGS.ORG_KEY);


describe('Schedules', function() {
    var schedule = {
        frequency: 'daily',
        sendTime: '12:00',
        person: '52363f8cb591000000000001',
        protocol: '41224d776a326fb40f000001'
    }

    describe('POST /v1/schedules...', function () {
        it('Should respond 201 with schedule',
           function(done) {
               var path = BASE + 'schedules';

               request.post(path, {form: schedule}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 201) throw new Error('Status != 201');

                   var response = JSON.parse(body);
                   should.exist(response.id);
                   schedule.id = response.id;

                   response.frequency.should.equal(schedule.frequency);
                   response.sendTime.should.equal(schedule.sendTime);

                   done();
               });
           });
    });

    describe('GET /v1/schedules...', function () {
        it('Should respond with schedules',
           function(done) {
               var path = BASE + 'schedules';

               request.get(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   response.schedules.should.not.be.empty;
                   should.exist(response.schedules[0].sendTime);
                   should.exist(response.schedules[0].frequency);

                   done();
               });
           });
    });

    describe('POST /v1/schedule/:id...', function () {
        it('Should respond with updated schedule',
           function(done) {
               var path = BASE + 'schedule/' + schedule.id;
               var params = { active: false, frequency: 'mondays'};
               schedule.active = params.active;
               schedule.frequency = params.frequency;

               request.post(path, {form: params}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   response.active.should.be.false;
                   response.frequency.should.equal(schedule.frequency);

                   done();
               });
           });
    });

    describe('GET /v1/schedule/:id...', function () {
        it('Should respond with schedule',
           function(done) {
               var path = BASE + 'schedule/' + schedule.id;

               request.post(path, {}, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   response.active.should.be.false;
                   response.sendTime.should.equal(schedule.sendTime);
                   response.frequency.should.equal(schedule.frequency);

                   done();
               });
           });
    });

    describe('DELETE /v1/schedule/:id...', function () {
        it('Should respond with schedule',
           function(done) {
               var path = BASE + 'schedule/' + schedule.id;

               request.del(path, function(err, res, body) {
                   if(err) throw err;
                   if(res.statusCode != 200) throw new Error('Status != 200');

                   var response = JSON.parse(body);
                   response.active.should.be.false;
                   response.sendTime.should.equal(schedule.sendTime);
                   response.frequency.should.equal(schedule.frequency);

                   done();
               });
           });
    });
});
