import { Socket } from "net";

export default class IRC {
  private host: string;
  private port: number;
  private conn: Socket;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
    this.conn = new Socket();
  }

  public async connect(): Promise<void> {
    return new Promise(resolve => {
      this.conn.setEncoding("utf8");
      this.conn.on("connect", () => resolve());
      this.conn.connect({
        host: this.host,
        port: this.port,
      });
    });
  }

  public isConnected(): boolean {
    const addr = this.conn.address();
    return !this.conn.connecting && !!addr;
  }

  public listen(cb: Function): void {
    this.conn.on("data", data => cb(data));
  }
}
