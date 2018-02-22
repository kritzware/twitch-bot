var sinon = require('sinon');

const TwitchBot = require('../index');
const expect = require('chai').expect;

var connectStub = sinon.stub(TwitchBot.prototype, '_connect')
var myBot = null;
var writeStub = null;
const samples= require('./samples');

const USERNAME = 'test'

  beforeEach((done)=>{
    myBot = new TwitchBot({
      username: USERNAME,
      oauth: 'oauth:123abc'
    })

    writeStub = sinon.stub(myBot.irc, 'write')
    connectStub.callsFake(function(){
      this.emit('connect');
    })

    myBot.afterConnect();
    done();
  });

describe('emulated IO tests', function() {

  it ("should handle error if invalid auth", function(done) {

    myBot.on('error', (err) => {
        expect(err.message).to.equal('Login authentication failed');
        done();
    })
    myBot.irc.emit("data","Login authentication failed\r\n");

  });

  it ("should handle error if improperly formatted auth", function(done) {

    myBot.on('error', (err) => {
        expect(err.message).to.equal('Improperly formatted auth');
        done();
    })
    myBot.irc.emit("data","Improperly formatted auth\r\n");

  });

  it ("should handle a channel message", function(done) {

    myBot.on('message', (chatter) => {
      expect(chatter).to.eql(samples.PRIVMSG.expected)
      done();
    })
    myBot.irc.emit("data",samples.PRIVMSG.raw)

  });

  it ("should handle a subscription message", function(done) {

    myBot.on('subscription', (chatter) => {
      expect(chatter).to.eql(samples.USERNOTICE.subscription_expected)
      done();
    })
    myBot.irc.emit("data",samples.USERNOTICE.subscription_raw)

  });

  it ("should handle a timeout message", function(done) {

    myBot.on('timeout', (chatter) => {
      expect(chatter).to.eql(samples.CLEARCHAT.timeout_expected);
      done();
    })
    myBot.irc.emit("data",samples.CLEARCHAT.timeout_raw);

  });

  it ("should handle a ban message", function(done) {

    myBot.on('ban', (chatter) => {
      expect(chatter).to.eql(samples.CLEARCHAT.ban_expected);
      done();
    })
    myBot.irc.emit("data",samples.CLEARCHAT.ban_raw);

  });

  it ("should handle a self-channel-join message", function(done) {
    const JOIN_MESSAGE = `:${USERNAME}!${USERNAME}@${USERNAME}.tmi.twitch.tv JOIN #testchannel`

    myBot.on('join', channel => {
      expect(channel).to.eql("#testchannel")
      expect(myBot.channels).to.eql(["#testchannel"])
      done()
    })
    myBot.irc.emit("data", JOIN_MESSAGE)
  })

  it ("should handle a self-channel-join message with \\r\\n", function(done) {
    const JOIN_MESSAGE = `:${USERNAME}!${USERNAME}@${USERNAME}.tmi.twitch.tv JOIN #testchannel\r\n`

    myBot.on('join', (chatter) => {
      expect(chatter).to.eql("#testchannel")
      expect(myBot.channels).to.eql(["#testchannel"])
      done()
    })
    myBot.irc.emit("data", JOIN_MESSAGE)
  })

  it ("should handle a self-channel-part message", function(done) {
    const PART_MESSAGE = `:${USERNAME}!${USERNAME}@${USERNAME}.tmi.twitch.tv PART #testchannel`

    myBot.on('part', (chatter) => {
      expect(chatter).to.eql("#testchannel")
      expect(myBot.channels).to.eql([])
      done()
    })
    myBot.channels = ["#testchannel"]
    myBot.irc.emit("data", PART_MESSAGE)
  })

  it ("should handle a self-channel-part message with \\r\\n", function(done) {
    const PART_MESSAGE = `:${USERNAME}!${USERNAME}@${USERNAME}.tmi.twitch.tv PART #testchannel\r\n`

    myBot.on('part', (chatter) => {
      expect(chatter).to.eql("#testchannel")
      expect(myBot.channels).to.eql([])
      done()
    })
    myBot.channels = ["#testchannel"]
    myBot.irc.emit("data", PART_MESSAGE)
  })

  it ("should reply to a server ping", function(done) {

    writeStub.callsFake(function (data, encoding, cb) {
      let received=writeStub.args[writeStub.callCount - 1][0];
        expect(received).to.eql('PONG :tmi.twitch.tv\r\n');
        done();
    });
    myBot.irc.emit("data",'PING :tmi.twitch.tv');

  });

})

describe('say()', () => {

  it('should send a message in the channel', done => {
    writeStub.callsFake(function (data, encoding, cb) {
      let received=writeStub.args[writeStub.callCount - 1][0];
        expect(received).to.eql(`PRIVMSG ${myBot.channels[0]} :testmessage\r\n`);
        done();
    });
    myBot.say('testmessage',myBot.channels[0]);



  })
  it('should fail when the message to send is over 500 characters', done => {
      myBot.say(samples.PRIVMSG.long, myBot.channels[0], err => {
        expect(err.sent).to.equal(false)
        expect(err.message).to.equal('Exceeded PRIVMSG character limit (500)')
        done()
    })
  })
})

describe('join()', () => {

  it('should send properly formatted message to join a channel without a leading hashtag', done => {
    writeStub.callsFake(function (data, encoding, cb) {
      let received=writeStub.args[writeStub.callCount - 1][0];
        expect(received).to.eql(`JOIN #testchannel\r\n`);
        done();
    });
    myBot.join('testchannel');

  })

  it('should send properly formatted message to join a channel with a leading hashtag', done => {
    writeStub.callsFake(function (data, encoding, cb) {
      let received=writeStub.args[writeStub.callCount - 1][0];
        expect(received).to.eql(`JOIN #testchannel\r\n`);
        done();
    });
    myBot.join('#testchannel');

  })
})

describe('part()', () => {

  it('should send properly formatted message to part from a channel without a leading hashtag', done => {
    writeStub.callsFake(function (data, encoding, cb) {
      let received=writeStub.args[writeStub.callCount - 1][0];
        expect(received).to.eql(`PART #testchannel\r\n`);
        done();
    });
    myBot.part('testchannel');

  })

  it('should send properly formatted message to part from a channel with a leading hashtag', done => {
    writeStub.callsFake(function (data, encoding, cb) {
      let received=writeStub.args[writeStub.callCount - 1][0];
        expect(received).to.eql(`PART #testchannel\r\n`);
        done();
    });
    myBot.part('#testchannel');

  })
})
