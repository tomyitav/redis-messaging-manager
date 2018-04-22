# redis-messaging-manager

[![Build Status](https://travis-ci.org/tomyitav/redis-messaging-manager.svg?branch=master)](https://travis-ci.org/tomyitav/redis-messaging-manager)
[![npm](https://img.shields.io/npm/v/redis-messaging-manager.svg)](https://www.npmjs.com/package/redis-messaging-manager)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

A super simple, instant pubsub messaging library, using
 
+ [ioredis library](https://github.com/luin/ioredis)
+ rxjs 5
+ typescript

### Background

`redis-messaging-manager` is designed to help you implement a pubsub
messaging protocol between your systems services. After installing the
library as a dependency, simply use the `PubsubManager` object provided
by the library to setup a connection to a redis broker instance.
The two core functions for messaging are `publish` and `consume`

### Creating PubsubManager instance

```js
  import {PubsubManager} from 'redis-messaging-manager';
  
  let messenger = new PubsubManager({
      host: 'localhost'
  });
  export default messenger;
```

Additional parameters can be passed to the instance, such as the broker
port, and reconnect strategy (Defaults to reconnecting).

### Examples for usage

Examples for using the library are provided [here](https://github.com/tomyitav/redis-messaging-manager-examples)

### Out of the box features

+ `consume` method returns an Rx Observable for convenient event processing
+ Server events can be subscribed to by using ```getServerEventStream``` method
+ Auto reconnect to the server is implemented in case of broker failure
+ Options to `PubsubManager` instance can be passed for alternative config
