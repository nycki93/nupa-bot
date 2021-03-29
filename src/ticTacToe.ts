interface ticTacToeState {
    cells: Array<' '|'X'|'O'>;
    turn?: 'X'|'O';
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

function move(
    { cells, turn }: ticTacToeState,
    position: number,
): { 
    newState?: ticTacToeState, error?: string 
} {
    if (cells[position-1] !== ' ') return { error: "Can't go there!" };
    const newCells = [...cells];
    newCells[position-1] = turn;
    const newTurn = (turn === 'X' ? 'O' : 'X');
    return {
        newState: {
            cells: newCells,
            turn: newTurn,
        }
    };
}

const command = (params: {
    userId: string,
    channelId: string,
    content: string,
    state: any,
}) => {
    const { userId, channelId, content, state } = params;
    const args = content.split(/\s+/);
    const gameKey = 'tictactoe:' + channelId;
    if (args.length === 2 && args[1] === 'start') {
        const board = Array.from({ length: 9 }).fill(' ');
        return { 
            type: 'MESSAGE',
            channelId,
            content: display(board),
            state: {
                ...state,
                [gameKey]: {
                    mode: 'STARTED',
                    turn: 'X',
                    board,
                }
            }
        };
    }
    return {
        type: 'MESSAGE',
        channelId,
        state,
        content: (''
            + 'Usage:\n'
            + 'start\n'
            + 'move <position>\n'
        ),
    };
};
export default command;
