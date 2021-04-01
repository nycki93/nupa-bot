import { Message } from "./types";

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

export function join(message: Message, state: TictactoeState) {
    const args = message.text.split(/\s+/);
    const choice = (args[1] || '').toUpperCase();
    const piece = (
        choice === 'X' ? Piece.X
        : choice === 'O' ? Piece.O
        : Piece.NONE
    );
    return {
        intent: { type: 'NONE' },
        state: {
            ...state,
            players: {
                ...state.players,
                [piece]: message.user,
            }
        }
    }
}

export function start(message: Message, state: TictactoeState) {
    const newState = { 
        ...state,
        board: Array(9).fill(Piece.NONE),
        turn: Piece.X,
    };
    return {
        intent: {
            type: 'MESSAGE' as const,
            room: message.room,
            text: display(newState),
        },
        state: newState,
    }
}

export function move(message: Message, state: TictactoeState) {
    const args = message.text.split(/\s+/);
    const position = args.length === 2 && parseInt(args[1]);
    if (state.players[state.turn] !== message.user) return {
        intent: {
            type: 'MESSAGE' as const,
            room: message.room,
            text: 'It is not your turn!',
        },
        state,
    }
    if (!(position >= 1 && position <= 9)) return {
        intent: {
            type: 'MESSAGE' as const,
            room: message.room,
            text: 'Usage: ' + args[0] + ' <position>\n'
                + 'positions are from 1 (top left) to 9 (bottom right).',
        },
        state,
    } 
    if (state.board[position-1] !== ' ') return {
        intent: {
            type: 'MESSAGE' as const,
            room: message.room,
            text: 'That position is already occupied!',
        },
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
        intent: {
            type: 'MESSAGE' as const,
            room: message.room,
            text: display(newState),
        },
        state: newState,
    }
}
