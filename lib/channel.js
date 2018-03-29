const CircularBuffer  = require('circular-buffer')

const Channel = function(name){
  this.name = name
  this.tracker = 0 // keep track of the messages sent per evaluation interval
  this.elevated = false
  this.messageQueue = [] //keep track of messages that could not be sent yet
  this.timeUpperBound = 10 // in seconds, the time interval that allows a maximum of this.limit messages
  this.limit = 10 //the maximum limit for
  this.buffer = new CircularBuffer(this.timeUpperBound) // keep track of messages sent in last timeUpperBound seconds
}

Channel.prototype.calculateFreeMessageSlots = function(){
  return this.limit - ( this.buffer.toarray().reduce((sum,bufferValue) => sum+bufferValue, 0) + this.tracker )
}

Channel.prototype.sendMessage = function(message){

  if (this.messageQueue.length === 0){
    if (this.calculateFreeMessageSlots() > 0){
      console.log("Sending a message: "+message)
      this.tracker++
    } else {
      console.log("Started to put messages in waiting queue: "+message)
      this.messageQueue.push(message)
    }

  }
  else {
    console.log("Put message in waiting queue: "+message)
    this.messageQueue.push(message)
  }
}

//every interval this function tracks the messages sent in the circular buffer
Channel.prototype.trackInterval = function(){
  this.buffer.push(this.tracker)
  this.tracker = 0

  if (this.messageQueue.length > 0){
    let freeMessageSlots = this.calculateFreeMessageSlots()
    for (let i = 0;i < Math.min(freeMessageSlots,this.messageQueue.length); i++){
        console.log("SENT from queue: ",this.messageQueue[0])
        this.messageQueue.shift()
        this.tracker++

    }

  }
}

module.exports = Channel
