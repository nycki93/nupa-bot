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
                if (!args[1]) {
                    yield { type: 'write', text: 'Options: play <game>'};
                    report = yield { type: 'read' };
                    continue;
                }
                report = yield { type: 'load app', app: args[1] };
                if (report.type !== 'load app') {
                    throw TypeError(`Expected load app, but got ${report.type}`);
                }
                if (!report.app) {
                    yield { type: 'write', text: 'Unable to load that app.'};
                    report = yield { type: 'read' };
                    continue;
                }
                app = report.app;
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
