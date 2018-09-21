import { Chunk } from './types'

export function argError(message: string) {
  throw new Error(message)
}

export function getEvent(data: Chunk) {
  const isCommand: RegExp = /(?<=tmi.twitch.tv|jtv) ([0-9]|[A-Z])\w+/
  const matches: RegExpMatchArray | null = data.match(isCommand)
  const match = (<any>matches)[0].trim()
  if (!isNaN(match)) {
    return +match
  }
  return match
}
