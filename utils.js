'use strict';

var _     = require('underscore');


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
        if (!results) return error(res, ERRORS.notFound);

        // Because of silliness with the objects that Mongoose returns...
        if (_.isArray(results)) results = _.map(results, getter('_doc'));
        else results = results._doc;

        if (err) {
            console.log(err);
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


// Returns a function which returns a recursively "cleaned" resource object;
// only allowing through parameters which are on the whitelist.
//
// `allowed` is an object mapping allowed keys to either null (for "allow")
// or subdocuments which need to be cleaned as well, or to functions which are
// applied to the (key, value) to be returned and return an object to be merged
// into the final object.
//
var cleaner = function(allowed) {
    return function(object) {
        var grabber = function(acc, val, key) {
            if (!_.has(allowed, key))
                return acc
            if (_.isObject(allowed[key]) && !_.isFunction(allowed[key]))
                return _.extend(acc, o(key, cleaner(allowed[key])(val)));

            if (_.isNull(allowed[key])) return _.extend(acc, o(key, val));

            return _.extend(acc, allowed[key](key, val));
        };
        return _.reduce(object, grabber, {});
    };
};
exports.cleaner = cleaner;



  ////////////////////////////
 //       Validation       //
////////////////////////////
//
// `validate`
//
// `validation(validation, requestBody)`
//
// Takes a validation object, `validation`, which is a map (which may be nested)
// of keys to requirements, and a request body (a map of request parameters).
//
// Returns `true` if the params meet the specification of `validation` otherwise
// returns an object containing the parameters which caused errors.
//
//
// ## Validation Maps
//
// Requirements are tuples (arrays of length 2) of
// [required::Boolean, validator::function]. An example `validation` map might
// look like the follow.
//
// {name: [true, atLeastOfLength(5)],
//  age: false,
//  parents: [false, { mother: false, father: false }]
//  ssn: [false, function(o) { return containsNDigits(9); }]}
//
//
// ## Validators (validation functions)
//
// A validation function takes in (val, key), and returns true if the value is
// valid, else returns an error string (or false, for a default error message).
//
// As an alternative to providing a validation function, you can say with true
// or false whether the key is required (above with `age`, `mother`, `father`):
//
//    key: required
//
// In addition to providing validation function, the second element in the tuple
// may be another `validation` map, to which the rules above will be applied
// recursively (see `parents` key above).
//
// If the validation map is empty, all parameters will be allowed within it.
// If you have certain requirements inside of *that* map (i.e. properties MUST
// include some key and value, and then may allow whatever others), use a
// helper function (allows or expects) or create your own function
//
// Instead of a validation function you may use an array of values with which
// the value being validated  will be tested for inclusion within.
// For example, if a value must be either 'true' or 'false', you could use:
//
//    {key: [true, ['true', 'false']]}
//
// Which is equivalent to:
//
//    {key: [true, function(o) { return _.contains(['true', 'false'], o)}]}
//
//
// ## Errors
//
// The error object which is returned when validation fails will look like the
// following:
//
// {errorKey: 'error message', ...}
//
// For example:
//
//    {name: 'name is required',
//     ssn: 'ssn must have exactly 9 digits',
//     parents: {sister: 'sister is not a valid parameter.'}}
//
// Or, if parents had been a String instead of an Object:
//
//    { parents: 'parents must be an object.'}
//
// As you can see, the 'ssn' error is very informative. That is because of the way
// validation function are defined. Validation function must return true if the
// value is valid, else it must return a function which takes a key (the key being
// validated), and returns a string which will be used as the error message.
//
// false may be used instead of a string, but then the error listed for the param
// will be "{keyname} is not valid."
//
// If a key is required and is not provided, the error message is "{keyname} is
// required".
//
// If a value is supposed to be found in an array (using the array shortcut notation
// above), the error message is "{keyname} must be one of {*array}".
//
// If there is a key in the requestBody that does not appear in the validation map,
// it will result in error '{keyname} is not accepted'.
//
var validates = function(validation, requestBody) {
    var cloner = function(base) {
        return _.reduce(base, function(cloned, val, key) {
            if(_.isObject(val)) return _.extend(cloned, o(key, cloner(val)));
            else return _.extend(cloned, o(key, _.clone(val)));
        }, {});
    }
    requestBody = cloner(requestBody);
    var valitron2000 = function(errors, valid, key) {
        if (valid.length === 2) {
            var required = valid[0];
            valid = valid[1];
        } else {
            var required = valid;
            valid = truthy;
        }
        // Handle absent keys...
        if (!required && !_.has(requestBody, key))
            return errors
        else if (required && !_.has(requestBody, key))
            return _.extend(errors, o(key, MISSING(key)));
        var requestVal = requestBody[key];
        delete requestBody[key];

        // Assuming henceforth that the key exists in `requestBody`...
        if (_.isArray(valid)) {
            var array = valid;
            if(oneOfer(array)(requestVal)) return errors;
            return _.extend(errors, o(key, CONTAIN(key, array)));
        }
        if (_.isFunction(valid)) {
            var valResponse = valid(requestVal, key);
            if (valResponse === true) return errors;
            if (valResponse === false) valResponse = DEFAULT(key);
            return _.extend(errors, o(key, valResponse));
        }
        if (_.isObject(valid)) {
            if (!_.isObject(requestVal))
                return _.extend(errors, o(key, OBJECT(key)));
            if (_.isEmpty(valid))
                return errors;

            var recurseErrors = validates(valid, requestVal);
            if (_.isEmpty(recurseErrors)) return errors;
            else return _.extend(errors, o(key, recurseErrors));
        }
    }
    var extraniousKeyFinder = function(errors, val, key) {
        return _.extend(errors, o(key, EXTRA(key)));
    }
    var errors = _.reduce(validation, valitron2000, {});
    _.extend(errors, _.reduce(requestBody, extraniousKeyFinder, {}));
    if (_.isEmpty(errors)) return true;
    return errors;
}
exports.validates = validates;

// Built-in error messages (used above)
var MISSING = function(key) { return key + ' is required'; };
var EXTRA   = function(key) { return key + ' is not accepted'; };
var CONTAIN = function(key, vals) { return key + ' must be one of ' + vals; };
var OBJECT  = function(key) { return key + ' must be an object'; };
var DEFAULT = function(key) { return key + ' is not valid'; };
_.extend(exports, {MISSING: MISSING, CONTAIN: CONTAIN,
                   OBJECT: OBJECT, DEFAULT: DEFAULT, EXTRA: EXTRA});

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
