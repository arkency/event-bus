var lodash = require('lodash');
var each = lodash.each;
var slice = [].slice;

var EventStream = (function() {
  function EventStream() {
    if(!(this instanceof EventStream))
      return new EventStream();

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
    var args, event;
    event = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (this.callbacks) {
      return each(this.callbacks[event], (function(_this) {
        return function(callback) {
          return callback.apply(null, args);
        };
      })(this));
    }
  };

  return EventStream;
})();

module.exports = EventStream;
