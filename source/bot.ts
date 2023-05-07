import { TictactoeGame } from './tictactoe.js';

export interface App { 
    init(): BotResponse,
    commands(): string[],
    help(args: string[]): BotResponse,
    handle(args: string[]): BotResponse, 
}

export interface BotResponse {
    message?: string,
    error?: string,
    quit?: boolean,
}

export class Bot implements App {
    game?: App = null;

    init() {
        return { message: 'Bot loaded!' };
    }

    commands() {
        if (this.game) {
            return ['help', 'ping', ...this.game.commands()];
        } else {
            return ['help', 'ping', 'play'];
        }
    }

    help([a0, ...args]: string[]) {
        if (a0 === 'ping') {
            return { message: 'Check if the bot is running.' };
        } else if (a0 === 'help') {
            return { message: 'Usage: help <command>' };
        } else if (this.game && this.game.commands().includes(a0)) {
            return this.game.help([a0, ...args]);
        } else if (!this.game && a0 === 'play') {
            return { message: 'Start a game. Games available: guess' };
        } else {
            return { message: `Commands: ${this.commands().join(', ')}` };
        }
    }

    handle([a0, ...args]: string[]) {
        if (a0 === 'ping') {
            return { message: 'Pong!' };
        } else if (a0 === 'help') {
            return this.help(args);
        } else if (this.game && this.game.commands().includes(a0)) {
            const { quit, ...r } = this.game.handle([a0, ...args]);
            if (quit) {
                this.game = null;
            }
            return r;
        } else if (!this.game && a0 === 'play') {
            return this.play(args);
        } else {
            return null;
        }
    }

    play([a0]: string[]) {
        if (a0 === 'guess') {
            this.game = new GuessingGame();
            return this.game.init();
        } else if (a0 === 'tictactoe') {
            this.game = new TictactoeGame();
            return this.game.init();
        } else {
            return { message: 'Games available: guess' };
        }
    }
}

class GuessingGame implements App {
    solution: number;

    init() {
        this.solution = (Math.random() * 100) | 0
        return { message: "Guessing game started! Guess my number with 'guess'." };
    }

    commands() {
        return [ 'guess', 'give-up' ];
    }

    help([a0]: string[]) {
        if (a0 === 'guess') {
            return { message: 'Usage: guess <number>' };
        } else if (a0 === 'give-up') {
            return { message: 'Reveal the number and end the game.' };
        } else {
            return { error: `No command ${a0} in GuessingGame` };
        }
    }

    handle([a0, ...args]: string[]) {
        if (a0 === 'give-up') {
            return { 
                message: `Game over! The answer was ${this.solution}.`,
                quit: true,
            }
        } else if (a0 === 'guess') {
            return this.guess(args) || this.help(['guess']);
        }
    }

    guess([a0, ...args]: string[]) {
        if (args.length) return null;
        const n = Number(a0);
        if ( Number.isNaN(n) ) return null;

        if (n < this.solution) {
            return { message: 'Too low!' };
        } else if (n > this.solution) {
            return { message: 'Too high!' };
        } else {
            return { 
                message: `That's right! It was ${this.solution}.`,
                quit: true,
            }
        }
    }
}