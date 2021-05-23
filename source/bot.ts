import { Effect, Report } from './types';

export const Text = {
    PONG: 'pong!',
}

export function* init(): Generator<Effect, never, Report> {
    let app: Generator<Effect, null, Report>;
    let appState: IteratorResult<Effect, null>;
    let report = yield { type: 'read' };
    while (true) {
        if (report?.type === 'message') {
            const args = report.text.trim().split(/\s+/);
            if (args[0] === 'ping') {
                report = yield { type: 'write', text: Text.PONG };
                continue;
            }
            if (args[0] === 'play') {
                app = guessingGame();
                report = yield { type: 'write', text: 'guessing game started.' };
                continue;
            }
        }
        if (!app) {
            throw TypeError(`Expected message, but got ${report?.type}.`);
        }
        appState = app.next(report);
        if (appState.done) {
            app = null;
            appState = null;
            report = yield { type: 'write', text: 'guessing game stopped.' }
            continue;
        }
        report = yield appState.value;
    }
}

function* guessingGame(): Generator<Effect, null, Report> {
    let report = yield { type: 'roll', max: 100 };
    if (report.type !== 'roll') throw Error('Expected roll.');
    const secret = report.value;
    yield { type: 'write', text: 'Guess my number!' };
    while (true) {
        const report = yield { type: 'read' };
        if (report.type !== 'message') {
            throw TypeError(`Expected message, but got ${report.type}.`);
        }
        const args = report.text.split(/\s+/);
        if (args[0] != 'guess') {
            yield { type: 'write', text: 'Options: guess <number>' };
            continue;
        }
        const guess = parseInt(args[1]);
        if (guess < secret) {
            yield { type: 'write', text: 'Too low!' };
            continue;
        }
        if (guess > secret) {
            yield { type: 'write', text: 'Too high!' };
            continue;
        }
        yield { type: 'write', text: "That's exactly right!" };
        return;
    }
}