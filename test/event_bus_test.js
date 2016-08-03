var assert = require('assert');
var EventBus = require('../lib/event_bus');
var EventStream = require('../lib/event_stream');

describe("Event Bus", function() {
  it("is an instance of event stream", function() {
    assert(EventBus instanceof EventStream);
  });
});
