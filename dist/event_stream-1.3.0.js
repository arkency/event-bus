(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["EventStream"] = factory();
	else
		root["EventStream"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

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


/***/ }
/******/ ])
});
;