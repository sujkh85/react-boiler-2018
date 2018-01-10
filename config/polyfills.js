'use strict';

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// fetch() polyfill for making API calls.
require('whatwg-fetch');

// polyfill for IE while using fetch-jsonp
require('es6-promise').polyfill();

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');

var polyfillObjectFunc = function values(obj) {
	var vals = [];
	for (var key in obj) {
		vals.push(obj[key]);
	}
	return vals;
};

Object.values = Object.values === 'function' ? Object.values : polyfillObjectFunc
