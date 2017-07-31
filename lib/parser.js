const _ = require('lodash')

module.exports = {

  formatPRIVMSG(event) {
    const parsed = {}

    const msg_parts = event.split('PRIVMSG ')[1]
    let split_msg_parts = msg_parts.split(' :')
    const channel = split_msg_parts[0]

    if(split_msg_parts.length >= 2) {
      split_msg_parts.shift()
    }
    const message = split_msg_parts.join(' :').replace(/\r\n/g, '')

    let tags = event.split('PRIVMSG')[0].split(':')
    const username = tags.pop().split('!')[0]
    tags = tags.join(':').replace(/\s/g,'').split(';')

    tags.forEach(tag => {
      const split_tag = tag.split('=')
      const name = this.formatTagName(split_tag[0])
      const val = this.formatTagVal(split_tag[1])
      parsed[name] = val
    })

    parsed.mod = !!parsed.mod
    parsed.subscriber = !!parsed.subscriber
    parsed.turbo = !!parsed.turbo
    
    if(parsed.emote_only) parsed.emote_only = !!parsed.emote_only

    let badges = parsed['@badges']
    delete parsed['@badges']

    badges = badges.split(',')
    const parsed_badges = {}

    badges.forEach(badge => {
      const split_badge = badge.split('/')
      parsed_badges[split_badge[0]] = +split_badge[1]
    })
    parsed.badges = parsed_badges

    parsed.channel = channel
    parsed.message = message
    parsed.username = username.charAt(0).toUpperCase() + username.slice(1)

    return parsed
  },

  formatTagName(tag) {
    if(tag.includes('-')) {
      tag = tag.replace(/-/g, '_')
    }
    return tag
  },

  formatTagVal(val) {
    if(!val) return null
    if(val.match(/^[0-9]+$/) !== null) {
      return +val
    }
    return val
  }

}