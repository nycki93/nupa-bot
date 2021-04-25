import { Query, ActionMessage, Action } from './types';

export type TictactoeState = {
    context: 'INIT'|'PLAYING'|'EXIT'
    board?: Array<' '|'X'|'O'>,
    turn?: 'X'|'O',
    players?: {
        'X': { id: string, name: string },
        'O': { id: string, name: string },
    },
}

const Text = {
    JOIN_USAGE: "Options: X, O.",
};

const LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function display(board: Array<' '|'X'|'O'>, banner?: string) {
    let result = (''
        + ' ' + board[0] + ' | ' + board[1] + ' | ' + board[2] + ' \n'
        + '---+---+---\n'
        + ' ' + board[3] + ' | ' + board[4] + ' | ' + board[5] + ' \n'
        + '---+---+---\n'
        + ' ' + board[6] + ' | ' + board[7] + ' | ' + board[8] + ' \n'
    );
    if (banner) {
        result += '===========\n' + banner + '\n';
    }
    return result;
}

function checkWinner(board: Array<' '|'X'|'O'>) {
    for (const [i, j, k] of LINES) {
        if (board[i] !== board[j]) continue;
        if (board[i] !== board[k]) continue;
        if (board[i] === 'X') return 'X';
        if (board[i] === 'O') return 'O';
    }
    for (const c of board) {
        if (c === ' ') return '';
    }
    return 'DRAW';
}

function join(params: {
    state: TictactoeState, query: Query,
}) : {
    state: TictactoeState, reply: Action,
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
        reply: { type: 'ERROR', error: Text.JOIN_USAGE }
    }
    if (state.players && state.players[piece]) return {
        state,
        reply: { type: 'ERROR', error: 'That character is already claimed!' },
    }
    return {
        state: { ...state,
            players: { ...state.players,
                [piece]: { id: query.userId, name: query.userName }
            },
        },
        reply: { 
            type: 'MESSAGE',
            message: query.userName + ' claimed character ' + piece + '.' 
        },
    }
}

function start(params: {
    state: TictactoeState, query: Query,
}): {
    state: TictactoeState, reply: ActionMessage,
} {
    const { state, query } = params;
    const board = Array(9).fill(' ');
    return {
        state: { ...state,
            context: 'PLAYING' as const,
            board,
            turn: 'X' as const,
        },
        reply: { type: 'MESSAGE', message: display(board) },
    }
}

function move(params: {
    state: TictactoeState, query: Query,
}) : {
    state: TictactoeState, reply: Action,
} {
    const { state, query } = params;
    const position = query.args.length === 2 && parseInt(query.args[1]);
    if (state.players[state.turn].id !== query.userId) return {
        state,
        reply: { type: 'ERROR', error: 'It is not your turn!' },
    };
    if (!(position >= 1 && position <= 9)) return {
        state,
        reply: { 
            type: 'ERROR',
            error: (''
                + 'Usage: ' + query.args[0] + ' <position>\n'
                + 'positions are from 1 (top left) to 9 (bottom right).'
            ),
        },
    };
    if (state.board[position-1] !== ' ') return {
        state,
        reply: { type: 'ERROR', error: 'That position is already occupied!' },
    };
    const board = [...state.board];
    board[position-1] = state.turn;
    const turn = (state.turn === 'X' ? 'O' as const : 'X' as const);
    const winner = checkWinner(board);
    if (!winner) return {
        state: { ...state, 
            board: board,
            turn: turn,
        },
        reply: { type: 'MESSAGE', message: display(board) },
    };
    if (winner === 'DRAW') return {
        state: { ...state, 
            board: board,
            turn: turn, 
            context: 'EXIT' as const,
        },
        reply: { 
            type: 'MESSAGE', 
            message: display(board, 'The game is a draw.'),
        },
    };
    return {
        state: { ...state, 
            board: board,
            turn: turn, 
            context: 'EXIT' as const,
        },
        reply: { 
            type: 'MESSAGE',
            message: display(board, winner + ' is the winner!'),
        },
    };
}

export const tictactoeCommand = function(params: {
    state: TictactoeState, query: Query,
}): {
    state: TictactoeState, reply: Action,
} {
    const { state, query } = params;
    const keyword = query.args[0];
    if (state.context === 'INIT') {
        if (keyword === 'join') return join({ state, query });
        if (keyword === 'start') return start({ state, query });
    }
    if (state.context === 'PLAYING') {
        if (keyword === 'move') return move({ state, query });
    }
    return { state, reply: { type: 'NONE' } }
}
