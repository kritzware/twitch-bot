import { Socket } from 'net'
import { EventEmitter } from 'events'

import { Chunk } from './types'

export default class IRC {
  private readonly host: string
  private readonly port: number
  private socket: Socket

  constructor(host: string, port: number) {
    this.host = host
    this.port = port
    this.socket = new Socket()
  }

  public async connect(): Promise<any> {
    return new Promise(resolve => {
      this.socket.setEncoding('utf8')
      this.socket.on('ready', () => resolve())
      this.socket.connect({
        host: this.host,
        port: this.port,
      })
    })
  }

  public write(message: string): void {
    this.socket.write(`${message}\r\n`)
  }

  public listen(callback: (data: Chunk) => void): void {
    this.socket.on('data', (chunk: Chunk) => {
      const lines = chunk.split('\n:')
      for (const line of lines) {
        callback(line)
      }
    })
  }

  public once(callback: (data: Chunk) => void): void {
    this.socket.once('data', (chunk: Chunk) => {
      callback(chunk)
    })
  }
}
