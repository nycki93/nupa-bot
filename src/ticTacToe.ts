import { Message } from "./types";

type TictactoeState = {
    board: Array<' '|'X'|'O'>,
}

export function start(message: Message, state: any) {
    const tictactoeState = state.tictactoe as TictactoeState;
    const board = Array.from({ length: 9 }).fill(' ');
    return {
        intent: {
            type: 'MESSAGE' as const,
            room: message.room,
            text: display(board),
        },
        state: {
            ...state,
            tictactoe: {
                ...tictactoeState,
                board,
            }
        }
    }
}

function display(board) {
    return (''
        + ' ' + board[0] + ' | ' + board[1] + ' | ' + board[2] + ' \n'
        + '---+---+---\n'
        + ' ' + board[3] + ' | ' + board[4] + ' | ' + board[5] + ' \n'
        + '---+---+---\n'
        + ' ' + board[6] + ' | ' + board[7] + ' | ' + board[8] + ' \n'
    );
}
