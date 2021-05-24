import { init } from './bot.js';
import { Effect, Report } from './types.js';
import guess from './apps/guess.js';

function chat(chatStr: string): Report {
    const [user, text] = chatStr.split(': !', 2);
    return {
        type: 'message',
        userId: user,
        userName: user,
        text,
    };
}

function riggedRoll(n: number): Report {
    return { type: 'roll', value: n };
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

function assertRoll(actual: Effect, expectedMax: number) {
    if (actual.type !== 'roll') {
        console.error(`Expected roll, but got ${actual.type}.`);
        process.exit(1);
    }
    if (actual.max !== expectedMax) {
        console.error(
            `Expected roll(${expectedMax}) but got roll(${actual.max}).`
        );
        process.exit(1);
    }
}

function assertLoadApp(actual: Effect, expected: string) {
    if (actual.type !== 'load app') {
        console.error(`Expected load app, but got ${actual.type}.`);
        process.exit(1);
    }
    if (actual.app !== expected) {
        console.error(`Expected to load ${expected}, but loaded ${actual.app}.`);
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

function test_ping_twice() {
    console.log('test_ping_twice()');
    const bot = init();
    let t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('user2: !ping'));
    assertWrite(t.value, 'pong!');
    t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('user2: !ping'));
    assertWrite(t.value, 'pong!');
    t = bot.next();
    assertRead(t.value);
}

function test_guessing_start() {
    console.log('test_guessing_start()');
    const bot = init();
    let t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('alice: !play guess'));
    assertLoadApp(t.value, 'guess');
    t = bot.next({ type: 'load app', app: guess() });
    assertWrite(t.value, 'guessing game started.');
    t = bot.next();
    assertRoll(t.value, 100);
    t = bot.next(riggedRoll(7));
    assertWrite(t.value, "I'm thinking of a number between 1 and 100.");
    t = bot.next();
    assertWrite(t.value, 'Options: guess <number>');
    t = bot.next();
}

function test_guessing_ping() {
    console.log('test_guessing_ping()');
    const bot = init();
    let t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('alice: !play guess'));
    assertLoadApp(t.value, 'guess');
    t = bot.next({ type: 'load app', app: guess() });
    assertWrite(t.value, 'guessing game started.');
    t = bot.next();
    assertRoll(t.value, 100);
    t = bot.next(riggedRoll(7));
    assertWrite(t.value, "I'm thinking of a number between 1 and 100.");
    t = bot.next();
    assertWrite(t.value, 'Options: guess <number>');
    t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('alice: !ping'));
    assertWrite(t.value, 'pong!');
    t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('alice: !guess 50'));
    assertWrite(t.value, 'Too high!');
    t = bot.next();
    assertRead(t.value);
}

function test_guessing_win() {
    console.log('test_guessing_win()');
    const bot = init();
    let t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('alice: !play guess'));
    assertLoadApp(t.value, 'guess');
    t = bot.next({ type: 'load app', app: guess() });
    assertWrite(t.value, 'guessing game started.');
    t = bot.next();
    assertRoll(t.value, 100);
    t = bot.next(riggedRoll(77));
    assertWrite(t.value, "I'm thinking of a number between 1 and 100.");
    t = bot.next();
    assertWrite(t.value, 'Options: guess <number>');
    t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('alice: !guess 50'));
    assertWrite(t.value, 'Too low!');
    t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('alice: !guess 100'));
    assertWrite(t.value, 'Too high!');
    t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('alice: !guess 77'));
    assertWrite(t.value, "That's exactly right!");
    t = bot.next();
    assertWrite(t.value, 'guessing game stopped.');
}

function test_guessing_usage() {
    console.log('test_guessing_usage()');
    const bot = init();
    let t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('alice: !play guess'));
    assertLoadApp(t.value, 'guess');
    t = bot.next({ type: 'load app', app: guess() });
    assertWrite(t.value, 'guessing game started.');
    t = bot.next();
    assertRoll(t.value, 100);
    t = bot.next(riggedRoll(77));
    assertWrite(t.value, "I'm thinking of a number between 1 and 100.");
    t = bot.next();
    assertWrite(t.value, 'Options: guess <number>');
    t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('alice: !50'));
    assertWrite(t.value, 'Options: guess <number>');
}

function test_nonexistent_app() {
    console.log('test_nonexistent_app()');
    const bot = init();
    let t = bot.next();
    assertRead(t.value);
    t = bot.next(chat('alice: !play polybius'));
    assertLoadApp(t.value, 'polybius');
    t = bot.next({ type: 'load app', app: null });
    assertWrite(t.value, 'Unable to load that app.');
    t = bot.next();
    assertRead(t.value);
}

function runTests() {
    test_ping();
    test_ping_twice();
    test_guessing_start();
    test_guessing_ping();
    test_guessing_win();
    test_guessing_usage();
    test_nonexistent_app();
    console.log("All tests OK.");
    process.exit(0);
}

if (require.main === module) runTests();
