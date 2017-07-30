'use strict'

const tls = require('tls')
const assert = require('assert')
const EventEmitter = require('events').EventEmitter

const TwitchBot = class TwitchBot extends EventEmitter {

  constructor({
    username,
    oauth,
    channel,
    port=443,
    silence=false
  }) {
    super()
    
    try {
      assert(username)
      assert(oauth)
      assert(channel)
    } catch(err) {
      throw new Error('missing required arguments')
    }

    this.username = username
    this.oauth = oauth
    this.channel = channel.toLowerCase()
    if(this.channel.charAt(0) !== '#') this.channel = '#' + this.channel

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

      

      this.emit('join')
      this.listen()
    })
  }

  listen() {

  }

}

module.exports = TwitchBot