import { each } from 'lodash';

var EventBus,
    slice = [].slice;

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

export default (new EventBus());
