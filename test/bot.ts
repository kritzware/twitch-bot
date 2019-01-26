import TwitchBot from "../src/bot";

const Bot = new TwitchBot({
  username: process.env.TWITCHBOT_USERNAME as string,
  oauth: process.env.TWITCHBOT_OAUTH as string,
  channels: ["#kritzware"],
});

// describe("TwitchBot", () => {
//   describe("constructor", () => {
//     it("should create a new TwitchBot instance", async () => {

//     });
//   });
// });
