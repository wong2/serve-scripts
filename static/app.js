var output = {

  elem: $('#output'),

  append: function(text) {
    this.elem.append(text)
    this._scroll()
    return this
  },

  appendLabel: function(text, color) {
    this.elem.append('\n')
    this.elem.append('<sapn class="ui label ' + color + '">' + text + '</span>')
    this.elem.append('\n\n')
    this._scroll()
    return this
  },

  addLoading: function() {
    this.elem.append('<i class="ui icon loading spinner"></i>')
    this._scroll()
    return this
  },

  removeLoading: function() {
    this.elem.find('.icon.loading').remove()
    return this
  },

  moveLoading: function() {
    this.elem.append(this.elem.find('.icon.loading'))
    this._scroll()
    return this
  },

  _scroll: function() {
    this.elem.scrollTop(this.elem.prop('scrollHeight'))
  }

}


var socket = io()
var statusIcon = $('.output .header .content .icon')
var isCommandRunning = false

window.onbeforeunload = function() {
  if (isCommandRunning) {
    return 'There is a command running, are you sure you want to leave?'
  }
}

socket.on('connect', function() {
  statusIcon.removeClass('grey').addClass('green')
})

socket.on('disconnect', function() {
  statusIcon.removeClass('green').addClass('grey')
})

socket.on('cmd stdout', function(text) {
  output.append(text).moveLoading()
})

socket.on('cmd end', function(data) {
  isCommandRunning = false
  output.removeLoading()
  $('.command-buttons button').removeClass('disabled')
  if (data.code == 0) {
    var duration = data.duration.toFixed()
    output.appendLabel('Completed after ' + duration + 'ms', 'green')
  } else {
    output.appendLabel('Command exited with code ' + data.code, 'red')
  }
})

$('.command-buttons button').click(function() {
  isCommandRunning = true
  $('.command-buttons button').addClass('disabled')
  output.addLoading()
  socket.emit('run cmd', $(this).text)
})
