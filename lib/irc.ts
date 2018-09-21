import { Socket } from 'net'
import { EventEmitter } from 'events'

import { Chunk } from './types'

export default class IRC {
  private readonly host: string
  private readonly port: number
  private socket: Socket
  private lastChunk: Chunk | undefined
  private listenForChunk: boolean = false

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

  public write(message: string, callback?: () => void): void {
    this.socket.write(`${message}\r\n`, callback)
  }

  public writeWithResponse(message: string): Promise<Chunk> {
    return new Promise(resolve => {
      this.write(message, () => {
        this.listenForChunk = true
        const checkForNewChunk = setInterval(() => {
          if (!this.listenForChunk) {
            clearInterval(checkForNewChunk)
            resolve(this.lastChunk)
          }
        }, 10)
      })
    })
  }

  public listen(callback: (data: Chunk) => void): void {
    this.socket.on('data', (chunk: Chunk) => {
      // console.log(chunk)
      const lines = chunk.split('\r\n')
      console.log(lines)

      for (const line of lines) {
        if (this.listenForChunk) {
          this.lastChunk = line
          this.listenForChunk = false
        }
        callback(line)
      }
    })
  }
}
