import { init } from './mainCommand.js';
import { Effect, Report } from './types.js';

function chat(chatStr: string): Report {
    const [user, text] = chatStr.split(': !', 2);
    return {
        type: 'message',
        userId: user,
        userName: user,
        text,
    };
}

function assertRead(actual: Effect) {
    if (actual.type !== 'read') {
        console.error(`Expected read, but got ${actual.type}.`);
        process.exit(1);
    }
}

function assertWrite(actual: Effect, expected: string) {
    if (actual.type !== 'write') {
        console.error(`Expected write, but got ${actual.type}.`);
        process.exit(1);
    }
    if (actual.text !== expected) {
        console.error(`Expected:\n${expected}\nBut got:\n${actual.text}`);
        process.exit(1);
    }
}

function test_ping() {
    console.log('test_ping()');
    const bot = init();
    let t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('test_user: !ping'));
    assertWrite(t.value, 'pong!');
}

function runTests() {
    test_ping();
    console.log("All tests OK.");
    process.exit(0);
}

if (require.main === module) runTests();