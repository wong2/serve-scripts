var express = require('express')
var Server = require('http').Server
var SocketIO = require('socket.io')
var find = require('lodash.find')
var exec = require('child_process').exec
var utils = require('./utils')


function runCommand(command, socket) {
  var startTime = utils.now()
  var cmd = exec(command)
  cmd.stdout.setEncoding('utf-8')
  cmd.stdout.on('data', function(data) {
    socket.emit('cmd stdout', data)
  })
  cmd.stderr.setEncoding('utf-8')
  cmd.stdout.on('data', function(data) {
    socket.emit('cmd sterr', data)
  })
  cmd.on('exit', function(code) {
    var duration = utils.now() - startTime
    socket.emit('cmd end', {code: code, duration: duration})
  })
}


module.exports.createServer = function(config) {

  var app = express()
  var server = Server(app)
  var io = SocketIO(server)

  app.set('view engine', 'pug')
  app.set('views', __dirname + '/views')
  app.use('/static', express.static(__dirname + '/static'))

  if (config.auth) {
    app.use(utils.basicAuth(config.auth.username, config.auth.password))
  }

  app.get('/', function (req, res) {
    res.render('index', {
      title: config.title,
      commands: config.commands.map(function(command) {
        return command.name
      })
    })
  })

  io.on('connection', function(socket) {
    socket.on('run cmd', function(commandName) {
      var command = find(config.commands, function(c) {
        return c.name == commandName
      })
      if (command) {
        runCommand(command.command, socket)
      }
    })
  })

  return server

}
