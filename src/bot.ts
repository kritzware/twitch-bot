import IRC from "./irc";

interface TwitchBotOptions {
  username: string;
  oauth: string;
  channels: Array<string>;
  silence?: boolean;
}

const HOST = "irc.chat.twitch.tv";
const PORT = 6667;

export default class TwitchBot {
  private options: TwitchBotOptions;
  private client: IRC;

  constructor(options: TwitchBotOptions) {
    this.options = options;
    this.client = new IRC(HOST, PORT);
  }

  public async connect(): Promise<void> {
    await this.client.connect();
  }
}
