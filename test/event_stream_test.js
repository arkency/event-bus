var assert = require('assert');
var EventStream = require('../lib/event_stream');

describe("Event Stream", function() {
  beforeEach(function() {
    this.assertStreamPairBehavior = function(assert, instance, secondInstance) {
      var exampleState = {
        instanceOne: undefined,
        instanceTwo: undefined,
        instanceThree: undefined,
        secondInstance: undefined
      };

      var exampleListeners = {
        instanceOne: function(x) { exampleState.instanceOne = x },
        instanceTwo: function(x) { exampleState.instanceTwo = x },
        instanceThree: function(x) { exampleState.instanceThree = x; }, 
        secondInstance: function(x) { exampleState.secondInstance = x; }
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

    this.assertFirstInFirstOutBehavior = function(assert, stream) {
      var firstCalled = false, 
          secondAfter = false;

      var methodOne = function() {
        firstCalled = true;
      };

      var methodTwo = function() {
        if(firstCalled) secondAfter = true;
      };

      stream.on('test', methodOne);
      stream.on('test', methodTwo);

      stream.publish('test');

      assert(secondAfter);
    };

    this.assertUnregisteringSingleSubscription = function(assert, instance) {
      var subscriberCalled = 0;
      var subscriberCallback = function() {
        subscriberCalled += 1;
      };

      var subscription = instance.on('event', subscriberCallback);
      instance.publish('event');
      assert(subscriberCalled === 1,
        'before unregister the subscription should get called - it is not.');
      subscription();
      instance.publish('event');
      assert(subscriberCalled !== 2, 
        'after unregistering the subscription is getting called (wrong)');      
    };

    this.assertOnlyOneSubscriptionIsUnsubscribed = function(assert, instance) {
      var firstCounter = 0;
      var secondCounter = 0;

      var firstCallback = function() { firstCounter += 1; };
      var secondCallback = function() { secondCounter += 1; };

      var eventFirstSub = instance.on('event', firstCallback);
      var eventSecondSub = instance.on('event', secondCallback);
      var eventFirstSubAgain = instance.on('event', firstCallback);
      var anotherEventSub = instance.on('event2', firstCallback);

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

    this.assertAllSubscriptionsForEventUnsubscribed = function(assert, instance) {
      var firstCounter = 0;
      var secondCounter = 0;

      var firstCallback = function() { firstCounter += 1; };
      var secondCallback = function() { secondCounter += 1; };

      instance.on('event', firstCallback);
      instance.on('event', firstCallback);
      instance.on('event2', secondCallback);

      instance.publish('event');

      assert(firstCounter === 2)
      assert(secondCounter === 0)

      instance.unregisterCallbacksForEvent('event')
      instance.publish('event');
      instance.publish('event2');

      assert(firstCounter === 2)
      assert(secondCounter === 1)
    };
  });

  it("can be used with a factory function approach", function() {
    var instance = EventStream();
    var secondInstance = EventStream();

    assert(instance !== secondInstance);
    this.assertStreamPairBehavior(assert, instance, secondInstance);
  });

  it("can be used with the 'new' keyword approach", function() {
    var instance = new EventStream();
    var secondInstance = new EventStream();

    this.assertStreamPairBehavior(assert, instance, secondInstance);
  });

  it("calls listeners in a first in, first out fashion", function() {
    this.assertFirstInFirstOutBehavior(assert, new EventStream());
  });

  it("allows you to unregister the single subscription", 
    function() {
      this.assertUnregisteringSingleSubscription(assert, new EventStream());
      this.assertOnlyOneSubscriptionIsUnsubscribed(assert, new EventStream());
  });

  it("allows you to unregister all subscriptions for given event", function () {
    this.assertAllSubscriptionsForEventUnsubscribed(assert, new EventStream());
  })

  it("allows you to unregister event handler by callback", function () {
    var firstCounter = 0
    var secondCounter = 0
    var instance = new EventStream()
    var firstCallback = function () { firstCounter += 1 }
    var secondCallback = function () { secondCounter += 1 }

    instance.on("event1", firstCallback)
    instance.on("event2", secondCallback)

    instance.unregisterCallback(firstCallback)

    instance.publish('event1')
    instance.publish('event2')

    assert.strictEqual(firstCounter, 0)
    assert.strictEqual(secondCounter, 1)
  })
});
