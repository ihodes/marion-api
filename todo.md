# Must get done...

## API

### Necessary before launch
* Cascading deletes, where appropriate/specified in the API docs.

### Validations
* Validate that ObjectIds passed in refer to a real, org-owned object (or else 404).
  * DEFER [need a clean way to do this asynchronously; may need promises to not have 
    callback hell. Should try to offer a nice DSL for doing so, though, ideally through
    the expected/allows maps as other validations are done].
* Validate data types passed in...  e.g. protocolInstance.completedAt.

### Testing
* Make the tests script work better... 
* Better mocks/test data.
* Test for all errors as well.
* ? All tests should refer to the Models loch validation map and make sure the response
  they recieve conforms (or something like that--so we're testing the API spec from the
  model; we shouldn't have to update it in both places. dry yo. DRY fo' life).

## Other
* Support 'expanding' subdocuments (e.g. an ObjectId would expand into the actual object).
* Handle appending/deleting from arrays such as State.Messages (or, should this be handled RESTfully).
* Handle datatype being posted to the API--since we have array in some resources (namely, State), 
  should we require text/json? Or only where it's needed? Or just allow it to be text/form-data and append
  to array with whatever solution (non-restfully or not e.g. /state/xxx/messages/append?encoded-data-here)
  we decide on for the above bullet.



## Back-end

### Processes
* Webhooks for e.g. Twilio (how to generalize this?).
  * Accept responses from Twilio and create the correct Response objects correspondingly.
* Scheduling daemon/queue mgmt/dispatch to Twilio, webhooks etc.
  * Must also accept and handle responses from webhooks, twilio, etc.
  * Must also assign a person to a given outgoing twilio # for every different protocol/or organization... 

### Transition functions
* NLP
* simple text-matching
* timeouts
* webhooks... etc


# Security
* Validate Twilio posts to the back-end
* Encrypt stored data? necessary?
* HTTPS everywhere
* BAA with Rackspace?
* Remove SMSs from Twilio's servers? BAA with Twilio? fml what do we do here?



# Vague/Silly Ideas...

## API - naming thoughts...
* Protocols should be called "Scripts".
* States should be called "Acts".
* ProtocolInstances should be called "Plays".
