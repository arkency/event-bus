var slice = [].slice;

function EventStream() {
  if (!(this instanceof EventStream)) {
    return new EventStream();
  }

  this.nextSubscriptionIndex = 0;
  this.callbacks = {};
}

EventStream.prototype.unregisterAllCallbacks = function unregisterAllCallbacks() {
  this.callbacks = {};
};

EventStream.prototype.on = function on(event, callback) {
  if (!this.callbacks[event]) {
    this.callbacks[event] = [];
  }

  this.callbacks[event].push({ 
    subscription: callback, 
    index: this.nextSubscriptionIndex
  });

  var currentIndex = this.nextSubscriptionIndex;
  var that = this;
  this.nextSubscriptionIndex += 1;

  return function() {      
    that.callbacks[event] = that.callbacks[event].filter(function(callback) {
      return callback.index !== currentIndex;
    });
  };
};

EventStream.prototype.publish = function publish() {
  var event = arguments[0];
  var args = arguments.length >= 2 ? slice.call(arguments, 1) : [];
  if (this.callbacks && this.callbacks[event]) {
    this.callbacks[event].forEach(function(callback) {
      callback.subscription.apply(null, args);
    });
  }
};

module.exports = EventStream;
