# Marion Health SMS API v1 Spec

Endpoint is `https://api.marion.io/v1/`.

Auth is HTTP Basic Auth, username blank and password <api-key>. E.g. `https://:<api-key>@api.marion.io/v1/`.

All data should be posted to the API with HTTP header `Content-type: application/json`, and the data should be valid [JSON](http://json.org).


## Resources

* Person
* Schedule
* Response
* ProtocolInstance
* Protocol
  * State


### The Person Object

A Person is the entity interacting with a message Protocol. They're the ones with the cell phones, responding to SMS messages.

    id            ::  id
    createdAt     ::  Timestamp
    active        ::  Boolean (default: true)
    params        ::  { key: val } - any data can be stored in here


### The Schedule Object

A schedule ties a Protocol to a Person, initiating the protocol on a recurring basis (starting at `start_at`), or once, depending on the `frequency`.

    id            ::  id
    person        ::  id, references Person
    protocol      ::  id, references Protocol
    createdAt     ::  Timestamp
    sendTime      ::  Hour, (0-24)
    frequency     ::  String \in [daily, mondays..sundays, once]
    active        ::  Boolean (default: true)


### The Response Object

Responses represent a Person's response to a given Protocol. 

    id                    ::  id
    person                ::  id, references Person
    state                 ::  id, references State
    protocolInstance      ::  id, references ProtocolInstance
    messageName           ::  String, references a message in State that is being responsed to
    createdAt             ::  Timestamp
    text                  ::  String, the actual response to the message
    completedAt           ::  Timestamp
    
    
### The Protocol Object

A protocol is a script reprsenting messages sent out by Marion SMS and the consequent messages and actions Marion SMS should take given certain responses by the user. A protocol is represented by a finite state machine. Its states (represented by the State resource) execute actions upon entry; this could be sending additional messages, and/or hitting specified webhooks (see docs on webhooks). 

Protocols are created with a name and description, and states are then added to it. In order for a Protocol to be valid, one State must be designated the initial state, and ther emust be a path to a terminal state from there. There may be no non-terminating sequences; the protocol must halt.

    id                ::  id
    initialState      ::  id, references State
    createdAt         ::  Timestamp
    name              ::  String
    description       ::  String
    
    
### The ProtocolInstance

A "run" of the Protocol on a Person at a given Scheduled time.

    id                ::  id
    protocol          ::  id, references Protocol
    schedule          ::  id, references Schedule
    currentState      ::  id, references State
    createdAt         ::  Timestamp
    completedAt       ::  Timestamp

    
### The State Object

A schedule ties a Protocol to a Person, initiating the protocol on a recurring basis (starting at `start_at`), or once, depending on the `frequency`.

    id                ::  id
    protocol          ::  id, references Protocol
    isTerminal        ::  Boolean
    messages          ::  [message]
    transitions       ::  [rule]
    
Where a message is: 

    name              ::  String
    type              ::  String, \in [text, webhook, etc.]
    body              ::  String
    destination       ::  String
    
And a rule is: 

    toState           ::  id, references State
    pending           ::  [String], names of messages
    classifier        ::  String
    

###### Classifiers (for States)

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
    params        ::  { key:values }           [optional]


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
    
*NB: Prefer to deactivate the person, as deleting a person is permanent and cascades, deleting all schedules associated with that person object.*



### Schedule

**Create a new schedule, returning it.**  
`POST /schedules`  
*Params:*  

    protocol      ::  id                       [required]
    person        ::  id                       [required]
    frequency     ::  String                   [required]
    sendTime      ::  Number, hour (0-24)      [required]
    active        ::  Boolean (default: true)  [optional]


**Update a schedule, returning it.**  
`POST /schedule/{SCHEDULE_ID}`
*Params:*  

    protocol      ::  id                       [required]
    person        ::  id                       [required]
    frequency     ::  String                   [optional]
    sendTime      ::  Number, hour (0-24)      [optional]
    active        ::  Boolean (default: true)  [optional]

**Return all schedule objects for a given person.**  
`GET /schedules`

**Return the schedule object.**  
`GET /schedule/{SCHEDULE_ID}`

**Delete the schedule object, and returns it.**  
`DELETE /schedule/{SCHEDULE_ID}`

*NB This does NOT delete the responses associated with the object, and you can still retrieve this schedule by ID.*


### Response

###### TK : Private CUD methods?

**Create a new response, returning it.**  
`POST /responses`  

*Params:*  

    protocolInstance   ::  id                       [required]
    state              ::  id                       [required]
    messageName        ::  String                   [required]
    text               ::  String                   [optional]


**Update a response, returning it.**  
`POST /response/{RESPONSE_ID}`  

*Params:*

     text               ::  String                   [optional]

**Return all response objects.**
`GET /responses`  

**Return the response object.**
`GET /response/{RESPONSE_ID}`  

**Delete the response object, and returns it.**
`DELETE /response/{RESPONSE_ID}`  


### Protocol

**Create a new protocol, returning it.**  
`POST /protocols`  

*Params:*

    initialState          ::  id                     [optional]
    name                  ::  String                 [required]
    description           ::  String                 [required]

**Update a protocol, returning it.**  
`POST /protocol/{PROTOCOL_ID}`  

*Params:*

    initialState          ::  id                     [optional]
    name                  ::  String                 [optional]
    description           ::  String                 [optional]
    

**Return all protocol objects.**  
`GET /protocols`

**Return the protocol object.**  
`GET /protocol/{PROTOCOL_ID}`  

**Delete the protocol object, and returns it.**  
`DELETE /protocol/{PROTOCOL_ID}`  

*NB This does NOT responses associated with the object, and you can still retrieve the protocol by ID.*



### State

**Create a new state, returning it.**  
`POST /states`  

*Params:*

    protocol          ::  id, references Protocol                 [required]
    isTerminal        ::  Boolean, default false                  [optional]
    messages          ::  [message]                               [optional]
    transitions       ::  [rule]                                  [optional]
    
Where a message is: 

    name              ::  String                                  [optional]
    type              ::  String, \in [text, webhook, etc.]       [required]
    body              ::  String                                  [optional]
    destination       ::  String                                  [required]
    
And a rule is: 

    toState           ::  id, references State, or null           [reguired]
    pending           ::  [String], names of messages             [required]
    classifier        ::  String                                  [required]


**Update a state, returning it.**  
`POST /state/{STATE_ID}`  

*Params:*

    isTerminal        ::  Boolean, default false                  [optional]
    messages          ::  [message]                               [optional]
    transitions       ::  [rule]                                  [optional]
    

**Return all state objects for a given protocol.**  
`GET /states`  

**Return the state object.**  
`GET /state/{STATE_ID}`  

**Delete the state object, and returns it.**  
`DELETE /state/{STATE_ID}`  

*NB This does NOT delete the responses associated with the object, and you can still retrieve this state by ID.*



### ProtocolInstance

###### TK : Private CUD methods?

**Create a new protocolInstance, returning it.**  
`POST /protocolInstances`  

*Params:*

    protocol          ::  id, references Protocol            [required]
    schedule          ::  id, references Schedule            [required]
    currentState      ::  id, references State               [required]
    completedAt       ::  Timestamp                          [optional]

**Update a protocol instance, returning it.**  
`POST /protocolInstance/{PROTOCOLINSTANCE_ID}`  

*Params:*

    currentState      ::  id, references State               [optional]
    completedAt       ::  Timestamp                          [optional]    

**Return all protocol objects.**  
`GET /protocolInstances`

**Return the protocol object.**  
`GET /protocolInstance/{PROTOCOLINSTANCE_ID}`  

**Delete the protocol object, and returns it.**  
`DELETE /protocolInstance/{PROTOCOLINSTANCE_ID}`  
