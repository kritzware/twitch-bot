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
      username: 'l1nk3n_'
    },
    long: 'PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp PogChamp'
  },

  CLEARCHAT: {
    timeout_raw: `@ban-duration=10;ban-reason=This\\sis\\sthe\\sreason\\smessage\\sKappa;room-id=44667418;target-user-id=37798112;tmi-sent-ts=1503346029068 :tmi.twitch.tv CLEARCHAT #kritzware :blarev`,
    timeout_expected: {
      ban_duration: 10,
      ban_reason: 'This is the reason message Kappa',
      room_id: 44667418,
      target_user_id: 37798112,
      tmi_sent_ts: 1503346029068,
      type: 'timeout',
      channel: '#kritzware',
      target_username: 'blarev'
    },
    ban_raw: `@ban-reason=This\\sis\\sthe\\sreason\\smessage;room-id=44667418;target-user-id=37798112;tmi-sent-ts=1503346078025 :tmi.twitch.tv CLEARCHAT #kritzware :blarev`,
    ban_expected: {
      ban_reason: 'This is the reason message',
      room_id: 44667418,
      target_user_id: 37798112,
      tmi_sent_ts: 1503346078025,
      type: 'ban',
      channel: '#kritzware',
      target_username: 'blarev'
    }
  },

  USERNOTICE: {
    subscription_raw: `@badges=staff/1,broadcaster/1,turbo/1;color=#008000;display-name=ronni;emotes=;id=db25007f-7a18-43eb-9379-80131e44d633;login=ronni;mod=0;msg-id=resub;msg-param-months=6;msg-param-sub-plan=Prime;msg-param-sub-plan-name=Prime;room-id=1337;subscriber=1;system-msg=ronni\\shas\\ssubscribed\\sfor\\s6\\smonths!;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=staff :tmi.twitch.tv USERNOTICE #dallas :Great stream -- keep it up!`,
    subscription_expected: {
      "badges": {
       "broadcaster": 1,
       "staff": 1,
       "turbo": 1
      },
      "channel": "#dallas",
      "color": "#008000",
      "display_name": "ronni",
      "emotes": null,
      "id": "db25007f-7a18-43eb-9379-80131e44d633",
      "login": "ronni",
      "message": "Great stream -- keep it up!",
      "mod": 0,
      "msg_id": "resub",
      "msg_param_months": 6,
      "msg_param_sub_plan": "Prime",
      "msg_param_sub_plan_name": "Prime",
      "room_id": 1337,
      "subscriber": 1,
      "system_msg": "ronni has subscribed for 6 months!",
      "tmi_sent_ts": 1507246572675,
      "turbo": 1,
      "user_id": 1337,
      "user_type": "staff"
    },
    subscription_nomessage_raw: `@badges=staff/1,broadcaster/1,turbo/1;color=#008000;display-name=ronni;emotes=;id=db25007f-7a18-43eb-9379-80131e44d633;login=ronni;mod=0;msg-id=resub;msg-param-months=6;msg-param-sub-plan=Prime;msg-param-sub-plan-name=Prime;room-id=1337;subscriber=1;system-msg=ronni\\shas\\ssubscribed\\sfor\\s6\\smonths!;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=staff :tmi.twitch.tv USERNOTICE #dallas :`,
    subscription_nomessage_expected: {
      "badges": {
       "broadcaster": 1,
       "staff": 1,
       "turbo": 1
      },
      "channel": "#dallas",
      "color": "#008000",
      "display_name": "ronni",
      "emotes": null,
      "id": "db25007f-7a18-43eb-9379-80131e44d633",
      "login": "ronni",
      "message": null,
      "mod": 0,
      "msg_id": "resub",
      "msg_param_months": 6,
      "msg_param_sub_plan": "Prime",
      "msg_param_sub_plan_name": "Prime",
      "room_id": 1337,
      "subscriber": 1,
      "system_msg": "ronni has subscribed for 6 months!",
      "tmi_sent_ts": 1507246572675,
      "turbo": 1,
      "user_id": 1337,
      "user_type": "staff"
      }

  },

  TAGSAMPLES: {
    badges_raw: 'staff/1,broadcaster/1,turbo/1',
    badges_expected: {
      staff: 1,
      broadcaster: 1,
      turbo: 1
    },

    tags_raw:`@badges=staff/1,broadcaster/1,turbo/1;color=#008000;display-name=ronni;emotes=;id=db25007f-7a18-43eb-9379-80131e44d633;login=ronni;mod=0;msg-id=resub;msg-param-months=6;msg-param-sub-plan=Prime;msg-param-sub-plan-name=Prime;room-id=1337;subscriber=1;system-msg=ronni\\shas\\ssubscribed\\sfor\\s6\\smonths!;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=staff`,
    tags_expected: {
      "badges": {
       "broadcaster": 1,
       "staff": 1,
       "turbo": 1
      },
      "color": "#008000",
      "display_name": "ronni",
      "emotes": null,
      "id": "db25007f-7a18-43eb-9379-80131e44d633",
      "login": "ronni",
      "mod": 0,
      "msg_id": "resub",
      "msg_param_months": 6,
      "msg_param_sub_plan": "Prime",
      "msg_param_sub_plan_name": "Prime",
      "room_id": 1337,
      "subscriber": 1,
      "system_msg": "ronni has subscribed for 6 months!",
      "tmi_sent_ts": 1507246572675,
      "turbo": 1,
      "user_id": 1337,
      "user_type": "staff"
    }
  }

}
