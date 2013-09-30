# MarionAPI

Provides the Marion Tech API and backing processes for message dispatch and response capture.

# Usage

Make sure [nodejs](http://nodejs.org/) is installed, along with [mongodb](http://www.mongodb.org/) and [redis](http://redis.io/). Both mongo and redis should be running. This may all be easily installed with [homebrew](http://brew.sh/).

Foreman (installed with the [Heroku toolbelt](https://toolbelt.heroku.com/)) must also be installed.

For testing, [mocha](http://visionmedia.github.io/mocha/) must be installed.

    npm install # installs packages
    make # starts the application server
    make test # starts test server and runs tests

In order for the application to start, an `.env` file must be created in the project's root directory. This allows foreman to automatically set environment variables for the application to use, similar to the ones it will have access to in a production environment.

An example `.env` (should work as-is) can be found below. It's similar to what's in `.test_env`; just make sure the environments, ports, and databases are different at least. (TODO: remove `.test_env` from the repo, add to this documentation.)

```
MONGO_URL="mongodb://localhost/marionapidev"
PORT=5000
ENVIRONMENT=DEVELOPMENT
REDIS_URL=redis://localhost:6379
```

---

(C) All rights reserved 2013 Isaac Hodes
