module.exports = {

  PRIVMSG: {
    raw: `@badges=subscriber/0,turbo/1;color=#000000;display-name=l1nk3n_;   emotes=266588:0-8;id=7ecde2f1-a171-4354-80c7-36ffdf358e77;mod=0;room-id=23161357;sent-ts=1501441092245;subscriber=1;tmi-sent-ts=1501441089643;turbo=1;user-id=120412737;user-type= :l1nk3n_!l1nk3n_@l1nk3n_.tmi.twitch.tv PRIVMSG #lirik :lirikPRAY : PogChamp\r\n`,
    expected: {
      color: '#000000',
      display_name: 'l1nk3n_',
      emotes: '266588:0-8',
      id: '7ecde2f1-a171-4354-80c7-36ffdf358e77',
      mod: false,
      room_id: 23161357,
      sent_ts: 1501441092245,
      subscriber: true,
      tmi_sent_ts: 1501441089643,
      turbo: true,
      user_id: 120412737,
      user_type: null,
      badges: { subscriber: 0, turbo: 1 },
      channel: '#lirik',
      message: 'lirikPRAY : PogChamp',
      username: 'L1nk3n_'
    } 
  }
  
}