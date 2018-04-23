var EventBus = require('./event_stream');

var instance;

if (typeof window !== "undefined") {
  if (typeof window.__eventBus === "undefined") {
    window.__eventBus = new EventBus();
  }
  instance = window.__eventBus;
} else {
  throw new Error("window is not defined");
}

module.exports = instance;
