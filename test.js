const bot = require('./index');
const twitchBot = new bot({username:'anxietypb',oauth:'oauth:iqv7f02h5abzf7t8uhrctvyk72zk44',channels:['back2warcraft']});
twitchBot.on('message',(m)=>console.log(m))
twitchBot.on('message',(m)=>console.log(twitchBot.channels))
