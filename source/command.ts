import { Intent, Message } from './types';
import * as tictactoe from './tictactoe';

const NO_INTENT = { type: 'NONE' as const };

function ping(message: Message, state: any) {
    return {
        intent: {
            type: 'MESSAGE' as const,
            room: message.room,
            text: 'pong!',
        },
        state,
    };
};

function play(message: Message, state: any) {
    return { state, intent: NO_INTENT };
}

function join(message: Message, state: any) {
    return { state, intent: NO_INTENT };
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
