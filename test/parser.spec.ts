import { expect } from 'chai'

import { formatPrivMsg } from '../lib/parser'
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
