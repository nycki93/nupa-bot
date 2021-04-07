import { Query, Reply } from './types';
import { tictactoeCommand, TictactoeState } from './tictactoe';

export interface MainState {
    app?: 'tictactoe',
    tictactoe?: TictactoeState,
}

export const Text = {
    BAD_COMMAND: (cmd: string) => 'Unrecognized command "' + cmd + '".',
    PONG: 'pong!',
    APP_STARTED: (app: string) => app + ' started.',
}

function ping(params: {
    state: MainState, query: Query,
}): { 
    state: MainState, reply: Reply 
} {
    return {
        state: params.state,
        reply: { message: Text.PONG }
    }
};

function play(params: {
    state: MainState, query: Query,
}): {
    state: MainState, reply: Reply,
} {
    const { state, query } = params;
    if (query.args[1] === 'tictactoe' && !state.app) return {
        state: { ...state, 
            app: 'tictactoe',
            tictactoe: { context: 'INIT' }, 
        },
        reply: { message: Text.APP_STARTED('tictactoe')},
    };
    return {
        state,
        reply: { error: Text.BAD_COMMAND(query.args[1]) },
    }
}

const commands = { ping, play };

export const mainCommand = function(params:{ 
    state: MainState, query: Query,
}): {
    state: MainState, reply: Reply,
} {
    const { state, query } = params;
    query.args = query.args || query.text.split(/\s+/);
    const keyword = query.args[0];
    let result: { state: MainState, reply: Reply };
    if (keyword in commands) {
        const { state: newState, reply } = commands[keyword]({ 
            state, 
            query,
        });
        result = {
            state: newState, 
            reply,
        };
    } else if (state.app === 'tictactoe') {
        const { state: newState, reply } = tictactoeCommand({ 
            state: state.tictactoe, 
            query,
        });
        if (newState.context === 'EXIT') {
            result = {
                state: { ...state, app: undefined, tictactoe: undefined },
                reply,
            }
        } else {
            result = {
                state: { ...state, tictactoe: newState }, 
                reply,
            }
        }
    }
    if (result?.reply?.message || result?.reply?.error) return result;
    return {
        state, 
        reply: { error: Text.BAD_COMMAND(query.args[0]) },
    };
};
