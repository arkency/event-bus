import assert   from 'assert';
import sinon    from 'sinon';
import EventBus from '../index';
import EventStream from "../lib/event_stream";

const firstEvent  = 'firstEvent';
const secondEvent = 'secondEvent';

describe("Event Bus", () => {
  it("is an instance of event stream", function() {
    assert(EventBus instanceof EventStream);
  });
});
