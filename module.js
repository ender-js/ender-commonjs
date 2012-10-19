function Module(id, src) {
  this.id = id
  this.src = src
}

Module.prototype['_load'] = function () {
  var m = this
  
  if (!m.require) {
    m.exports = {}
    m.require = function (id) {
      var parts
        , i

      if (id.charAt(0) == '.') {
        parts = (m.id.replace(/\/.*?$/, '/') + id.replace(/\.js$/, '')).split('/')

        while (~(i = parts.indexOf('.')))
          parts.splice(i, 1)

        while ((i = parts.lastIndexOf('..')) > 0)
          parts.splice(i-1, 2)

        id = parts.join('/')
      }
      
      return require(id);
    }

    // Execute the module body
    (new Function('module', 'exports', 'require', m.src + "\n//@ sourceURL=" + m.id))(m, m.exports, m.require)
  }
  
  return m.exports
}

function package(id, files, main, ender) {
  for (var path in files)
    require._modules['$' + id + '/' + path] = new Module(id + '/' + path, files[path])
  
  require._modules['$' + id] = require._modules['$' + id + '/' + main]
  
  if (ender) require._modules['$' + id + '/' + ender]._load()
  else $.ender(require._modules['$' + id]._load())
}

function require(id) {
  if ('$' + id in require._modules) return require._modules['$' + id]._load()
  else if (id in window) return window[id]
  else throw new Error("Ender Error: Requested module '" + id + "' has not been defined.")
}

function provide(id, exports) {
  require._modules['$' + id] = { _load: function () { return exports } }
}

require._modules = {}