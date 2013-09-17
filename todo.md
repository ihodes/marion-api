# Validations
*   DEFER [need a clean way to do this asynchronously; may need promises to not have callback hell. Should try to offer a nice DSL for doing so, though, ideally through the expected/allows maps as other validations are done.] Validate that ObjectIds passed in refer to a real, org-owned object
  * NEED TO ENSURE that people can't make objects for other org's objects... above is important for safety. Should also be enforced in the schema/in the model.
* Improve error messages that the API passes back to user (e.g. affected params)
  * Could/should validation fns throw Errors(...) with ... the message to be passed back?


# Logging
* Log to loggly on PRODUCTION
* Log ALL THE THINGS
  * When things are created. (would be nice if you could hook into Mongoose for this)
  * Errors. ALL OF THE ERRORS.


# API - naming thoughts...
* Protocols should be called "Scripts"
* States should be called "Acts"
* ProtocolInstances should be called "Plays" 
