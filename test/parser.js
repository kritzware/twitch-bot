const assert = require('assert')
const expect = require('chai').expect

const samples = require('./samples')
const parser = require('../lib/parser')

describe('parser', () => {

  describe('formatTagName', () => {
    it('should convert irc tag names to use underscores', () => {
      expect(parser.formatTagName('user-id')).to.equal('user_id')
      expect(parser.formatTagName('user-id-long-tag')).to.equal('user_id_long_tag')
    })
    it('should removed @ symbols from tag names', () => {
      expect(parser.formatTagName('@test-tag')).to.equal('test_tag')
    })
  })

  describe('formatTagVal', () => {
    it('should convert irc tag values to the correct type', () => {
      expect(parser.formatTagVal('123')).to.equal(123)
      expect(parser.formatTagVal('string:-val')).to.equal('string:-val')
      expect(parser.formatTagVal('')).to.equal(null)
    })
  })

  describe('formatPRIVMSG()', () => {
    it('should format a PRIVMSG event', () => {
      const event = samples.PRIVMSG.raw
      const parsed = parser.formatPRIVMSG(event)
      expect(parsed).to.eql(samples.PRIVMSG.expected)
    })
  })

  describe('formatCLEARCHAT()', () => {
    it('should format a CLEARCHAT timeout event', () => {
      const event = samples.CLEARCHAT.timeout_raw
      const parsed = parser.formatCLEARCHAT(event)
      expect(parsed).to.eql(samples.CLEARCHAT.timeout_expected)
    })
    it('should format a CLEARCHAT ban event', () => {
      const event = samples.CLEARCHAT.ban_raw
      const parsed = parser.formatCLEARCHAT(event)
      expect(parsed).to.eql(samples.CLEARCHAT.ban_expected)
    })
  })

  describe('formatBADGES()', () => {
    it('should format a badge-tag-string', () => {
      const event = samples.TAGSAMPLES.badges_raw
      const parsed = parser.formatBADGES(event)
      expect(parsed).to.eql(samples.TAGSAMPLES.badges_expected)
    })
  })

  describe('formatTAGS()', () => {
    it('should format a tag-string', () => {
      const event = samples.TAGSAMPLES.tags_raw
      const parsed = parser.formatTAGS(event)
      expect(parsed).to.eql(samples.TAGSAMPLES.tags_expected)
    })
  })

  describe('formatJOIN()', () => {
    it('should format a tag-string', () => {
      const event = ':<user>!<user>@<user>.tmi.twitch.tv JOIN #testchannel';
      const parsed = parser.formatJOIN(event)
      expect(parsed).to.eql('#testchannel')
    })
  })

  describe('formatPART()', () => {
    it('should format a tag-string', () => {
      const event = ':<user>!<user>@<user>.tmi.twitch.tv PART #testchannel';
      const parsed = parser.formatPART(event)
      expect(parsed).to.eql('#testchannel')
    })
  })

  describe('formatUSERNOTICE()', () => {
    it('should format a USERNOTICE subscription event', () => {
      const event = samples.USERNOTICE.subscription_raw
      const parsed = parser.formatUSERNOTICE(event)
      expect(parsed).to.eql(samples.USERNOTICE.subscription_expected)
    })

    it('should format a USERNOTICE subscription event and set message null if no message given', () => {
      const event = samples.USERNOTICE.subscription_nomessage_raw
      const parsed = parser.formatUSERNOTICE(event)
      expect(parsed).to.eql(samples.USERNOTICE.subscription_nomessage_expected)
    })
  })

  describe('formatCHANNEL()', () => {
    it('should format a channel without hashtag and some uppercase letters to contain a hashtag and only lowercase afterwards', () => {
      const parsed = parser.formatCHANNEL('someChannEl')
      expect(parsed).to.eql('#somechannel')
    })

    it('should format a channel with hashtag and some uppercase letters to contain a hashtag and only lowercase afterwards', () => {
      const parsed = parser.formatCHANNEL('#someChannEl')
      expect(parsed).to.eql('#somechannel')
    })
  })

})
