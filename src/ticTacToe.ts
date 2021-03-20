export function newBoard() {
    return ({
        cells: Array.from({ length: 9 }).fill(' '),
        turn: 'X',
    });
}

export function display({ cells }) {
    return (
        '```'
        + ' ' + cells[0] + ' | ' + cells[1] + ' | ' + cells[2] + ' \n'
        + '---+---+---\n'
        + ' ' + cells[3] + ' | ' + cells[4] + ' | ' + cells[5] + ' \n'
        + '---+---+---\n'
        + ' ' + cells[6] + ' | ' + cells[7] + ' | ' + cells[8] + ' \n'
        + '```'
    );
}

export function move({ cells, turn }, square: number) {
    if (cells[square-1] !== ' ') return { err: "Can't go there!" };
    const newCells = [...cells];
    newCells[square-1] = turn;
    const newTurn = (turn === 'X' ? 'O' : 'X');
    return {
        board: {
            cells: newCells,
            turn: newTurn,
        }
    };
}