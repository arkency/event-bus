import assert from 'assert';
import EventStream from '../lib/event_stream';

describe("Event Stream", () => {
  beforeEach(function() {
    this.assertStreamPairBehavior = (assert, instance, secondInstance) => {
      let exampleState = {
        instanceOne: undefined,
        instanceTwo: undefined,
        instanceThree: undefined,
        secondInstance: undefined
      };

      let exampleListeners = {
        instanceOne: x => { exampleState.instanceOne = x },
        instanceTwo: x => { exampleState.instanceTwo = x },
        instanceThree: x => { exampleState.instanceThree = x; }, 
        secondInstance: x => { exampleState.secondInstance = x; }
      };

      instance.on('foo', exampleListeners.instanceOne);
      instance.publish('foo', 42);

      assert(exampleState.instanceOne === 42);
      assert(exampleState.instanceTwo === undefined);
      assert(exampleState.instanceThree === undefined);
      assert(exampleState.secondInstance === undefined);

      secondInstance.on('foo', exampleListeners.secondInstance);
      secondInstance.publish('foo', 86);

      assert(exampleState.instanceOne === 42);
      assert(exampleState.secondInstance === 86);

      instance.on('foo', exampleListeners.instanceTwo);
      instance.publish('foo', 40);

      assert(exampleState.instanceOne === 40);
      assert(exampleState.instanceTwo === 40);
      assert(exampleState.secondInstance === 86);

      instance.on('bar', exampleListeners.instanceThree);
      instance.publish('bar', 100);
      assert(exampleState.instanceOne === 40);
      assert(exampleState.instanceTwo === 40);
      assert(exampleState.instanceThree === 100);
      assert(exampleState.secondInstance === 86);

      instance.unregisterAllCallbacks();
      instance.publish('foo', 500);
      instance.publish('bar', 86);
      secondInstance.publish('foo', 24);
      assert(exampleState.instanceOne === 40);
      assert(exampleState.instanceTwo === 40);
      assert(exampleState.instanceThree === 100);
      assert(exampleState.secondInstance === 24);

      instance.on('foo', exampleListeners.instanceOne);
      instance.publish('foo', 500);
      assert(exampleState.instanceOne === 500);
      assert(exampleState.instanceTwo === 40);
      assert(exampleState.instanceThree === 100);
      assert(exampleState.secondInstance === 24);
    };

    this.assertFirstInFirstOutBehavior = (assert, stream) => {
      let firstCalled = false, secondAfter = false;

      const methodOne = () => {
        firstCalled = true;
      };

      const methodTwo = () => {
        if(firstCalled) secondAfter = true;
      };

      stream.on('test', methodOne);
      stream.on('test', methodTwo);

      stream.publish('test');

      assert(secondAfter);
    };
  });

  it("can be used with a factory function approach", function() {
    const instance = EventStream();
    const secondInstance = EventStream();

    assert(instance !== secondInstance);
    this.assertStreamPairBehavior(assert, instance, secondInstance);
  });

  it("can be used with the 'new' keyword approach", function() {
    const instance = new EventStream();
    const secondInstance = new EventStream();

    this.assertStreamPairBehavior(assert, instance, secondInstance);
  });

  it("calls listeners in a first in, first out fashion", function() {
    const instance = EventStream();
    const instanceNew = new EventStream();

    this.assertFirstInFirstOutBehavior(assert, instance);
    this.assertFirstInFirstOutBehavior(assert, instanceNew);
  });
});
