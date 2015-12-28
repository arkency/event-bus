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

    this.assertUnregisteringSingleSubscription = function(assert, instance) {
      let subscriberCalled = 0;
      const subscriberCallback = function() {
        subscriberCalled += 1;
      };

      const subscription = instance.on('event', subscriberCallback);
      instance.publish('event');
      assert(subscriberCalled === 1,
        'before unregister the subscription should get called - it is not.');
      subscription();
      instance.publish('event');
      assert(subscriberCalled !== 2, 
        'after unregistering the subscription is getting called (wrong)');      
    };

    this.assertOnlyOneSubscriptionIsUnsubscribed = function(assert, instance) {
      let firstCounter = 0;
      let secondCounter = 0;

      const firstCallback = function() { firstCounter += 1; };
      const secondCallback = function() { secondCounter += 1; };

      const eventFirstSub = instance.on('event', firstCallback);
      const eventSecondSub = instance.on('event', secondCallback);
      const eventFirstSubAgain = instance.on('event', firstCallback);
      const anotherEventSub = instance.on('event2', firstCallback);

      instance.publish('event');
      assert(firstCounter === 2, 
            'Double subscription not incremented the first counter twice');
      assert(secondCounter === 1,
            'Second subscription not incremented the second counter once');

      eventSecondSub();
      instance.publish('event');

      assert(firstCounter === 4 && secondCounter === 1,
            'Unregistering the subscription for secondCounter is affecting' +
            ' the first counter subscriptions');

      eventFirstSubAgain();
      instance.publish('event');
      assert(firstCounter === 5,
        'Unregistering one of the twice defined callbacks affected the rest too');

      instance.publish('event2');
      assert(firstCounter === 6,
        'publishing event2 not invoked the associated subscription');
      anotherEventSub();

      instance.publish('event');
      assert(firstCounter === 7,
        'the subscription associated to an another event somehow affected the' +
        'another subscription');      
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

  it("allows you to unregister the single subscription", 
    function() {
      this.assertUnregisteringSingleSubscription(assert, EventStream());
      this.assertUnregisteringSingleSubscription(assert, new EventStream());

      this.assertOnlyOneSubscriptionIsUnsubscribed(assert, EventStream());
      this.assertOnlyOneSubscriptionIsUnsubscribed(assert, new EventStream());
  });
});
