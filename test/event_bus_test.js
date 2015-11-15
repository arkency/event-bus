import assert   from 'assert';
import sinon    from 'sinon';
import EventBus from '../index';

const firstEvent  = 'firstEvent';
const secondEvent = 'secondEvent';

describe("Test", () => {
  let stubs;
  beforeEach(() => {
    stubs = createStubs();
    EventBus.on(firstEvent,  () => { stubs.callback_1(); });
    EventBus.on(firstEvent,  () => { stubs.callback_3(); });

    EventBus.on(secondEvent, () => { stubs.callback_2(); });
    EventBus.on(secondEvent, () => { stubs.callback_3(); });
  });

  afterEach(() => {
    EventBus.unregisterAllCallbacks();
  });

  it("After firing `firstEvent`, it should not call callback #3", () => {
    EventBus.publish(firstEvent);
    assert(stubs.callback_1.calledOnce);
    assert(stubs.callback_3.calledOnce);

    assert(!stubs.callback_2.called);
  });

  it("After firing `firstEvent` twice, it should call callback #1 and #3 twice", () => {
    EventBus.publish(firstEvent);
    EventBus.publish(firstEvent);
    assert(stubs.callback_1.calledTwice);
    assert(stubs.callback_3.calledTwice);
  });

  it("After firing both test events, it should call all callbacks for correct amount of times", () => {
    EventBus.publish(firstEvent);
    EventBus.publish(secondEvent);

    assert(stubs.callback_1.calledOnce);
    assert(stubs.callback_2.calledOnce);
    assert(stubs.callback_3.calledTwice);
  });

  it("Should properly unregister callbacks", () => {
    let callback = sinon.spy();

    EventBus.on(firstEvent, () => { callback(); });
    EventBus.unregisterAllCallbacks();
    EventBus.publish(firstEvent);

    assert(!callback.called);
  });
});

function createStubs() {
  return {
    callback_1: sinon.spy(),
    callback_2: sinon.spy(),
    callback_3: sinon.spy(),
  };
};
