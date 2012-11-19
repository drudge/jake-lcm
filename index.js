/*!
 * Locomotive Utiltiies for Jake
 * Copyright(c) 2012 Nicholas Penree <nick@penree.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var EnvironmentHelper = require('./lib/env_helper');

/**
 * Execute a function within the locomotive application context.
 *
 * @param {Object} opts (optional)
 * @param {Function} fn
 * @api public
 */

function lcmTask(opts, fn) {
  if (typeof opts === 'function') {
    fn = opts;
    opts = {};
  }
  
  var helper = new EnvironmentHelper(opts);
  helper.execute(fn);
  
  return exports;
}

exports.environmentHelper =
exports.task =
exports.exec =
exports.lcmTask = lcmTask;

exports.EnvironmentHelper = EnvironmentHelper;