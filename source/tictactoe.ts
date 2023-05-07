import { App } from './bot.js';

export class TictactoeGame implements App {
    board = Array<string>(9);

    init() {
        return { message: [
            'Tictactoe Started.',
            draw(this.board),
            "move with 'play <location> <x|o>'"
        ].join('\n')};
    }

    commands() {
        return [ 'play', 'resign' ];
    }

    help([a0]) {
        if (a0 === 'play') {
            return { message: 'Usage: play <location> <x|o>' };
        } else if (a0 === 'resign') {
            return { message: 'resign: ends the game in a loss.' };
        } else {
            return { error: `Unknown command ${a0} in TictactoeGame.`};
        }
    }

    handle([a0, ...args]) {
        if (a0 === 'resign' && !args.length) {
            return {
                message: 'Game over.',
                quit: true,
            }
        } else if (a0 === 'play') {
            return this.play(args) || this.help([a0]);
        } else {
            return { error: `Unknown command ${a0} in TictactoeGame.`};
        }
    }

    play([a0, a1, ...args]: string[]) {
        const location = Number(a0);
        const symbol = a1;
        if (
            args.length
            || ![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(location)
            || !['x', 'o'].includes(symbol)
        ) {
            return null;
        }
        if (this.board[location-1]) {
            return { message: 'That spot is already claimed!' };
        }
        this.board[location-1] = symbol;
        const winner = getWinner(this.board);
        if (winner) {
            return { 
                message: [
                    draw(this.board),
                    `${winner} is the winner!`,
                ].join('\n'),
                quit: true,
            }
        } else if (isFull(this.board)) {
            return { 
                message: [
                    draw(this.board),
                    'The game is a draw.',
                ].join('\n'),
                quit: true,
            }
        } else {
            return { message: draw(this.board) };
        }
    }
}

const template = [
    '```',
    ' 1 | 2 | 3 ',
    '---+---+---',
    ' 4 | 5 | 6 ',
    '---+---+---',
    ' 7 | 8 | 9 ',
    '```',
].join('\n');
function draw(board: string[]) {
    let result = template;
    board.forEach((v, i) => {
        if (!v) return;
        result = result.replace((i+1).toString(), v);
    });
    return result;
}

const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];
function getWinner(board: string[]) {
    const line = lines.find(([a, b, c]) => (
        board[a]
        && board[a] === board[b] 
        && board[a] === board[c]
    ));
    if (line) {
        return board[line[0]];
    } else {
        return null;
    }
}

function isFull(board: string[]) {
    return board.filter(a => a).length === 9;
}