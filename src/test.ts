import { command } from './command.js';
import { Intent, IntentMessage } from './types.js';


function assertEqual(actual: any, expected: any) {
    const actualStr = JSON.stringify(actual, null, 2);
    const expectStr = JSON.stringify(expected, null, 2);
    if (actualStr === expectStr) return;
    console.error('Expected:\n' + expectStr);
    console.error('Actual:\n' + actualStr);
    process.exit(1);
}

class TestBot {
    state: any;
    intent: Intent;
    constructor() {
        this.state = {};
    }
    send(room, user, text) {
        const { intent, state } = command({ room, user, text }, this.state);
        this.state = state;
        this.intent = intent;
    }
}

function test_ping() {
    console.log('test_ping()');
    const bot = new TestBot();
    bot.send('test_channel', 'test_user', 'ping');
    assertEqual(bot.intent.type, 'MESSAGE');
    const message = (bot.intent as IntentMessage);
    assertEqual(message.room, 'test_channel');
    assertEqual(message.text, 'pong!');
}

function test_tictactoe_blankBoard() {
    console.log('test_tictactoe_blankBoard()');
    const bot = new TestBot();
    bot.send('test_channel', 'alice', 'play tictactoe');
    bot.send('test_channel', 'alice', 'join x');
    bot.send('test_channel', 'bob', 'join o');
    bot.send('test_channel', 'alice', 'start');
    assertEqual(bot.intent.type, 'MESSAGE');
    const message = (bot.intent as IntentMessage);
    assertEqual(message.room, 'test_channel');
    assertEqual(message.text, ''
        + '   |   |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
    );
}

function test_tictactoe_moveOnce() {
    console.log('test_tictactoe_moveOnce()');
    const bot = new TestBot();
    bot.send('test_room', 'alice', 'play tictactoe');
    bot.send('test_room', 'alice', 'join x');
    bot.send('test_room', 'alice', 'join o');
    bot.send('test_room', 'alice', 'move 2');
    assertEqual(bot.intent.type, 'MESSAGE');
    const message = (bot.intent as IntentMessage);
    assertEqual(message.room, 'test_room');
    assertEqual(message.text, ''
        + '   | X |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
    );
}

function runTests() {
    test_ping();
    test_tictactoe_blankBoard();
    //test_tictactoe_moveOnce();
    console.log("All tests OK.");
    process.exit(0);
}

if (require.main === module) runTests();