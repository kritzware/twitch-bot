const Channel = require('./channel')

function ChannelManager(sayFunc){
  this._channels = {}
  this.sayFunc = sayFunc
  this.timer = setInterval(() => {
    Object.values(this._channels).forEach((value) => value.trackInterval())
  }, 1000)

}

ChannelManager.prototype.join = function(channelName){
  if (this._channels.hasOwnProperty(channelName) === false){
    const channel = new Channel(channelName, this.sayFunc)
    this._channels[channelName] = channel
    return true
  }
  return false
}

ChannelManager.prototype.channels = function(){
  return Object.keys(this._channels)
}

ChannelManager.prototype.destroy  = function(){
  clearInterval(this.timer)
}


ChannelManager.prototype.handleSay = function(message, channel){
  //just loop the message back to the bot instance for now
  if (this._channels.hasOwnProperty(channel)){
      this._channels[channel].sendMessage(message)
  }

}

module.exports = ChannelManager
