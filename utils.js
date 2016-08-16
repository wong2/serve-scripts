var basicAuth = require('basic-auth')

module.exports.basicAuth = function(name, pass) {
  return function(req, res, next) {
    function unauthorized(res) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
      return res.sendStatus(401)
    }
    var user = basicAuth(req)
    if (!user || !user.name || !user.pass) {
      return unauthorized(res)
    }
    if (user.name === name && user.pass === pass) {
      return next()
    } else {
      return unauthorized(res)
    }
  }
}


module.exports.now = function() {
  // returns a timestamp in milliseconds
  var time = process.hrtime()
  return time[0] * 1e3 + time[1] / 1e6
}
