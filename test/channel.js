const sinon = require('sinon')

const TwitchBot = require('../index')
const expect = require('chai').expect

const connectStub = TwitchBot.prototype._connect.displayName === '_connect'
  ? TwitchBot.prototype._connect
  : sinon.stub(TwitchBot.prototype, '_connect')

let botInstance = null
let botIrcWriteStub = null
const samples = require('./samples')

const USERNAME = 'test'

describe('emulated IO tests', function () {
  beforeEach((done) => {
    botInstance = new TwitchBot({username: USERNAME, oauth: 'oauth:123abc'})
    const JOIN_MESSAGE = `:${USERNAME}!${USERNAME}@${USERNAME}.tmi.twitch.tv JOIN #testchannel`

    botIrcWriteStub = sinon.stub(botInstance.irc, 'write')
    connectStub.callsFake(function () {
      this.emit('connect')
    })
    botInstance.afterConnect()
    botInstance.irc.emit('data', JOIN_MESSAGE)
    done()
  })

  it('should only send 20 messages because of rate limitation', () => {
    let count = 0

    botIrcWriteStub.callsFake(function (data, encoding, cb) {
      count++
    })

    for (let i = 0; i < 25; i++) {
      botInstance.say('testmessage', '#testchannel')
    }

    expect(count).to.equal(20)
    expect(botInstance.channelManager._channels['#testchannel'].messageQueue.length).to.equal(5)
  })

  after(() => {
    botInstance.close()
  })
})
