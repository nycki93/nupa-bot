import { Effect, Report } from "../types";

export default function* (): Generator<Effect, null, Report> {
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