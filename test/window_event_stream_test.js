import assert      from 'assert';
import EventStream from '../lib/event_stream';

describe("Window event bus", () => {
  beforeEach(() => {
    global.window = {};
  });

  afterEach(() => {
    delete global['window'];
    removeCachedWindowEventStream();
  });

  it("Should set `__eventBus` in `global.window` if it is not defined", () => {
    assert(typeof window.__eventBus == "undefined");
    let eventBus = require('../lib/window_event_stream');
    assert(window.__eventBus instanceof EventStream);
    assert(eventBus instanceof EventStream);
  });

  it("Should not set new instance of eventBus in `global.window` if one is already set", () => {
    var test = false;
    let eventBus = require('../lib/window_event_stream');
    eventBus.on('testEvent', () => { test = true; });
    removeCachedWindowEventStream();
    assert(window.__eventBus instanceof EventStream);

    eventBus = require('../lib/window_event_stream');
    assert(window.__eventBus instanceof EventStream);
    eventBus.publish('testEvent');
    assert(test);
  });
});

function removeCachedWindowEventStream() {
  delete require.cache[require.resolve('../lib/window_event_stream')];
}
