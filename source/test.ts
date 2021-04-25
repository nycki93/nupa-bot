import { mainCommand, MainState } from './mainCommand.js';
import { Action, ActionMessage } from './types.js';

function assertEqual(actual: any, expected: any) {
    if (actual === expected) return;
    console.error('Expected:\n' + expected);
    console.error('Actual:\n' + actual);
    process.exit(1);
}

function assertMessage(action: Action, expected: string) {
    if (action.type === 'MESSAGE') {
        if (action.message === expected) return;
        console.error('Expected Message: \n' + expected);
        console.error('Actual Message:\n' + action.message);
        process.exit(1);
    } else if (action.type === 'ERROR') {
        console.error('Unexpected error:');
        console.error(action.error);
        process.exit(1);
    } else {
        console.error('Expected Message, but got: ' + action.type);
        process.exit(1);
    }
}

function assertError(action: Action, expected: string) {
    if (action.type === 'ERROR') {
        if (action.error === expected) return;
        console.error('Expected Error:\n' + expected);
        console.error('Actual Error:\n' + action.error);
        process.exit(1);
    } else if (action.type === 'MESSAGE') {
        console.error('Expected Error:\n' + expected);
        console.error('But instead, received message:\n' + action.message);
        process.exit(1);
    } else {
        console.error('Expected Error, but got ' + action.type);
        process.exit(1);
    }
}

class TestBot {
    state: MainState;
    reply: Action;
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
    assertMessage(bot.reply, 'pong!');
}

function test_tictactoe_blankBoard() {
    console.log('test_tictactoe_blankBoard()');
    const bot = new TestBot();
    bot.send('play tictactoe', 'alice');
    bot.send('join x', 'alice');
    bot.send('join o', 'bob');
    bot.send('start', 'alice');
    assertMessage(bot.reply, ''
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
    assertMessage(bot.reply, ''
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
    assertMessage(bot.reply, ''
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
    assertMessage(bot.reply, ''
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
    assertMessage(bot.reply, 'tictactoe started.');
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
    assertMessage(bot.reply, 'Are you sure you want to quit? [y/n]');
    bot.send('y', 'alice');
    assertMessage(bot.reply, 'tictactoe stopped.');
    bot.send('play tictactoe', 'alice');
    assertMessage(bot.reply, 'tictactoe started.');
}

/* Error Paths */
    
function test_unloaded_command() {
    console.log('test_unloaded_command()');
    const bot = new TestBot();
    bot.send('join x', 'alice');
    assertError(bot.reply, 'Unrecognized command "join".');
}

function test_tictactoe_wrongPlayer() {
    console.log('test_tictactoe_wrongPlayer()');
    const bot = new TestBot();
    bot.send('play tictactoe', 'alice');
    bot.send('join x', 'alice');
    bot.send('join o', 'bob');
    bot.send('start', 'bob');
    bot.send('move 5', 'bob');
    assertError(bot.reply, 'It is not your turn!');
}

function test_tictactoe_errorWhenJoiningOccupiedSeat() {
    console.log('test_tictactoe_errorWhenJoiningOccupiedSeat()');
    const bot = new TestBot();
    bot.send('play tictactoe', 'alice');
    bot.send('join x', 'alice');
    bot.send('join x', 'bob');
    assertError(bot.reply, 'That character is already claimed!');
}

function test_tictactoe_errorWhenCharacterDoesNotExist() {
    console.log('test_tictactoe_errorWhenCharacterDoesNotExist()');
    const bot = new TestBot();
    bot.send('play tictactoe', 'alice');
    bot.send('join q', 'bob');
    assertError(bot.reply, 'Options: X, O.');
}

function runTests() {
    /* Happy Paths */
    test_ping();
    test_tictactoe_blankBoard();
    test_tictactoe_moveOnce();
    test_tictactoe_moveTwice();
    test_tictactoe_winX();
    test_tictactoe_newGameAfterDraw();
    test_tictactoe_quit();

    /* Error Paths */
    test_unloaded_command();
    test_tictactoe_wrongPlayer();
    test_tictactoe_errorWhenJoiningOccupiedSeat();
    test_tictactoe_errorWhenCharacterDoesNotExist();

    console.log("All tests OK.");
    process.exit(0);
}

if (require.main === module) runTests();