import { Effect, Report } from './types';

export const Text = {
    PONG: 'pong!',
}

export function* init(): Generator<Effect, never, Report> {
    while (true) {
        const report = yield { type: 'read' };
        if (report.type !== 'message') throw Error('Expected message.');
        if (report.text === 'ping') {
            yield { type: 'write', text: Text.PONG };
            continue;
        }
    }
}
