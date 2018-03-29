var sinon = require('sinon');

const TwitchBot = require('../index');
const expect = require('chai').expect;
console.log( TwitchBot.prototype._connect.displayName)
var connectStub = TwitchBot.prototype._connect.displayName === '_connect' ? 
                  TwitchBot.prototype._connect
                  : sinon.stub(TwitchBot.prototype, '_connect')

var myBot = null;
var writeStub = null;
const samples = require('./samples');

const USERNAME = 'test'

describe('emulated IO tests', function() {
  beforeEach((done) => {
    myBot = new TwitchBot({username: USERNAME, oauth: 'oauth:123abc'})
    const JOIN_MESSAGE = `:${USERNAME}!${USERNAME}@${USERNAME}.tmi.twitch.tv JOIN #testchannel`

    writeStub = sinon.stub(myBot.irc, 'write')
    connectStub.callsFake(function() {
      this.emit('connect');
    })
    myBot.afterConnect();
    myBot.irc.emit("data", JOIN_MESSAGE)
    done();
  });

  it('should only send 20 messages because of rate limitation', () => {
    let count = 0

    writeStub.callsFake(function (data, encoding, cb) {
      count++
    });

    for (let i = 0;i<25;i++){
      myBot.say('testmessage', '#testchannel')
    }

    expect(count).to.equal(20)
    expect(myBot.channelManager._channels['#testchannel'].messageQueue.length).to.equal(5)
  })

  after(() => {
    myBot.close()
  })

})
