const assert = require('assert')
const expect = require('chai').expect

const TwitchBot = require('../index')
const samples = require('./samples')
const utils = require('./utils')
const socketstub = require('./socketstub')

describe('TwitchBot()', () => {
  it('should create a new Bot instance', () => {
    const bot = utils.createBotInstance({username: 'Test', oauth: '123435', channels: ['twitch']})
    expect(bot).to.be.an.instanceOf(TwitchBot)
    bot.close()
  })
  it('should throw an error if missing required arguments', () => {
    try {
      const bot = new TwitchBot({})
    } catch(err) {
      expect(err.message).to.equal('missing or invalid required arguments')
    }
  })

  it('should throw an error if channels is not an array', () => {
    try {
      const bot = new TwitchBot({channels: '#channel'})
    } catch(err) {
      expect(err.message).to.equal('missing or invalid required arguments')
    }
  })

  it('should normalize the channel name', () => {
    const bot = utils.createBotInstance({ username: 'Test', oauth: '123435', channels: ['Channel'] })
    const bot2 = utils.createBotInstance({ username: 'Test', oauth: '123435', channels: ['#ChanneL'] })
    expect(bot.channels[0]).to.equal('#channel')
    expect(bot2.channels[0]).to.equal('#channel')
    bot.close()
    bot2.close()
  })

})
