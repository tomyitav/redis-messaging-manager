# redis-messaging-manager

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

### Examples for usage

Examples for using the library are provided [here](https://github.com/tomyitav/redis-messaging-manager-example)

### Out of the box features

+ `consume` method returns an Rx Observable for convenient event processing
+ Auto reconnect to the server is implemented in case of broker failure
+ Options to `PubsubManager` instance can be passed for alternative config
