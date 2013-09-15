# Marion Health SMS API v1 Spec

Endpoint is https://api.getmarion.com/v1

Auth is basic auth, username 'api' and password <api-key>.

## Resources

* Person
* Schedule
* Response
* Protocol
  * ProtocolInstance
  * State


### The Person Object

A Person is the entity interacting with a message Protocol. They're the ones with the cell phones, responding to SMS messages.

    id            ::  id
    active        ::  boolean (default: true)
    params        ::  {}


### The Schedule Object

A schedule ties a Protocol to a Person, initiating the protocol on a recurring basis (starting at `start_at`), or once, depending on the `frequency`.

    id            ::  id
    active        ::  boolean (default: true)
    person        ::  id, references Person
    protocol      ::  id, references Protocol
    sendTime      ::  string (HH:MM:SS)
    frequency     ::  string \in [daily, monday..sunday, once]


### The Response Object

Responses represent a Person's response to a given Protocol. 

`intent` is a summary of Person's communication via the protocol. `messages_exchanged` is a map of state_strings to messages recieved from the Person at that State. `completed_at` is the time at which the Protocol reached a terminal state, or timed out (thus terminating the Protocol).

    id                    ::  id
    person                ::  id, references Person
    protocol              ::  id, references Protocol
    intent                ::  string
    completed_at          ::  datetime
    messages_exchanged    ::  {string:string}
    
    
### The Protocol Object

A protocol is a script reprsenting messages sent out by Marion SMS and the consequent messages and actions Marion SMS should take given certain responses by the user. A protocol is represented by a finite state machine. Its states (represented by the State resource) execute actions upon entry; this could be sending additional messages, and/or hitting specified webhooks (see docs on webhooks). 

Protocols are created with a name and description, and states are then added to it. In order for a Protocol to be valid, one State must be designated the initial state, and ther emust be a path to a terminal state from there. There may be no non-terminating sequences; the protocol must halt.

    id                ::  id
    states            ::  [id, references State, ...]
    initial_state     ::  id, references State
    name              ::  string
    description       ::  string
    
    
### The ProtocolInstance

A "run" of the Protocol on a Person at a given Scheduled time; contains its responses and the intent Person wished to convey with her answers.

...

    
### The State Object

A schedule ties a Protocol to a Person, initiating the protocol on a recurring basis (starting at `start_at`), or once, depending on the `frequency`.

    id                ::  id
    protocol          ::  id, references Protocol
    terminal          ::  boolean
    on_enter          ::  {messages: [string, ...], webhooks: [url, ...]}
    transitions       ::  {transition:state_id, ...}
    


<br><br>
###### Transitions (for states)

A transition is a string that specifies the kind of response which will lead to the next state. They are: 

1. negative           -  e.g. no, 'i feel awful', 'i can't'
2. positive           -  e.g. yes, yeah, 'i feel great', 'wonderful'
3. neutral            -  e.g. not sure, eh
4. numeric            -  e.g. 467, nine, ten, 11, 4 hundred
5. datetime           -  e.g. tuesday 11pm, next week, sept 20th, 10:00PM
6. timeout-[X]-mins   -  e.g. [no answer after X minutes]
7. else               -  e.g. [catch all--executed after all other transitions]


## Methods

### Person

**Create a new person, returning it.**  
`POST /people`  
*Params:*  

    active        ::  boolean (default: true)  [optional]
    params        ::  array of key:values      [optional]


**Update a person, returning it.**  
`POST /person/{PERSON_ID}`  
*Params:* [same as above]  

**Return all person objects.**  
`GET /people`  

**Return the person object.**  
`GET /person/{PERSON_ID}`  

**Delete the person object, and returns it.**  
`DELETE /person/{PERSON_ID}`  
*Params:*  

    confirm      ::  boolean (default: false)  [required]
    
*NB: Prefer to deactivate the person, as deleting a person is permanent and cascades, deleting all schedules and responses associated with that person object.*



### Schedule

**Create a new schedule, returning it.**  
`POST /person/{PERSON_ID}/schedules`  
*Params:*  

    protocol_id   ::  uuid                     [required]     
    frequency     ::  string                   [required]
    start_at      ::  timestamp                [required]
    active        ::  boolean (default: true)  [optional]


**Update a schedule, returning it.**  
`POST /person/{PERSON_ID}/schedule/{SCHEDULE_ID}`  
*Params:* [same as above]  

**Return all schedule objects for a given person.**  
`GET /person/{PERSON_ID}/schedules`  

**Return the schedule object.**  
`GET /person/{PERSON_ID}/schedule/{SCHEDULE_ID}`  

**Delete the schedule object, and returns it.**  
`DELETE /person/{PERSON_ID}/schedule/{SCHEDULE_ID}`  

*NB This does NOT delete the responses associated with the object, and you can still retrieve this schedule by ID.*


### Response

**[PRIVATE] Create a new response, returning it.**  
`POST /patient/{PATIENT_ID}/responses`  

**[PRIVATE] Update a response, returning it.**  
`POST /patient/{PATIENT_ID}/response/{RESPONSE_ID}`  

**Return all response objects for a given patient.**  
`GET /patient/{PATIENT_ID}/responses`  

**Return the response object.**  
`GET /patient/{PATIENT_ID}/response/{RESPONSE_ID}`  

**[PRIVATE] Delete the response object, and returns it.**  
`DELETE /patient/{PATIENT_ID}/response/{RESPONSE_ID}`  


### Protocol

**Create a new protocol, returning it.**  
`POST /person/{PERSON_ID}/protocols`  

**Update a protocol, returning it.**  
`POST /protocol/{PROTOCOL_ID}`  

**Return all protocol objects for a given person.**  
`GET /protocols`  

**Return the protocol object.**  
`GET /protocol/{PROTOCOL_ID}`  

**Delete the protocol object, and returns it.**  
`DELETE /protocol/{PROTOCOL_ID}`  

*NB This does NOT responses associated with the object, and you can still retrieve the protocol by ID.*



### State

**Create a new state, returning it.**  
`POST /protocol/{PROTOCOL_ID}/states`  

**Update a state, returning it.**  
`POST /protocol/{PROTOCOL_ID}/state/{STATE_ID}`  

**Return all state objects for a given protocol.**  
`GET /protocol/{PROTOCOL_ID}/states`  

**Return the state object.**  
`GET /protocol/{PROTOCOL_ID}/state/{STATE_ID}`  

**Delete the state object, and returns it.**  
`DELETE /protocol/{PROTOCOL_ID}/state/{STATE_ID}`  

*NB This does NOT delete the responses associated with the object, and you can still retrieve this state by ID.*




NB: We support DELETE from HTML forms by checking for a field & value \_\_METHOD=DELETE and rewriting the HTTP method to that method, if specified, from POST.
