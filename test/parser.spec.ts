import { expect } from 'chai'

import { formatPrivMsg, formatJoin } from '../lib/parser'
import { PRIVMSG, PRIVMSG_with_bits } from './samples'

describe('formatPrivMsg', () => {
  it('should format a standard PRIVMSG event string', () => {
    const message = formatPrivMsg(PRIVMSG.actual)
    expect(message).to.deep.equal(PRIVMSG.expected)
  })

  it('should format a PRIVMSG event string with bits', () => {
    const message = formatPrivMsg(PRIVMSG_with_bits.actual)
    expect(message).to.deep.equal(PRIVMSG_with_bits.expected)
  })

  it('should format a PRIVMSG event string with "/me"', () => {
    const message = formatPrivMsg(PRIVMSG_with_bits.actual)
    expect(message).to.deep.equal(PRIVMSG_with_bits.expected)
  })
})

describe('formatJoin', () => {
  it('should return the channel from a JOIN event string', () => {
    const channel = formatJoin(
      `:access_token!access_token@access_token.tmi.twitch.tv JOIN #truecarrot`
    )
    const channel2 = formatJoin(
      `access_token!access_token@access_token.tmi.twitch.tv JOIN #truecarrot`
    )
    expect(channel).to.equal('#truecarrot')
    expect(channel2).to.equal('#truecarrot')
  })
})
