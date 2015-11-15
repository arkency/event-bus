# Event Bus

[![Build Status](https://travis-ci.org/arkency/event-bus.svg?branch=master)](https://travis-ci.org/arkency/event-bus)

Simple event bus for your JavaScript application.

# Usage

````javascript
import EventBus from 'eventing_bus'

var callback = function() { console.log("Hello!"); };

EventBus.on("exampleEventName", function() { callback(); });
EventBus.publish("exampleEventName"); // Console output: `Hello!`
````
