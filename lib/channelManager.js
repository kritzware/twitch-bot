const Channel = require('./channel')

function ChannelManager (sendMessageFunc) {
  if (typeof sendMessageFunc !== 'function') { throw new Error('sendMessageFunc parameter not a function.') }
  this._channels = {}
  this.sayFunc = sendMessageFunc
  this.timer = setInterval(() => {
    Object.values(this._channels).forEach((value) => value.trackInterval())
  }, 1000)
}

ChannelManager.prototype.join = function (channelName) {
  if (this._channels.hasOwnProperty(channelName) === false) {
    const channel = new Channel(channelName, this.sayFunc)
    this._channels[channelName] = channel
    return true
  }
  return false
}

ChannelManager.prototype.part = function (channelName) {
  if (this._channels.hasOwnProperty(channelName) === true) {
    delete this._channels[channelName]
    return true
  }
  return false
}

ChannelManager.prototype.channels = function () {
  return Object.keys(this._channels)
}

ChannelManager.prototype.destroy = function () {
  clearInterval(this.timer)
}

ChannelManager.prototype.handleSay = function (message, channel) {
  if (this._channels.hasOwnProperty(channel)) {
    this._channels[channel].sendMessage(message)
  }
}

module.exports = ChannelManager
