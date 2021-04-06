import { Query, Reply } from './types';

export type TictactoeState = {
    context: 'INIT'|'PLAYING'|'EXIT'
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

function display(state: TictactoeState, banner='') {
    const { board } = state;
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

function checkWinner(state: TictactoeState) {
    const { board } = state;
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
        state: { ...state,
            players: { ...state.players,
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
    const newState = { ...state,
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
    state: TictactoeState, query: Query,
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
    const newState = { ...state, 
        board: newBoard,
        turn: newTurn,
    };
    const winner = checkWinner(newState);
    if (!winner) return {
        state: newState,
        reply: { message: display(newState) },
    };
    if (winner === 'DRAW') return {
        state: newState,
        reply: { message: display(newState, 'The game is a draw.') },
    };
    return {
        state: newState,
        reply: { message: display(newState, winner + ' is the winner!') },
    };
}

export const tictactoeCommand = function(params: {
    state: TictactoeState, query: Query,
}): {
    state: TictactoeState, reply: Reply,
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
    return { state, reply: { } }
}
