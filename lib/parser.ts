import { Chunk, Channel } from './types'

/** @constant */
const BOOL_KEYS = { mod: 1, subscriber: 1, turbo: 1 }
const NUMBER_KEYS = { roomId: 1, tmiSentTs: 1, userId: 1, bits: 1 }

/**
 * @name PrivMsg
 * @interface
 */
export interface PrivMsg {
  badges?: Badges
  bits?: number
  color: string
  displayName: string
  id: string
  emotes?: string //[]
  mod: boolean
  roomId: number
  subscriber: boolean
  tmiSentTs: number
  turbo: boolean
  userId: number
  channel: string
  message: string
}

/**
 * @name Badges
 * @interface
 */
export interface Badges {
  admin?: number
  bits?: number
  broadcaster?: number
  globalMod?: number
  moderator?: number
  subscriber?: number
  staff?: number
  turbo?: number
  premium?: number
}

/**
 * @name formatPrivMsg
 * @function
 * @description Converts PRIVMSG string to an object
 */
export function formatPrivMsg(chunk: Chunk): PrivMsg {
  const message = <PrivMsg>{}
  let rawMessage: string = ''

  for (const attribute of chunk.split(';')) {
    let [key, value] = attribute.split('=')
    if (key.includes('@')) {
      key = key.split('@')[1]
    }
    const camelCaseKey = toCamelCase(key)
    let normalisedValue: boolean | string | number = value

    /* Convert types */
    if (BOOL_KEYS.hasOwnProperty(camelCaseKey)) {
      normalisedValue = !!+value
    }
    if (NUMBER_KEYS.hasOwnProperty(camelCaseKey)) {
      normalisedValue = +value
    }

    /* Badges */
    if (camelCaseKey === 'badges' && normalisedValue) {
      const badges = formatBadges(normalisedValue as string)
      ;(message as any)[camelCaseKey] = badges
      continue
    }

    if (camelCaseKey !== 'userType') {
      ;(message as any)[camelCaseKey] = normalisedValue
    } else {
      rawMessage = <string>normalisedValue
    }
  }

  const messageContents = rawMessage.split('PRIVMSG #')[1]
  const splitMessage = messageContents.split(' :')
  message.channel = splitMessage[0]
  message.message = splitMessage[1].trim()

  const colouredMessageParts = message.message.includes('ACTION')
    ? message.message.split('ACTION')
    : []

  if (colouredMessageParts && colouredMessageParts.length > 0) {
    colouredMessageParts.shift()
    message.message = `/me${colouredMessageParts.join('ACTION').replace('\u0001', '')}`
  }
  return message
}

/**
 * @name formatJoin
 * @function
 * @description Gets the channel from a JOIN event
 */
export function formatJoin(chunk: Chunk): Channel {
  return chunk.split(`JOIN `)[1].trim()
}

/**
 * @name formatBadges
 * @param badgeTags
 */
function formatBadges(badgeTags: string): Badges {
  const badges = badgeTags.split(',')
  const formattedBadges = <Badges>{}
  for (const badge of badges) {
    const [type, value] = badge.split('/')
    ;(<any>formattedBadges)[snakeToCamel(type)] = +value
  }
  return formattedBadges
}

/**
 * @name toCamelCase
 * @param str
 * @description Converts kebab case to camel case
 */
function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, g => {
    return g[1].toUpperCase()
  })
}

/**
 * @name snakeToCamel
 * @param str
 * @description Converts lower snake case to camel case
 */
function snakeToCamel(str: string) {
  return str.replace(/(_\w)/g, m => {
    return m[1].toUpperCase()
  })
}
