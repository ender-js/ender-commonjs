/*!
  * Ender: open module JavaScript framework (module-lib)
  * http://ender.no.de
  * License MIT
  */

function require(id) {
  if ('$' + id in require._cache)
    return require._cache['$' + id]
  if ('$' + id in require._modules)
    return (require._cache['$' + id] = require._modules['$' + id]._load())
  if (id in window)
    return window[id]

  throw new Error("Ender Error: Requested module '" + id + "' has not been defined.")
}

function provide(id, exports) {
  require._cache['$' + id] = exports
}

require._cache = {}
require._modules = {}

function Module(id, fn) {
  this.id = id
  this.fn = fn  
  require._modules['$' + id] = this
}

Module.prototype['require'] = function (id) {
  var parts, i

  if (id.charAt(0) == '.') {
    parts = (this.id.replace(/\/.*?$/, '/') + id.replace(/\.js$/, '')).split('/')

    while (~(i = parts.indexOf('.')))
      parts.splice(i, 1)

    while ((i = parts.lastIndexOf('..')) > 0)
      parts.splice(i-1, 2)

    id = parts.join('/')
  }
    
  return require(id)
}

Module.prototype['_load'] = function () {
  var m = this
    
  if (!m._loaded) {
    m._loaded = true
    m.exports = {}
    m.fn(m, m.exports, function (id) { return m.require(id) })
  }
  
  return m.exports
}

Module.loadPackage = function (id, modules, expose, main, bridge) {
  var path, task
  
  for (path in modules) {
    new Module(id + '/' + path, modules[path])
    if (m = path.match(/(.+)\/index/)) new Module(id + '/' + m[1], modules[path])
  }
  
  // Create the main module
  if (main) require._modules['$' + id] = require._modules['$' + id + '/' + main]
  
  task = function () {
    if (main) (expose ? (window[id] = require(id)) : require(id))
    if (bridge) require(id + '/' + bridge)
    task.next()
  }
  
  task.next = Module._integrate
  Module._integrate = task
}

// See the lines directly above for how integration tasks get chained
Module._integrate = function () {}
