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
    send(text: string, user: string = 'test_user') {
        const { state, reply } = mainCommand({ 
            state: this.state,
            query: { text, userId: user, userName: user },
        });
        this.state = state || this.state,
        this.reply = reply;
    }
}

/* Happy Paths */

function test_ping() {
    console.log('test_ping()');
    const bot = new TestBot();
    bot.send('ping', 'test_user');
    assertEqual(bot.reply.error, undefined);
    assertEqual(bot.reply.message, 'pong!');
}

function test_tictactoe_blankBoard() {
    console.log('test_tictactoe_blankBoard()');
    const bot = new TestBot();
    bot.send('play tictactoe', 'alice');
    bot.send('join x', 'alice');
    bot.send('join o', 'bob');
    bot.send('start', 'alice');
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
    bot.send('play tictactoe', 'alice');
    bot.send('join x', 'alice');
    bot.send('join o', 'alice');
    bot.send('start', 'alice');
    bot.send('move 2', 'alice');
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
    bot.send('play tictactoe', 'alice');
    bot.send('join x', 'bob');
    bot.send('join o', 'alice');
    bot.send('start', 'bob');
    bot.send('move 5', 'bob');
    bot.send('move 1', 'alice');
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
    bot.send('play tictactoe', 'alice');
    bot.send('join x', 'alice');
    bot.send('join o', 'bob');
    bot.send('start', 'alice');
    bot.send('move 3', 'alice');
    bot.send('move 5', 'bob');
    bot.send('move 2', 'alice');
    bot.send('move 9', 'bob');
    bot.send('move 1', 'alice');
    assertEqual(bot.reply.error, undefined);
    assertEqual(bot.reply.message, ''
        + ' X | X | X \n'
        + '---+---+---\n'
        + '   | O |   \n'
        + '---+---+---\n'
        + '   |   | O \n'
        + '===========\n'
        + 'X is the winner!\n'
    );
}

function test_tictactoe_newGameAfterDraw() {
    console.log('test_tictactoe_newGameAfterDraw()');
    const bot = new TestBot();
    bot.send('play tictactoe', 'alice');
    bot.send('join x', 'alice');
    bot.send('join o', 'bob');
    bot.send('start', 'alice');
    bot.send('move 1', 'alice');
    bot.send('move 2', 'bob');
    bot.send('move 3', 'alice');
    bot.send('move 4', 'bob');
    bot.send('move 5', 'alice');
    bot.send('move 6', 'bob');
    bot.send('move 7', 'alice');
    bot.send('move 8', 'bob');
    bot.send('move 9', 'alice');
    bot.send('play tictactoe', 'alice');
    assertEqual(bot.reply.error, undefined);
    assertEqual(bot.reply.message, 'tictactoe started.');
}

function test_tictactoe_quit() {
    console.log('test_tictactoe_quit()');
    const bot = new TestBot();
    bot.send('play tictactoe', 'alice');
    bot.send('join x', 'alice');
    bot.send('join o', 'bob');
    bot.send('start', 'alice');
    bot.send('move 1', 'alice');
    bot.send('quit', 'alice');
    assertEqual(bot.reply.error, undefined);
    assertEqual(bot.reply.message, 'Are you sure you want to quit? [y/n]');
    bot.send('y', 'alice');
    assertEqual(bot.reply.error, undefined);
    assertEqual(bot.reply.message, 'tictactoe stopped.');
    bot.send('play tictactoe', 'alice');
    assertEqual(bot.reply.error, undefined);
    assertEqual(bot.reply.message, 'tictactoe started.');
}

/* Error Paths */
    
function test_unloaded_command() {
    console.log('test_unloaded_command()');
    const bot = new TestBot();
    bot.send('join x', 'alice');
    assertEqual(bot.reply.message, undefined);
    assertEqual(bot.reply.error, 'Unrecognized command "join".');
}

function test_tictactoe_wrongPlayer() {
    console.log('test_tictactoe_wrongPlayer()');
    const bot = new TestBot();
    bot.send('play tictactoe', 'alice');
    bot.send('join x', 'alice');
    bot.send('join o', 'bob');
    bot.send('start', 'bob');
    bot.send('move 5', 'bob');
    assertEqual(bot.reply.message, undefined);
    assertEqual(bot.reply.error, 'It is not your turn!');
}

function test_tictactoe_errorWhenJoiningOccupiedSeat() {
    console.log('test_tictactoe_errorWhenJoiningOccupiedSeat()');
    const bot = new TestBot();
    bot.send('play tictactoe', 'alice');
    bot.send('join x', 'alice');
    bot.send('join x', 'bob');
    assertEqual(bot.reply.message, undefined);
    assertEqual(bot.reply.error, 'That character is already claimed!');
}

function test_tictactoe_errorWhenCharacterDoesNotExist() {
    console.log('test_tictactoe_errorWhenCharacterDoesNotExist()');
    const bot = new TestBot();
    bot.send('play tictactoe', 'alice');
    bot.send('join q', 'bob');
    assertEqual(bot.reply.message, undefined);
    assertEqual(bot.reply.error, 'Options: X, O.');
}

function runTests() {
    /* Happy Paths */
    test_ping();
    test_tictactoe_blankBoard();
    test_tictactoe_moveOnce();
    test_tictactoe_moveTwice();
    test_tictactoe_winX();
    test_tictactoe_newGameAfterDraw();
    //test_tictactoe_quit();

    /* Error Paths */
    test_unloaded_command();
    test_tictactoe_wrongPlayer();
    test_tictactoe_errorWhenJoiningOccupiedSeat();
    test_tictactoe_errorWhenCharacterDoesNotExist();

    console.log("All tests OK.");
    process.exit(0);
}

if (require.main === module) runTests();