'use strict';

var _     = require('underscore');


var TIME_REGEX = /^(0?\d|1\d|2[0123]):[012345]\d$/;


var complement = function(fn) {
    return function() {
        return !fn.apply(null, _.toArray(arguments));
    };
};
exports.complement = complement;


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
// `sendBack` also processes some errors, as follows:
// (If ... , then send ERRORS.requestFailed) not implemented
// If there is no result, then send ERRORS.notFound.
// If there is some other error, then send ERRORS.internalServerError
exports.sendBack = function(res, transform) {
    if(!transform) transform = _.identity;
    return function(err, results) {
        if (!results) return error(res, ERRORS.notFound);

        // Because of silliness with the objects that Mongoose returns...
        if (_.isArray(results)) results = _.map(results, getter('_doc'));
        else results = results._doc;

        if (err) {
            console.log(err);
            return error(res, ERRORS.internalServerError);
        }
        return res.send(transform(results));
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


// Returns a function which returns a recursively "cleaned" resource object;
// only allowing through parameters which are on the whitelist. 
// 
// `allowed` is an object mapping allowed keys to either null (for "allow")
// or subdocuments which need to be cleaned as well.
//
var cleaner = function(allowed) {
    return function(object) {
        var grabber = function(acc, val, key) {
            if (!_.has(allowed, key))
                return acc
            if (_.isObject(allowed[key]))
                return _.extend(acc, _.object([key], [cleaner(allowed[key])(val)]));
            return _.extend(acc, _.object([key], [val]));
        };
        return _.reduce(object, grabber, {});
    };
};
exports.cleaner = cleaner;



  ////////////////////////////
 //       Validation       //
////////////////////////////

// Accepts a map of parameters representing the params `requested` of the route
// and a map of params `expected`. `expected` is a map of expected keys to
// validation functions (e.g. function(val){ return val%2 == 0; }).
//
// If a value is 'null', defaults to the isScalar function, or `fn` if
// supplied. If a value is an array, checks that the corresponing request's
// value is in that array.
//
// Returns true if the expectation is valid, otherwise false.
//
// e.g. request = { name: 'Jason', age: 22 },
//      expects = { name: null, age: function(r){return r<25;}}
//
//      Will validate (return true).
//
var expects = function(request, expected, fn) {
    if(!_.isFunction(fn)) fn = isScalar;
    return _.every(expected, function(valid, key) {
        if (!_.has(request, key)) return false;
        if (_.isNull(valid)) return fn(request[key]);
        if (_.isArray(valid)) return oneOfer(valid)(request[key]);
        if (_.isFunction(valid)) return valid(request[key]);
        return expects(request[key], valid);
    });
};
exports.expects = expects;


// Accepts a map of parameters representing the params `requested` of the route
// and a map of params `allowed`. `allowed` is a map of allowed keys to
// functions intended to validate their values.
//
// If a value is 'null', defaults to the isScalar function, or `fn` if
// supplied. If a value is {} (the empty Object), all subparameters (nested
// maps) are considered valid. If a value is an array, checks that the
// corresponing request's value is in that array.
//
// Returns true if no more than the allowed params are in request, else false.
//
var allows = function(request, allowed, fn) {
    if(!_.isFunction(fn)) fn = isScalar;
    var extras = _.reject(request, function(val, key) {
        var aval = allowed[key];
        if (!_.has(allowed, key)) return false;
        if (_.isNull(aval)) return fn(val);
        if (_.isArray(aval)) return oneOfer(aval)(val);
        if (_.isFunction(aval)) return aval(val);
        if (_.isEmpty(aval)) return true;
        return allows(val, aval);
    });
    return _.isEmpty(extras);
};
exports.allows = allows;


// Convenience function combining allows and expected.
//
// Returns allows(request, allowed) && expects(request, expected)
//
var validates = function(request, allowed, expected) {
    return expects(request, expected) && allows(request, allowed);
};
exports.validates = validates;


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
