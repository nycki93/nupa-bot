import { Query, REPLY_TYPE } from './types';
import * as tictactoe from './tictactoe';

const NO_INTENT = { type: 'NONE' as const };

function ping(query: Query) {
    return {
        type: REPLY_TYPE.MESSAGE,
        room: query.room,
        text: 'pong!',
    };
};

function play(query: Query) {
    return { type: REPLY_TYPE.NONE };
}

function join(query: Query) {
    return tictactoe.join(query);
}

function start(message: Message, state: any) {
    return tictactoe.start(message, state);
}

function move(message: Message, state: any) {
    return tictactoe.move(message, state);
}

const commands = { ping, play, join, start, move };

export function command(
    message: Message, state: any = {}
): {
    intent: Intent, state: any,
} { 
    const m = message.text.match(/^\w+/);
    const keyword = m && m[0];
    if (keyword in commands) return commands[keyword](message, state);
    return {
        intent: { type: 'NONE' as const },
        state
    }
};
