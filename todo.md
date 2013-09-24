# Validations
*   DEFER [need a clean way to do this asynchronously; may need promises to not have callback hell. Should try to offer a nice DSL for doing so, though, ideally through the expected/allows maps as other validations are done.] Validate that ObjectIds passed in refer to a real, org-owned object (or else 404)


# Logging
* Log ALL THE THINGS
  * When things are created. (would be nice if you could hook into Mongoose for this)
  * Errors. ALL OF THE ERRORS.


# API - naming thoughts...
* Protocols should be called "Scripts"
* States should be called "Acts"
* ProtocolInstances should be called "Plays" 


# Testing
* Make the tests script work better... 
* Better mocks/test data
* Test for all errors as well
* Don't wrap (e.g. test/states.js) in a callback so we can use a protocol id to test with... it's ugly


# API
* Correctly allow/require and insert/update all spec'd parameters
* Support 'expanding' subdocuments (e.g. an ObjectId would expand into the actual object)
* Cascading deletes


# Processes
* Webhooks for e.g. Twilio (how to generalize this?)
* Scheduling daemon/queue mgmt/dispatch to Twilio etc
