'use strict';

var _ = require('underscore');



  ////////////////////////////
 //       For Routes       //
////////////////////////////

var ERRORS = {
    badRequest:    {status: 400, error: "Bad Request",
                    message: "Missing required parameter(s)."},
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
        if (err) return error(res, ERRORS.internalServerError);
        if (!results) return error(res, ERRORS.notFound);
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
// object `res`.
//
// e.g. If a resourse is not found: 
//      error(res, ERRORS.notFound);
//      // (to `res`) => HTTP/1.1 404 Not Found  ...
//      //               {status: 404, error: "Not Found" ... }
//
var error = function(res, err) {
    return res.status(err.status).send(err);
}
exports.error = error;

  ////////////////////////////
 //       For Models       //
////////////////////////////

// Returns a function which returns a "cleaned" resource object; 
// only allowing through parameters which are on the whitelist. 
// Nested objects are not "cleaned", only the first object is.
exports.cleaner = function(whitelist) {
    return function(object) {
        return _.pick(object, whitelist);
    };
};


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
