# Event Bus

[![Build Status](https://travis-ci.org/arkency/event-bus.svg?branch=master)](https://travis-ci.org/arkency/event-bus)

Simple event bus for your JavaScript application.

# Usage

````javascript
import EventBus from 'eventing-bus'

var callback = function() { console.log("Hello!"); };

EventBus.on("exampleEventName", function() { callback(); });
EventBus.publish("exampleEventName"); // Console output: `Hello!`
````

## More than one event bus:

To create more than one event bus, you can import the function constructor by itself:

````javascript
import EventStream from 'eventing-bus/lib/event_stream';

var bus = EventStream();
var anotherBus = new EventStream(); /* Both styles possible. */
````

# Compatibility

If you want to use this library on legacy browsers (IE <= 8 etc.), you need to
provide polyfills for `Array.forEach` function. Check out e.g.
 [es5-shim](https://github.com/es-shims/es5-shim) to read more.
