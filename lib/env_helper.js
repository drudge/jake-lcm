/*!
 * Locomotive Utilities for Jake
 * Copyright(c) 2012 Nicholas Penree <nick@penree.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var debug = require('debug')('jake:lcm:env_helper')
  , fs = require('fs')
  , path = require('path')
  , async = require('async')
  , join = require('path').join
  , env = process.env.NODE_ENV || 'development';

/**
* Locomotive EnvironmentHelper Object
*
* @class Represents a EnvironmentHelper.
*/

/**
* Creates a new EnvironmentHelper.
*
* @constructor
*/

function EnvironmentHelper(opts) {
  opts = opts || {};
  
  this.baseDir = process.env.LCM_DIR || opts.baseDir || process.cwd();
  this.settings = {};
  this.initializers = opts.initializers || [];
}

/**
 * Return the path to the configuration directory.
 *
 * @return {String}
 * @api public
 */

EnvironmentHelper.prototype.configPath = function() {
  return join(this.baseDir, 'config');
}

/**
 * Return the path to the environments directory.
 *
 * @return {String}
 * @api public
 */

EnvironmentHelper.prototype.environmentsPath = function() {
  return join(this.configPath(), 'environments');
}

/**
 * Return the path to the initializers directory.
 *
 * @return {String}
 * @api public
 */

EnvironmentHelper.prototype.initializersPath = function() {
  return join(this.configPath(), 'initializers');
}

/**
 * Initialize the psuedo app environment.
 *
 * @api public
 */

EnvironmentHelper.prototype.execute = function(initializers, fn) {
  var self = this
    , setup = [];
  
  if (typeof initializers == 'function') {
    fn = initializers;
    initializers = this.initializers || [];
  }
  
  if (!initializers.length) {
    fs.readdir(this.initializersPath(), function(err, files) {
      if (err) throw err;      
      setup = self.prepareInitializers(files);
      setup.push(fn.bind(self));
      async.series(setup);
    });
  } else {
    setup = self.prepareInitializers(initializers);
    setup.push(fn.bind(self));    
    async.series(setup);
  }
}

/**
 * Return an array of initializer functions.
 *
 * @param {Array} initializers (optional)
 * @return {Array}
 * @api public
 */

EnvironmentHelper.prototype.prepareInitializers = function(initializers) {
  var self = this
    , initializer
    , envsPath = this.environmentsPath()
    , initializersPath = this.initializersPath()
    , setup = [
    function(done) {
      require(join(envsPath, 'all')).call(self);
      require(join(envsPath, env)).call(self);
      done();
    }
  ];
  
  initializers = initializers || [];
  initializers = initializers.sort();
  
  initializers.forEach(function(name) {
    try {
      mod = require(join(initializersPath, name));
      
      if (typeof mod == 'function') {
        var arity = mod.length;
        if (arity == 1) {
          // Async initializer.  Exported function will be invoked, with next
          // being called when the initializer finishes.
          initializer = mod.bind(self);
        } else {
          // Sync initializer.  Exported function will be invoked, with next
          // being called immediately.
          var temp = mod.bind(self);
          initializer = function(done) {
            temp.call(self);
            done();
          }
        }
      }
    } catch (e) { }
    
    if (initializer) {
      setup.push(initializer);
      initializer = null;
    }
  });
  
  return setup;
}
/**
 * Get or define setting from the current environment.
 *
 * @param {String} key
 * @param {Mixed} val [optional]
 * @return {Mixed}
 * @api public
 */

EnvironmentHelper.prototype.set = function(key, val) {
  if (typeof val === 'undefined') {
    return this.get(key);
  }

  this.settings[key] = val;
}

/**
 * Get setting from the current environment.
 *
 * @param {String} key
 * @return {Mixed}
 * @api public
 */

EnvironmentHelper.prototype.get = function(key) {
  return this.settings[key];
}

/**
 * Enable setting from the current environment.
 *
 * @param {String} key
 * @return {Mixed}
 * @api public
 */

EnvironmentHelper.prototype.enable = function(key) {
  this.set(key, true);
}

/**
 * Disable setting from the current environment.
 *
 * @param {String} key
 * @return {Mixed}
 * @api public
 */

EnvironmentHelper.prototype.disable = function(key) {
  this.set(key, false);
}

/**
 * Get enabled state for setting from the current environment.
 *
 * @param {String} key
 * @return {Mixed}
 * @api public
 */

EnvironmentHelper.prototype.enabled = function(key) {
  return this.get(key) === true;
}

/**
 * Get disabled state for setting from the current environment.
 *
 * @param {String} key
 * @return {Mixed}
 * @api public
 */

EnvironmentHelper.prototype.disabled = function(key) {
  return this.get(key) === false;
}

/**
 * Stub methods for lcm/express compatibility. Swallows.
 *
 * @api public
 */

var compat = [
    'configure' 
  , 'engine'
  , 'format'
  , 'use'
  , 'helper' 
  , 'dynamicHelper'
  , 'helpers' 
  , 'dynamicHelpers'
  , 'locals'
  , 'controller'
  , 'datastore'
  , '_recordOf'
  , 'boot'
];

compat.forEach(function(name) {
  EnvironmentHelper.prototype[name] = function() {
    debug('Swallowing call to `' + name + '`');
  };
});

/**
 * Expose `EnvironmentHelper`.
 */

module.exports = EnvironmentHelper;