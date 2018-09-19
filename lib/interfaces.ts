import { Channel } from './types'

export interface Options {
  readonly username: string
  readonly oauth: string
  channels: Channel[]
  mute?: boolean
}

export interface SayOptions {
  channel?: Channel
  colored?: boolean
}
