import { Command } from './types';
import tictactoe from './tictactoe';

export const Text = {
    BAD_COMMAND: 'Invalid command. Is a game in progress?',
    PONG: 'pong!',
}

const ping: Command = function(query) {
    return {
        type: 'MESSAGE',
        room: query.room,
        text: Text.PONG,
        state: query.state,
    };
};

const play: Command = function(query) {
    if (query.text === 'play tictactoe') return {
        type: 'NONE',
        state: {
            ...query.state,
            app: 'tictactoe',
        }
    }
    return { type: 'NONE' };
}

const commands: { [key: string]: Command} = { 
    ping, 
    play,
};

const main: Command = (query) => {
    const { state, text } = query;
    const m = text.match(/^\w+/);
    const keyword = m && m[0] && m[0].toLowerCase();
    if (keyword in commands) {
        return commands[keyword](query);
    }
    if (state.app === 'tictactoe' && keyword in tictactoe) {
        return tictactoe[keyword](query);
    }
    return { type: 'NONE' };
};
export default main;
