import { Query, ActionMessage, Action } from './types';
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
    QUIT_PROMPT: 'Are you sure you want to quit? [y/n]',
    QUIT_CANCELED: 'Nevermind.',
}

function ping(params: {
    state: MainState, query: Query,
}): { 
    state: MainState, reply: ActionMessage 
} {
    return {
        state: params.state,
        reply: { type: 'MESSAGE', message: Text.PONG }
    }
};

function play(params: {
    state: MainState, query: Query,
}): {
    state: MainState, reply: Action,
} {
    const { state, query } = params;
    if (query.args[1] === 'tictactoe' && !state.app) return {
        state: { ...state, 
            context: 'PLAYING',
            app: 'tictactoe',
            appState: { context: 'INIT' }, 
        },
        reply: { type: 'MESSAGE', message: Text.APP_STARTED('tictactoe')},
    };
    return {
        state,
        reply: { type: 'ERROR', error: Text.BAD_COMMAND(query.args[1]) },
    }
}

function quit(params: {
    state: MainState, query: Query
}): {
    state: MainState, reply: ActionMessage
} {
    return {
        state: { ...params.state, context: 'QUIT_CONFIRM' },
        reply: { type: 'MESSAGE', message: Text.QUIT_PROMPT },
    }
}

function quitConfirm(params: { 
    state: MainState, query: Query, 
}): { 
    state: MainState, reply: ActionMessage,
} {
    const { state, query } = params;
    if (query.args[0] === 'y') return {
        state: { ...state,
            context: 'INIT',
            app: undefined,
            appState: undefined,
        },
        reply: { type: 'MESSAGE', message: Text.APP_STOPPED(state.app) },
    }
    if (query.args[0] === 'n') return {
        state: { ...state, context: 'PLAYING' },
        reply: { type: 'MESSAGE', message: Text.QUIT_CANCELED },
    }
    return quit({ state, query });
}

function appCommand(params: {
    state: MainState, query: Query
}): {
    state: MainState, reply: Action
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
    state: MainState, reply: Action,
} {
    const state = { ...params.state };
    state.context = state.context || 'INIT';
    const query = { ...params.query };
    query.args = query.args || query.text.split(/\s+/);
    const keyword = query.args[0];
    let result: { state: MainState, reply: ActionMessage };
    if (state.context === 'INIT') {
        if (keyword === 'ping') return ping({ state, query });
        if (keyword === 'play') return play({ state, query });
    }
    if (state.context === 'PLAYING') {
        if (keyword === 'ping') return ping({ state, query });
        if (keyword === 'quit') return quit({ state, query });
        return appCommand({ state, query });
    }
    if (state.context === 'QUIT_CONFIRM') return quitConfirm({ state, query });
    return {
        state, 
        reply: { type: 'ERROR', error: Text.BAD_COMMAND(query.args[0]) },
    };
};
