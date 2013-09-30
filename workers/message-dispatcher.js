"use strict";

var REDIS_URL = require('../config').settings.REDIS_URL;

var rtg  = require('url').parse(REDIS_URL),
    host = rtg.hostname,
    port = rtg.port,
    pass = rtg.auth.split(":")[1];


// Queue...

var resque = require('coffee-resque').connect({
    host:     host,
    port:     port,
    password: pass
});


resque.enqueue('math', 'add', [1,2]);


// Worker...

var myJobs = {
  add:     function(a, b, callback) { callback(a + b); },
  succeed: function(arg, callback) { callback(); },
  fail:    function(arg, callback) { callback(new Error('fail')); }
};

var worker = require('coffee-resque').connect({
    host:     host,
    port:     port,
    password: pass
}).worker('*', myJobs);

worker.on('success', function(worker, queue, job, result) {
    console.log(result);
});


worker.start();
