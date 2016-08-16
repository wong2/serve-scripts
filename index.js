#! /usr/bin/env node

var path = require('path')
var merge = require('merge')
var createServer = require('./server').createServer

var configPath = process.argv[2]

if (!configPath) {
  console.log('[USAGE] serve-scripts config.json')
  process.exit()
}

var configPath = path.resolve(configPath)
try {
  var config = require(configPath)
} catch(e) {
  console.log('Failed to read the config file: ', configPath)
  process.exit()
}

config = merge({
  title: 'Sprint',
  auth: false,
  commands: [],
  port: 3000
}, config)

var server = createServer(config)
server.listen(config.port, function() {
  console.log('Listening on port ' + config.port)
})
