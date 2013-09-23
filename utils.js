'use strict';

var _      = require('underscore'),
    logger = require('./logger').logger;

var TIME_REGEX = /^(0?\d|1\d|2[0123]):[012345]\d$/;


var complement = function(fn) {
    return function() {
        return !fn.apply(null, _.toArray(arguments));
    };
};
exports.complement = complement;


var object = function(k,v) { return _.object([k], [v]); }
var existy = function(v) { return !(v === undefined) && !(v === null); };
var falsey = function(v) { return !existy(v) || (v === false); };
var truthy = function(v) { return !falsey(v); };
var o = object;
_.extend(exports, {object: object, existy: existy, falsey: falsey, truthy: truthy});

  ////////////////////////////
 //       For Routes       //
////////////////////////////

var ERRORS = {
    badRequest:    {status: 400, error: "Bad Request",
                    message: "Missing or bad parameter(s)."},
    unauthorized:  {status: 401, error: "Unauthorized",
                    message: "Missing API Key."},
    requestFailed: {status: 402, error: "Request Failed",
                    message: "Parameters valid, but request failed."},
    notFound:      {status: 404, error: "Not Found",
                    message: "Resource does not exist."},
    // 500s
    internalServerError:      {status: 500, error: "Internal Server Error",
                               message: "There has been an error."}
}
exports.ERRORS = ERRORS;


// Use as a simple callback which sends the results or errors to the response
// object `res`. If a `transform` function is given, it is applied that to 
// results before sending.
// 
// If status is not provided, assumes 200.
//
// `sendBack` also processes some errors, as follows:
// (If ... , then send ERRORS.requestFailed) not implemented
// If there is no result, then send ERRORS.notFound.
// If there is some other error, then send ERRORS.internalServerError
exports.sendBack = function(res, transform, status) {
    if(!existy(transform)) transform = _.identity;
    return function(err, results) {
        if (!results) {
            logger.warn('[utils::sendBack] 404 No result returned: (' + err + ')')
            return error(res, ERRORS.notFound);
        }

        // Because of silliness with the objects that Mongoose returns...
        if (_.isArray(results)) results = _.map(results, getter('_doc'));
        else results = results._doc;

        if (err) {
            logger.error('[utils::sendBack] Internal 500 error occured: ' + err);
            return error(res, ERRORS.internalServerError);
        }
        if(!existy(status)) status = 200;
        return res.send(transform(results), status);
    }
};


// Send an error with appropriate status code (from ERRORS) to the response
// object `res`. Pass `addnl` (object) to add more information to the error.
//
// e.g. If a resourse is not found:
//      error(res, ERRORS.notFound);
//      // (to `res`) => HTTP/1.1 404 Not Found  ...
//      //               {status: 404, error: "Not Found" ... }
//
var error = function(res, err, addnl) {
    return res.status(err.status).send(_.extend(err, addnl));
}
exports.error = error;


  /////////////////////////
 // Validator functions //
/////////////////////////

var isScalar = function(o) {
    return !(_.isObject(o) || _.isArray(o) || _.isArguments(o));
};
exports.isScalar = isScalar;


var isTime = function(str) {
    return TIME_REGEX.test(str);
};
exports.isTime = isTime;


var oneOfer = function(list) {
    if(arguments.length > 1) list = _.toArray(arguments);
    return function(el) {
        return _.contains(list, el);
    }
};
exports.oneOfer = oneOfer;


// DEBUG fns
var printer = function(o) {
    console.log(o);
    return o;
}
exports.printer = printer;

var getter = function(key) { return function(o) { return o[key]; }};
