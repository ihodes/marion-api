'use strict';


var mongoose = require('mongoose'),
    config   = require('../config');

var connect = function() {
    mongoose.connect(config.settings.MONGO);

    mongoose.connection.on('error', function() {
        console.log('Mongoose error: ' + config.settings.MONGO);
    });

    mongoose.connection.on('connecting', function() {
        console.log('Mongoose connecting: ' + config.settings.MONGO);
    });

    mongoose.connection.on('connected', function() {
        console.log('Mongoose connected: ' + config.settings.MONGO);
    });

    mongoose.connection.on('open', function() {
        console.log('Mongoose open: ' + config.settings.MONGO);
    });

    mongoose.connection.on('disconnecting', function() {
        console.log('Mongoose disconnecting: ' + config.settings.MONGO);
    });

    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose disconnected: ' + config.settings.MONGO);
    });

    mongoose.connection.on('close', function() {
        console.log('Mongoose close: ' + config.settings.MONGO);
    });

    mongoose.connection.on('reconnected', function() {
        console.log('Mongoose reconnected: ' + config.settings.MONGO);
    });

    mongoose.connection.on('fullsetup', function() {
        console.log('Mongoose fullsetup: ' + config.settings.MONGO);
    });
};

connect();
