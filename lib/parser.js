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

    let badges = parsed.badges

    if(badges) {
      badges = badges.split(',')
      const parsed_badges = {}

      badges.forEach(badge => {
        const split_badge = badge.split('/')
        parsed_badges[split_badge[0]] = +split_badge[1]
      })
      parsed.badges = parsed_badges
    }

    parsed.channel = channel
    parsed.message = message
    parsed.username = username.charAt(0).toUpperCase() + username.slice(1)

    return parsed
  },

  formatCLEARCHAT(event) {
    const parsed = {}

    const msg_parts = event.split('CLEARCHAT ')[1]
    let split_msg_parts = msg_parts.split(' :')
    
    const channel = split_msg_parts[0]
    const target_username = split_msg_parts[1]

    let tags = event.split('CLEARCHAT')[0].split(':')

    const username = tags.pop().split('!')[0]

    tags = tags.join(':').replace(/\s/g,' ').split(';')

    tags.forEach(tag => {
      const split_tag = tag.split('=')
      const name = this.formatTagName(split_tag[0])
      let val = this.formatTagVal(split_tag[1])
      parsed[name] = val
    })

    if(parsed.ban_reason) {
      parsed.ban_reason = parsed.ban_reason.replace(/\\s/g, ' ')
    }

    if(parsed.ban_duration) parsed.type = 'timeout'
    else parsed.type = 'ban'

    parsed.channel = channel
    parsed.target_username = target_username.replace(/\r\n/g, '')

    /* TODO: This needs a proper fix */
    parsed.tmi_sent_ts = parseInt(parsed.tmi_sent_ts)

    return parsed
  },

   formatSUBSCRIBE(event){
    let fields = event.substring(1).replace(/\\s/g,' ').replace(/\r\n/g, '').split(";")
    let subscribe = {}
    fields.forEach(val=>{
      let components = val.split("=")
      subscribe[components[0]] = components[1]
    })

    let badges = subscribe.badges

    if(badges) {
      badges = badges.split(',')
      const parsed_badges = {}

      badges.forEach(badge => {
        const split_badge = badge.split('/')
        parsed_badges[split_badge[0]] = +split_badge[1]
      })
      subscribe.badges = parsed_badges
    }

    subscribe.mod = !!subscribe.mod
    subscribe.subscriber = !!subscribe.subscriber
    subscribe.turbo = !!subscribe.turbo

    return(subscribe)
  },

  formatTagName(tag) {
    if(tag.includes('-')) {
      tag = tag.replace(/-/g, '_')
    }
    if(tag.includes('@')) {
      tag = tag.replace('@', '')
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
