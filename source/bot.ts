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
                yield { type: 'write', text: Text.PONG };
                report = yield { type: 'read' };
                continue;
            }
            if (args[0] === 'play') {
                app = guessingGame();
                report = yield { type: 'write', text: 'guessing game started.' };
                continue;
            }
            if (!app) {
                yield { type: 'write', text: 'Unknown command.' };
                report = yield { type: 'read' };
                continue;
            }
        }
        if (app) {
            appState = app.next(report);
            if (appState.done) {
                app = null;
                appState = null;
                yield { type: 'write', text: 'guessing game stopped.' }
                continue;
            }
            report = yield appState.value;
            continue;
        }
        if (report) {
            throw TypeError(`Expected message, but got ${report?.type}.`);
        }
        report = yield { type: 'read' };
    }
}

function* guessingGame(): Generator<Effect, null, Report> {
    let report = yield { type: 'roll', max: 100 };
    if (report.type !== 'roll') throw Error('Expected roll.');
    const secret = report.value;
    yield { type: 'write', text: "I'm thinking of a number between 1 and 100." };
    yield { type: 'write', text: 'Options: guess <number>' };
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