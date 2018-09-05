import { PrivMsg, Badges } from '../lib/parser'

interface Sample {
    actual: string
    expected: PrivMsg | Badges
}

// export const PRIVMSG = `
//     @badges=global_mod/1,turbo/1;color=#0D4200;display-name=dallas;emotes=25:0-4,12-16/1902:6-10;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=global_mod :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :Kappa Keepo Kappa
// `
// export const PRIVMSG

// export const PRIVMSG_with_bits = `
//     @badges=staff/1,bits/1000;bits=100;color=;display-name=dallas;emotes=;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=staff :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100
// `

export const PRIVMSG: Sample = {
    actual: `@badges=global_mod/1,turbo/1;color=#0D4200;display-name=dallas;emotes=25:0-4,12-16/1902:6-10;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=global_mod :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :Kappa Keepo Kappa`,
    expected: {
        badges: { globalMod: 1, turbo: 1 },
        color: '#0D4200',
        displayName: 'dallas',
        emotes: '25:0-4,12-16/1902:6-10',
        id: 'b34ccfc7-4977-403a-8a94-33c6bac34fb8',
        mod: false,
        roomId: 1337,
        subscriber: false,
        tmiSentTs: 1507246572675,
        turbo: true,
        userId: 1337,
        channel: 'dallas',
        message: 'Kappa Keepo Kappa',
    },
}

export const PRIVMSG_with_bits: Sample = {
    actual: `@badges=staff/1,bits/1000;bits=100;color=;display-name=dallas;emotes=;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=staff :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100`,
    expected: {
        badges: { staff: 1, bits: 1000 },
        bits: 100,
        color: '',
        displayName: 'dallas',
        emotes: '',
        id: 'b34ccfc7-4977-403a-8a94-33c6bac34fb8',
        mod: false,
        roomId: 1337,
        subscriber: false,
        tmiSentTs: 1507246572675,
        turbo: true,
        userId: 1337,
        channel: 'dallas',
        message: 'cheer100',
    },
}

export const PRIVMSG_with_me: Sample = {
    actual: `@badges=broadcaster/1,subscriber/0;color=#3C78FD;display-name=kritzware;emotes=;id=4a67a9f0-3116-4300-b65b-4d6b6796cf30;mod=0;room-id=44667418;subscriber=1;tmi-sent-ts=1535820040249;turbo=0;user-id=44667418;user-type= :kritzware!kritzware@kritzware.tmi.twitch.tv PRIVMSG #kritzware :\u0001ACTION hello world\u0001`,
    expected: {
        badges: { broadcaster: 1, subscriber: 0 },
        color: '#3C78FD',
        displayName: 'kritzware',
        emotes: '',
        id: '4a67a9f0-3116-4300-b65b-4d6b6796cf30',
        mod: false,
        roomId: 44667418,
        subscriber: true,
        tmiSentTs: 1535820040249,
        turbo: false,
        userId: 44667418,
        channel: 'kritzware',
        message: '/me hello world',
    },
}
