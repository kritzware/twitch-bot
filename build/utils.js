"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function argError(message) {
    throw new Error(message);
}
exports.argError = argError;
function getEvent(data) {
    const isCommand = /(?<=tmi.twitch.tv|jtv) ([0-9]|[A-Z])\w+/;
    const matches = data.match(isCommand);
    const match = matches[0].trim();
    if (!isNaN(match)) {
        return +match;
    }
    return match;
}
exports.getEvent = getEvent;
