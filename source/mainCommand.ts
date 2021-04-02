import { Command } from './types';
import * as tictactoe from './tictactoe';

const ping: Command = function(query) {
    return {
        type: 'MESSAGE',
        room: query.room,
        text: 'pong!',
        state: query.state,
    };
};

const commands: { [key: string]: Command} = { 
    ping, 
    play: () => ({ type: 'NONE' }), 
    join: tictactoe.join,
    start: tictactoe.start,
    move: tictactoe.move,
};

const main: Command = (query) => {
    const m = query.text.match(/^\w+/);
    const keyword = m && m[0];
    if (keyword in commands)
        return commands[keyword](query);
    return { type: 'NONE' };
};
export default main;
