import { expect } from "chai";

import IRC from "../src/irc";

const HOST = "irc.chat.twitch.tv";
const PORT = 6667;

describe("IRC", () => {
  describe("constructor", () => {
    it("should create a new IRC instance", () => {
      const client = new IRC(HOST, PORT);
      expect(client).to.be.an.instanceof(IRC);
    });

    it("should connect to an irc server", async () => {
      const client = new IRC(HOST, PORT);
      await client.connect();
      expect(client.isConnected()).to.equal(true);
    });

    it("should listen for recieved data", async () => {
      const client = new IRC(HOST, PORT);
      await client.connect();
      client.listen(data => {
        console.log(data);
      });
    });
  });
});
