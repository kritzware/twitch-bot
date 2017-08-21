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

})