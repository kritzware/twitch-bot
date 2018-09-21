"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BOOL_KEYS = { mod: 1, subscriber: 1, turbo: 1 };
const NUMBER_KEYS = { roomId: 1, tmiSentTs: 1, userId: 1, bits: 1 };
function formatPrivMsg(chunk) {
    const message = {};
    let rawMessage = '';
    for (const attribute of chunk.split(';')) {
        let [key, value] = attribute.split('=');
        if (key.includes('@')) {
            key = key.split('@')[1];
        }
        const camelCaseKey = toCamelCase(key);
        let normalisedValue = value;
        if (BOOL_KEYS.hasOwnProperty(camelCaseKey)) {
            normalisedValue = !!+value;
        }
        if (NUMBER_KEYS.hasOwnProperty(camelCaseKey)) {
            normalisedValue = +value;
        }
        if (camelCaseKey === 'badges' && normalisedValue) {
            const badges = formatBadges(normalisedValue);
            message[camelCaseKey] = badges;
            continue;
        }
        if (camelCaseKey !== 'userType') {
            ;
            message[camelCaseKey] = normalisedValue;
        }
        else {
            rawMessage = normalisedValue;
        }
    }
    const messageContents = rawMessage.split('PRIVMSG #')[1];
    const splitMessage = messageContents.split(' :');
    message.channel = splitMessage[0];
    message.message = splitMessage[1].trim();
    const colouredMessageParts = message.message.includes('ACTION')
        ? message.message.split('ACTION')
        : [];
    if (colouredMessageParts && colouredMessageParts.length > 0) {
        colouredMessageParts.shift();
        message.message = `/me${colouredMessageParts.join('ACTION').replace('\u0001', '')}`;
    }
    return message;
}
exports.formatPrivMsg = formatPrivMsg;
function formatJoin(chunk) {
    return chunk.split(`JOIN `)[1].trim();
}
exports.formatJoin = formatJoin;
function formatBadges(badgeTags) {
    const badges = badgeTags.split(',');
    const formattedBadges = {};
    for (const badge of badges) {
        const [type, value] = badge.split('/');
        formattedBadges[snakeToCamel(type)] = +value;
    }
    return formattedBadges;
}
function toCamelCase(str) {
    return str.replace(/-([a-z])/g, g => {
        return g[1].toUpperCase();
    });
}
function snakeToCamel(str) {
    return str.replace(/(_\w)/g, m => {
        return m[1].toUpperCase();
    });
}
