import { Query, Reply } from './types';
import { tictactoeCommand, TictactoeState } from './tictactoe';

export interface MainState {
    context?: 'INIT'|'PLAYING'|'QUIT_CONFIRM',
    app?: 'tictactoe',
    appState?: TictactoeState,
}

export const Text = {
    BAD_COMMAND: (cmd: string) => 'Unrecognized command "' + cmd + '".',
    PONG: 'pong!',
    APP_STARTED: (app: string) => app + ' started.',
    APP_STOPPED: (app: string) => app + ' stopped.',
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
            context: 'PLAYING',
            app: 'tictactoe',
            appState: { context: 'INIT' }, 
        },
        reply: { message: Text.APP_STARTED('tictactoe')},
    };
    return {
        state,
        reply: { error: Text.BAD_COMMAND(query.args[1]) },
    }
}

function quit(params: {
    state: MainState, query: Query
}): {
    state: MainState, reply: Reply
} {
    return {
        state: { ...params.state, context: 'QUIT_CONFIRM' },
        reply: { message: 'Are you sure you want to quit? [y/n]' },
    }
}

function quitConfirm(params: { 
    state: MainState, query: Query, 
}): { 
    state: MainState, reply: Reply,
} {
    const { state, query } = params;
    if (query.args[0] === 'y') return {
        state: { ...state,
            context: 'INIT',
            app: undefined,
            appState: undefined,
        },
        reply: { message: Text.APP_STOPPED(state.app) },
    }
    if (query.args[0] === 'n') return {
        state: { ...state, context: 'PLAYING' },
        reply: { message: 'Nevermind.' },
    }
    return quit({ state, query });
}

function appCommand(params: {
    state: MainState, query: Query
}): {
    state: MainState, reply: Reply
} {
    const { state, query } = params;
    const app = tictactoeCommand;
    const { state: appState, reply } = app({ state: state.appState, query });
    if (appState.context === 'EXIT') return {
        state: { ...state, 
            context: 'INIT', 
            app: undefined, 
            appState: undefined, 
        },
        reply,
    };
    return {
        state: { ...state, appState },
        reply,
    };
}

export const mainCommand = function(params:{ 
    state: MainState, query: Query,
}): {
    state: MainState, reply: Reply,
} {
    const state = { ...params.state };
    state.context = state.context || 'INIT';
    const query = { ...params.query };
    query.args = query.args || query.text.split(/\s+/);
    const keyword = query.args[0];
    let result: { state: MainState, reply: Reply };
    if (state.context === 'INIT') {
        if (keyword === 'ping') return ping({ state, query });
        if (keyword === 'play') return play({ state, query });
    }
    if (state.context === 'PLAYING') {
        if (keyword === 'ping') return ping({ state, query });
        if (keyword === 'quit') return quit({ state, query });
        const result = appCommand({ state, query });
        if ( result.reply.error || result.reply.message ) return result; 
    }
    if (state.context === 'QUIT_CONFIRM') return quitConfirm({ state, query });
    return {
        state, 
        reply: { error: Text.BAD_COMMAND(query.args[0]) },
    };
};
