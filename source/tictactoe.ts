import { Message } from "./types";

type TictactoeState = {
    board: Array<' '|'X'|'O'>,
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

export function start(message: Message, state: TictactoeState) {
    const newState = { ...state };
    newState.board = Array(9).fill(' ');
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
    newBoard[position-1] = 'X';
    const newState = { ...state, board: newBoard }
    return {
        intent: {
            type: 'MESSAGE' as const,
            room: message.room,
            text: display(newState),
        },
        state: newState,
    }
}
