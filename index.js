var EventBus;
var lodash = require('lodash');

var each = lodash.each;
var slice = [].slice;

EventBus = (function() {
  function EventBus() {
    this.callbacks = {};
  }

  EventBus.prototype.unregisterAllCallbacks = function() {
    this.callbacks = {};
  };

  EventBus.prototype.on = function(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  };

  EventBus.prototype.publish = function() {
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

  return EventBus;

})();

module.exports = new EventBus();
