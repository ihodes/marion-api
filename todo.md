# Validations
*   DEFER [need a clean way to do this asynchronously; may need promises to not have callback hell. Should try to offer a nice DSL for doing so, though, ideally through the expected/allows maps as other validations are done.] Validate that ObjectIds passed in refer to a real, org-owned object
* Improve error messages that the API passes back to user (e.g. affected params)
  * Could/should validation fns throw Errors(...) with ... the message to be passed back?


# Logging
* Use [Winston](https://github.com/flatiron/winston) for logging
  * Make middleware to log all requests (including time, path, req.body)
  * Log to loggly on PRODUCTION
* Log ALL THE THINGS
  * Mongoose logging middleware
  * Express logging middleware
  * Errors. ALL OF THE ERRORS.


# API - naming thoughts...
* Protocols should be called "Scripts"
* States should be called "Acts"
* ProtocolInstances should be called "Plays" 
