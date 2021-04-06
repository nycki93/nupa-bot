import { Query, Reply } from './types';

export type TictactoeState = {
    context: 'INITIAL'|'PLAYING'
    board?: Array<' '|'X'|'O'>,
    turn?: 'X'|'O',
    players?: {
        'X': string,
        'O': string,
    },
}

const Text = {
    JOIN_USAGE: "Options: X, O.",
};

function display(state: TictactoeState) {
    const { board } = state;
    return (''
        + ' ' + board[0] + ' | ' + board[1] + ' | ' + board[2] + ' \n'
        + '---+---+---\n'
        + ' ' + board[3] + ' | ' + board[4] + ' | ' + board[5] + ' \n'
        + '---+---+---\n'
        + ' ' + board[6] + ' | ' + board[7] + ' | ' + board[8] + ' \n'
    );
}

function join(params: {
    state: TictactoeState, query: Query,
}) : {
    state: TictactoeState, reply: Reply,
} {
    const { state, query } = params;
    const choice = (query.args[1] || '').toUpperCase();
    const piece = (
        choice === 'X' ? 'X' :
        choice === 'O' ? 'O' :
        ''
    );
    if (query.args.length !== 2 || !piece) return {
        state,
        reply: { error: Text.JOIN_USAGE }
    }
    if (state.players && state.players[piece]) return {
        state,
        reply: { error: 'That character is already claimed!' },
    }
    return {
        state: {...state,
            players: {...state.players,
                [piece]: query.user,
            },
        },
        reply: { message: query.user + ' claimed character ' + piece + '.' },
    }
}

function start(params: {
    state: TictactoeState, query: Query,
}): {
    state: TictactoeState, reply: Reply,
} {
    const { state, query } = params;
    const newState = {...state,
        context: 'PLAYING' as const,
        board: Array(9).fill(' '),
        turn: 'X' as const,
    };
    return {
        state: newState,
        reply: { message: display(newState) },
    }
}

function move(params: {
    state: TictactoeState,
    query: Query,
}) {
    const { state, query } = params;
    const position = query.args.length === 2 && parseInt(query.args[1]);
    if (state.players[state.turn] !== query.user) return {
        state,
        reply: { error: 'It is not your turn!' },
    };
    if (!(position >= 1 && position <= 9)) return {
        state,
        reply: { 
            error: (''
                + 'Usage: ' + query.args[0] + ' <position>\n'
                + 'positions are from 1 (top left) to 9 (bottom right).'
            ),
        },
    };
    if (state.board[position-1] !== ' ') return {
        state,
        reply: { error: 'That position is already occupied!' },
    };
    const newBoard = [...state.board];
    newBoard[position-1] = state.turn;
    const newTurn = (state.turn === 'X' ? 'O' as const : 'X' as const);
    const newState = { 
        ...state, 
        board: newBoard,
        turn: newTurn,
    }
    return {
        state: newState,
        reply: { message: display(newState) },
    }
}

export const tictactoeCommand = function(params: {
    state: TictactoeState,
    query: Query,
}): {
    state: TictactoeState,
    reply: Reply,
} {
    const { state, query } = params;
    const keyword = query.args[0];
    if (keyword === 'join' && state.context === 'INITIAL') {
        return join({ state, query });
    }
    if (keyword === 'start' && state.context === 'INITIAL') {
        return start({ state, query });
    }
    if (keyword === 'move' && state.context === 'PLAYING') {
        return move({ state, query });
    }
    return { state, reply: { } }
}
