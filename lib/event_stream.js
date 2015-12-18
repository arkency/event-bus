var slice = [].slice;

var EventStream = (function() {
  function EventStream() {
    if (!(this instanceof EventStream)) {
      return new EventStream();
    }

    this.callbacks = {};
  }

  EventStream.prototype.unregisterAllCallbacks = function unregisterAllCallbacks() {
    this.callbacks = {};
  };

  EventStream.prototype.on = function on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  };

  EventStream.prototype.publish = function publish() {
    var event = arguments[0];
    var args = arguments.length >= 2 ? slice.call(arguments, 1) : [];
    if (this.callbacks && this.callbacks[event]) {
      this.callbacks[event].forEach(function(callback) {
        callback.apply(null, args);
      });
    }
  };

  return EventStream;
})();

module.exports = EventStream;
