'use strict';

var _ = require('underscore');



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
        if (err) {
            console.log(err);
            return error(res, ERRORS.internalServerError);
        }
        return res.send(transform(results));
    }
};


// Validates (nested TK TODO) params of a request, ensuring all required 
// params are present, and runs the callback if so. If not, 400 errors out.
exports.validateParams = function(req, res, paramList, callback) {
    if(_.every(paramList, _.partial(_.has, req.body)))
        return callback(req, res);
    else utils.error(res, ERRORS.badRequest);
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

// Returns a function which returns a "cleaned" resource object; 
// only allowing through parameters which are on the whitelist. 
// Nested objects are not "cleaned", only the first object is.
exports.cleaner = function(whitelist) {
    return function(object) {
        return _.pick(object, whitelist);
    };
};



// depreciated... (not used...)
// Returns a function which creates callback functions that only allow the
// params `cleaner` allows through. Useful for models.
//
// e.g. function callback(err, res) { console.log(res); };
//      var cleaner = function(object) { return _.pick(object, WHITELIST); };
//      safeCallbacks(cleaner)(callback)(error, {id: 123, private: "SECRET"})
//      => /* prints */ {id: 123}
exports.safeCallbacks = function(cleaner) {
    return function(callback) {
        return function(err, rawData, _etc) {
            var result;
            // Dispatch on type of raw data passed in
            if(_.isArray(rawData)){
                result = [];
                for(var idx in rawData)
                    result.push(cleaner(rawData[idx]));
            } else if(_.isObject(rawData)) {
                result = cleaner(rawData);
            } else {
                // Maybe should throw exception here...
                result = rawData;
            }
            callback(err, result, _etc);
        };
    };
};



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


var complement = function(fn) {
    return function() {
        return !fn.call(null, _.toArray(arguments));
    };
};
exports.complement = complement;


var isScalar = function(o) {
    return !(_.isObject(o) || _.isArray(o) || _.isArguments(o));
};


var oneOfer = function(list) {
    if(arguments.length > 1) list = _.toArray(arguments);
    return function(el) {
        return _.contains(list, el);
    }
};
exports.oneOfer = oneOfer;
