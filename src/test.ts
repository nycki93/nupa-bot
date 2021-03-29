import * as main from './main.js';
import ticTacToe from './tictactoe.js';

function assertEqual(actual: any, expected: any) {
    const actualStr = JSON.stringify(actual, null, 2);
    const expectStr = JSON.stringify(expected, null, 2);
    if (actualStr === expectStr) return;
    console.error('Expected:\n' + expectStr);
    console.error('Actual:\n' + actualStr);
    process.exit(1);
}

function test_ping() {
    console.log('test_ping()');
    const intent = main.command({
        channelId: 'test_channel',
        userId: 'test_user',
        content: 'ping',
        state: {},
    })
    assertEqual(intent, {
        type: 'MESSAGE',
        channelId: 'test_channel',
        content: 'pong!',
        state: {},
    });
}

function test_tictactoe_blankBoard() {
    console.log('test_tictactoe_blankBoard()');
    const intent = main.command({
        channelId: 'test_channel',
        userId: 'test_user',
        content: 'tictactoe start',
        state: {},
    });
    const board0 = (''
        + '   |   |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
    );
    assertEqual(intent, {
        type: 'MESSAGE',
        channelId: 'test_channel',
        content: board0,
        state: {
            'tictactoe:test_channel': {
                mode: 'STARTED',
                turn: 'X',
                board: [
                    ' ', ' ', ' ',
                    ' ', ' ', ' ',
                    ' ', ' ', ' ',
                ],
            }
        }
    });
}

function test_tictactoe_moveOnce() {
    const intent0 = main.command({
        userId: 'alice',
        channelId: 'test_channel',
        content: 'tictactoe start',
        state: {},
    });
    const intent1 = main.command({
        userId: 'alice',
        channelId: 'test_channel',
        content: 'tictactoe move 2',
        state: intent0.state,
    });
    const board = (''
        + '   | X |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
    );
    assertEqual(intent1, {
        type: 'MESSAGE',
        channelId: 'test_channel',
        content: board,
        state: {
            'tictactoe:test_channel': {
                mode: 'STARTED',
                turn: 'O',
                board: [
                    ' ', 'X', ' ',
                    ' ', ' ', ' ',
                    ' ', ' ', ' ',
                ],
            }
        }
    })
}

function runTests() {
    test_ping();
    test_tictactoe_blankBoard();
    //test_tictactoe_moveOnce();
    console.log("All tests OK.");
    process.exit(0);
}

if (require.main === module) runTests();