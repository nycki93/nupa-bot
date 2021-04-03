import mainCommand from './mainCommand.js';
import { Reply, ReplyError, ReplyMessage } from './types.js';


function assertEqual(actual: any, expected: any) {
    if (actual === expected) return;
    console.error('Expected:\n' + expected);
    console.error('Actual:\n' + actual);
    process.exit(1);
}

function assertMessage(reply: Reply): asserts reply is ReplyMessage {
    if (reply.type === 'MESSAGE') return;
    console.error('Expected: MESSAGE');
    console.error('Actual: ' + reply.type);
    process.exit(1);
}

function assertError(reply: Reply): asserts reply is ReplyError {
    if (reply.type === 'ERROR') return;
    console.error('Expected: ERROR');
    console.error('Actual: ' + reply.type);
    process.exit(1);
}

class TestBot {
    state: any;
    reply: Reply;
    constructor() {
        this.state = {};
    }
    send(room, user, text) {
        const reply = mainCommand({ room, user, text, state: this.state });
        this.state = reply.state || this.state,
        this.reply = reply;
    }
}

function test_ping() {
    console.log('test_ping()');
    const bot = new TestBot();
    bot.send('test_channel', 'test_user', 'ping');
    assertMessage(bot.reply);
    assertEqual(bot.reply.room, 'test_channel');
    assertEqual(bot.reply.text, 'pong!');
}

function test_tictactoe_blankBoard() {
    console.log('test_tictactoe_blankBoard()');
    const bot = new TestBot();
    bot.send('test_channel', 'alice', 'play tictactoe');
    bot.send('test_channel', 'alice', 'join x');
    bot.send('test_channel', 'bob', 'join o');
    bot.send('test_channel', 'alice', 'start');
    assertMessage(bot.reply);
    assertEqual(bot.reply.room, 'test_channel');
    assertEqual(bot.reply.text, ''
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
    bot.send('test_room', 'alice', 'start');
    bot.send('test_room', 'alice', 'move 2');
    assertMessage(bot.reply);
    assertEqual(bot.reply.room, 'test_room');
    assertEqual(bot.reply.text, ''
        + '   | X |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
    );
}

function test_tictactoe_moveTwice() {
    console.log('test_tictactoe_moveTwice()');
    const bot = new TestBot();
    bot.send('test_room', 'alice', 'play tictactoe');
    bot.send('test_room', 'bob', 'join x');
    bot.send('test_room', 'alice', 'join o');
    bot.send('test_room', 'bob', 'start');
    bot.send('test_room', 'bob', 'move 5');
    bot.send('test_room', 'alice', 'move 1');
    assertMessage(bot.reply);
    assertEqual(bot.reply.room, 'test_room');
    assertEqual(bot.reply.text, ''
        + ' O |   |   \n'
        + '---+---+---\n'
        + '   | X |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
    );
}

function test_tictactoe_wrongPlayer() {
    console.log('test_tictactoe_wrongPlayer()');
    const bot = new TestBot();
    bot.send('test_room', 'alice', 'play tictactoe');
    bot.send('test_room', 'alice', 'join x');
    bot.send('test_room', 'bob', 'join o');
    bot.send('test_room', 'bob', 'start');
    bot.send('test_room', 'bob', 'move 5');
    assertError(bot.reply);
    assertEqual(bot.reply.room, 'test_room');
    assertEqual(bot.reply.text, 'It is not your turn!');
}

function runTests() {
    test_ping();
    test_tictactoe_blankBoard();
    test_tictactoe_moveOnce();
    test_tictactoe_moveTwice();
    test_tictactoe_wrongPlayer();
    console.log("All tests OK.");
    process.exit(0);
}

if (require.main === module) runTests();