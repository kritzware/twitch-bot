const CircularBuffer = require('circular-buffer')

const Channel = function (name, sendMessageFunc) {
  if (typeof sendMessageFunc !== 'function') { throw new Error('sendMessageFunc parameter not a function.') }

  this.name = name
  this.tracker = 0 // keep track of the messages sent per evaluation interval
  this.messageQueue = [] // keep track of messages that could not be sent yet
  this.sendMessageFunc = sendMessageFunc
  this.setSelfStatus()
}

Channel.prototype.setSelfStatus = function (status) {
  switch (status) {
    case 'MOD':
      this.setMessageLimit(100, 30)
      break
    default:
      this.setMessageLimit(20, 30)
      break
  }
}

Channel.prototype.setMessageLimit = function (messageCount, seconds) {
  this.limit = messageCount // the maximum limit for messages in limitTimePeriod seconds
  this.limitTimePeriod = seconds // in seconds, the time period that allows a maximum of this.limit messages
  this.buffer = new CircularBuffer(this.limitTimePeriod) // keep track of messages sent in last timeUpperBound seconds in a circular buffer
}

Channel.prototype.calculateFreeMessageSlots = function () {
  return this.limit - (this.buffer.toarray().reduce((sum, bufferValue) => sum + bufferValue, 0) + this.tracker)
}

Channel.prototype.sendMessage = function (message) {
  if (this.messageQueue.length === 0) {
    if (this.calculateFreeMessageSlots() > 0) {
      this.sendMessageFunc(`PRIVMSG ${this.name} :${message}`)
      this.tracker++
    } else {
      this.messageQueue.push(message)
    }
  } else {
    this.messageQueue.push(message)
  }
}

// every interval this function tracks the messages sent in the circular buffer
Channel.prototype.trackInterval = function () {
  this.buffer.push(this.tracker)
  this.tracker = 0

  if (this.messageQueue.length > 0) {
    const freeMessageSlots = Math.min(this.calculateFreeMessageSlots(), this.messageQueue.length)
    for (let i = 0; i < freeMessageSlots; i++) {
      this.sendMessageFunc(`PRIVMSG ${this.name} :${this.messageQueue[0]}`)
      this.messageQueue.shift()
      this.tracker++
    }
  }
}

module.exports = Channel
