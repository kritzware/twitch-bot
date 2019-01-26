type Badge =
  | "admin"
  | "bits"
  | "broadcaster"
  | "global_mod"
  | "moderator"
  | "subscriber"
  | "staff"
  | "turbo";

type ID = string;
type UserID = ID;
type RoomID = ID;

type Timestamp = string;
type Mod = 0 | 1;
type Message = string;
type Duration = number;
type Name = string;
type Color = string;

// https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags
interface CLEARCHAT {
  ban_duration?: Duration;
}

// https://dev.twitch.tv/docs/irc/tags/#clearmsg-twitch-tags
interface CLEARMSG {
  login: Name;
  message: Message;
  target_msg_id: ID;
}

// https://dev.twitch.tv/docs/irc/tags/#globaluserstate-twitch-tags
interface GLOBALUSERSTATE {
  badges: Array<Badge>;
  color: Color;
  display_name: Name;
  // TODO: emote sets
  emote_sets: any;
  user_id: ID;
}

// https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags
interface PRIVMSG {
  badges: Array<Badge>;
  // TODO: bits
  bits?: any;
  color: Color;
  display_name: Name;
  // TODO: emotes
  emotes: any;
  id: ID;
  message: Message;
  mod: Mod;
  room_id: ID;
  tmi_sent_ts: Timestamp;
  user_id: ID;
}
