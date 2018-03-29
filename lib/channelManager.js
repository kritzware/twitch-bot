const Channel = require('./channel')

function ChannelManager(sayFunc){
  this._channels = {}
  this.sayFunc = sayFunc
  this.timer = setInterval(() => {
    console.log(this._channels)
    Object.values(this._channels).forEach((value) => value.trackInterval())
  }, 1000)

}

ChannelManager.prototype.join = function(channelName){
  if (this._channels.hasOwnProperty(channelName) === false){
    const channel = new Channel(channelName)
    this._channels[channelName] = channel
    return true
  }
  return false
}

ChannelManager.prototype.channels = function(){
  return Object.keys(this._channels)
}


ChannelManager.prototype.handleSay = function(message, channel){
  //just loop the message back to the bot instance for now
  this.sayFunc("PRIVMSG "+channel+" :"+message)
}

module.exports = ChannelManager
