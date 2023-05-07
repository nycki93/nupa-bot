import { App } from './bot.js';

export class TictactoeGame implements App {
    board = Array<string>(9);

    init() {
        return { message: [
            'Tictactoe Started.',
            '```',
            draw(this.board),
            '```',
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

    handle([a0, a1, a2, ...args]) {
        if (a0 === 'resign' && !a1) {
            return {
                message: 'Game over.',
                quit: true,
            }
        } else if (a0 === 'play') {
            const location = Number(a1);
            const symbol = a2;
            if (
                args.length
                || ![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(location)
                || !['x', 'o'].includes(symbol)
            ) {
                return this.help(['play']);
            }
            this.board[location-1] = symbol;
            return {
                message: [
                    '```',
                    draw(this.board),
                    '```',
                ].join('\n'),
            }
        } else {
            return { error: `Unknown command ${a0} in TictactoeGame.`};
        }
    }
}

const template = [
    ' 1 | 2 | 3 ',
    '---+---+---',
    ' 4 | 5 | 6 ',
    '---+---+---',
    ' 7 | 8 | 9 ',
].join('\n');
function draw(board: string[]) {
    let result = template;
    board.forEach((v, i) => {
        if (!v) return;
        result = result.replace((i+1).toString(), v);
    });
    return result;
}