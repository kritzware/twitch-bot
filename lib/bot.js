'use strict'

const tls = require('tls')
const assert = require('assert')
const EventEmitter = require('events').EventEmitter

const parser = require('./parser')

const TwitchBot = class TwitchBot extends EventEmitter {

  constructor({
    username,
    oauth,
    channels,
    port=443,
    silence=false
  }) {
    super()

    try {
      assert(username)
      assert(oauth)
      assert(channels.length)
    } catch(err) {
      throw new Error('missing or invalid required arguments')
    }

    this.username = username
    this.oauth = oauth
    this.channels = channels.map((channel) => {
      channel = channel.toLowerCase()
      return channel.charAt(0) !== '#' ? '#' + channel : channel
    })

    this.irc = new tls.TLSSocket()
    this.port = port
    this.silence = silence

    this._connect()
  }

  async _connect() {
    this.irc.connect({
      host: 'irc.chat.twitch.tv',
      port: this.port
    })
    this.irc.setEncoding('utf8')
    this.irc.once('connect', () => {
      this.writeIrcMessage("PASS " + this.oauth)
      this.writeIrcMessage("NICK " + this.username)
      this.channels.forEach(c => this.writeIrcMessage("JOIN " + c))

      this.writeIrcMessage("CAP REQ :twitch.tv/membership")
      this.writeIrcMessage("CAP REQ :twitch.tv/tags")
      this.writeIrcMessage("CAP REQ :twitch.tv/commands")

      this.emit('join')
      this.listen()
    })
    this.irc.on('error', err => this.emit('error', err))
  }

  listen() {
    this.irc.on('data', data => {
      this.checkForError(data)
      /* Twitch sends keep-alive PINGs, need to respond with PONGs */
      if(data.includes('PING :tmi.twitch.tv')) {
        this.irc.write('PONG :tmi.twitch.tv\r\n')
      }
      if(data.includes('PRIVMSG')) {
        const chatter = parser.formatPRIVMSG(data)

        this.emit('message', chatter)
      }
      if(data.includes('CLEARCHAT')) {
        const event = parser.formatCLEARCHAT(data)
        if(event.type === 'timeout') this.emit('timeout', event)
        if(event.type === 'ban') this.emit('ban', event)
      }
      if (data.includes('USERNOTICE')) {
         const subscriber = parser.formatSUBSCRIBE(data)

         this.emit('subscribe', subscriber)
      }
      
    })
  }

  checkForError(event) {
    /* Login Authentication Failed */
    if(event.includes('Login authentication failed')) {
      this.irc.emit('error', {
        message: 'Login authentication failed'
      })
    }
    /* Auth formatting */
    if(event.includes('Improperly formatted auth')) {
      this.irc.emit('error', {
        message: 'Improperly formatted auth'
      })
    }
  }

  writeIrcMessage(text) {
    this.irc.write(text + "\r\n")
  }

  say(message, channel, callback ) {
    if(!channel) {
      channel = this.channels[0]
    }
    if(message.length >= 500) {
      this.cb(callback, {
        sent: false,
        message: 'Exceeded PRIVMSG character limit (500)'
      })
    } else {
      this.writeIrcMessage('PRIVMSG ' + channel + ' :' + message)
    }
  }

  timeout(username, channel, duration=600, reason='') {
    if(!channel) {
      channel = this.channels[0]
    }
    this.say(`/timeout ${username} ${duration} ${reason}`, channel)
  }

  ban(username, channel, reason='') {
    if(!channel) {
      channel = this.channels[0]
    }
    this.say(`/ban ${username} ${reason}`, channel)
  }

  close() {
    this.irc.destroy()
    this.emit('close')
  }

  cb(callback, obj) {
    if(callback) {
      obj.ts = new Date()
      callback(obj)
    }
  }

}

module.exports = TwitchBot
