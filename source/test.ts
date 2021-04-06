import { mainCommand, MainState } from './mainCommand.js';
import { Reply } from './types.js';

function assertEqual(actual: any, expected: any) {
    if (actual === expected) return;
    console.error('Expected:\n' + expected);
    console.error('Actual:\n' + actual);
    process.exit(1);
}
class TestBot {
    state: MainState;
    reply: Reply;
    constructor() {
        this.state = {};
    }
    send(_room: string, user: string, text: string) {
        const { state, reply } = mainCommand({ 
            state: this.state,
            query: { user, text },
        });
        this.state = state || this.state,
        this.reply = reply;
    }
}

function test_ping() {
    console.log('test_ping()');
    const bot = new TestBot();
    bot.send('test_channel', 'test_user', 'ping');
    assertEqual(bot.reply.error, undefined);
    assertEqual(bot.reply.message, 'pong!');
}

function test_tictactoe_blankBoard() {
    console.log('test_tictactoe_blankBoard()');
    const bot = new TestBot();
    bot.send('test_channel', 'alice', 'play tictactoe');
    bot.send('test_channel', 'alice', 'join x');
    bot.send('test_channel', 'bob', 'join o');
    bot.send('test_channel', 'alice', 'start');
    assertEqual(bot.reply.error, undefined);
    assertEqual(bot.reply.message, ''
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
    assertEqual(bot.reply.error, undefined);
    assertEqual(bot.reply.message, ''
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
    assertEqual(bot.reply.error, undefined);
    assertEqual(bot.reply.message, ''
        + ' O |   |   \n'
        + '---+---+---\n'
        + '   | X |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
    );
}

function test_tictactoe_winX() {
    console.log('test_tictactoe_winX()');
    const bot = new TestBot();
    bot.send('test_room', 'alice', 'play tictactoe');
    bot.send('test_room', 'alice', 'join x');
    bot.send('test_room', 'bob', 'join o');
    bot.send('test_room', 'alice', 'start');
    bot.send('test_room', 'alice', 'move 3');
    bot.send('test_room', 'bob', 'move 5');
    bot.send('test_room', 'alice', 'move 2');
    bot.send('test_room', 'bob', 'move 9');
    bot.send('test_room', 'alice', 'move 1');
    assertEqual(bot.reply.error, undefined);
    assertEqual(bot.reply.message, ''
        + ' X | X | X \n'
        + '---+---+---\n'
        + '   | O |   \n'
        + '---+---+---\n'
        + '   |   | O \n'
        + '===========\n'
        + '  X Wins!  \n'
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
    assertEqual(bot.reply.message, undefined);
    assertEqual(bot.reply.error, 'It is not your turn!');
}

function test_tictactoe_errorWhenJoiningOccupiedSeat() {
    console.log('test_tictactoe_errorWhenJoiningOccupiedSeat()');
    const bot = new TestBot();
    bot.send('test_room', 'alice', 'play tictactoe');
    bot.send('test_room', 'alice', 'join x');
    bot.send('test_room', 'bob', 'join x');
    assertEqual(bot.reply.message, undefined);
    assertEqual(bot.reply.error, 'That character is already claimed!');
}

function test_tictactoe_errorWhenCharacterDoesNotExist() {
    console.log('test_tictactoe_errorWhenCharacterDoesNotExist()');
    const bot = new TestBot();
    bot.send('test_room', 'alice', 'play tictactoe');
    bot.send('test_room', 'bob', 'join q');
    assertEqual(bot.reply.message, undefined);
    assertEqual(bot.reply.error, 'Options: X, O.');
}

function test_unloaded_command() {
    console.log('test_unloaded_command()');
    const bot = new TestBot();
    bot.send('test_room', 'alice', 'join x');
    assertEqual(bot.reply.message, undefined);
    assertEqual(bot.reply.error, 'Unrecognized command "join".');
}

function runTests() {
    /* Happy paths */
    test_ping();
    test_tictactoe_blankBoard();
    test_tictactoe_moveOnce();
    test_tictactoe_moveTwice();
    // test_tictactoe_winX();

    /* Error paths */
    test_tictactoe_wrongPlayer();
    test_tictactoe_errorWhenJoiningOccupiedSeat();
    test_tictactoe_errorWhenCharacterDoesNotExist();
    test_unloaded_command();

    console.log("All tests OK.");
    process.exit(0);
}

if (require.main === module) runTests();