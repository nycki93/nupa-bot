import { Command } from "./types";

enum Piece {
    NONE = ' ',
    X = 'X',
    O = 'O',
};

type TictactoeState = {
    board: Array<Piece>,
    turn: Piece,
    players: { [key in Piece]: string },
}

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

export const join: Command = function(query) {
    const state = query.state as TictactoeState;
    const args = query.text.split(/\s+/);
    const choice = (args[1] || '').toUpperCase();
    const piece = (
        choice === 'X' ? Piece.X
        : choice === 'O' ? Piece.O
        : Piece.NONE
    );
    if (args.length !== 2 || piece === Piece.NONE) return {
        type: 'ERROR',
        room: query.room,
        text: 'Options: X, O.',
        state,
    }
    if (state.players && state.players[piece]) return {
        type: 'ERROR',
        room: query.room,
        text: 'That character is already claimed!',
        state,
    }
    return {
        type: 'NONE',
        state: {
            ...state,
            players: {
                ...state.players,
                [piece]: query.user,
            }
        }
    }
}

export const start: Command = function(query) {
    const state = query.state as TictactoeState;
    const newState = { 
        ...state,
        board: Array(9).fill(Piece.NONE),
        turn: Piece.X,
    };
    return {
        type: 'MESSAGE',
        room: query.room,
        text: display(newState),
        state: newState,
    }
}

export const move: Command = function(query) {
    const state = query.state as TictactoeState;
    const args = query.text.split(/\s+/);
    const position = args.length === 2 && parseInt(args[1]);
    if (state.players[state.turn] !== query.user) return {
        type: 'ERROR',
        room: query.room,
        text: 'It is not your turn!',
        state,
    }
    if (!(position >= 1 && position <= 9)) return {
        type: 'ERROR',
        room: query.room,
        text: 'Usage: ' + args[0] + ' <position>\n'
            + 'positions are from 1 (top left) to 9 (bottom right).',
        state,
    } 
    if (state.board[position-1] !== ' ') return {
        type: 'ERROR',
        room: query.room,
        text: 'That position is already occupied!',
        state,
    }
    const newBoard = [...state.board];
    newBoard[position-1] = state.turn;
    const newTurn = (state.turn === Piece.X ? Piece.O : Piece.X);
    const newState = { 
        ...state, 
        board: newBoard,
        turn: newTurn,
    }
    return {
        type: 'MESSAGE',
        room: query.room,
        text: display(newState),
        state: newState,
    }
}
