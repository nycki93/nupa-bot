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
    const intent: any = main.command({
        channelId: 'test_channel',
        userId: 'test_user',
        content: 'ping',
    })
    assertEqual(intent.type, 'MESSAGE');
    assertEqual(intent.channelId, 'test_channel');
    assertEqual(intent.content, 'pong!');
}

function test_tictactoe_blankBoard() {
    console.log('test_tictactoe_blankBoard()');
    const intent = main.command({
        channelId: 'test_channel',
        userId: 'test_user',
        content: 'tictactoe start',
    });
    assertEqual(intent.type, 'MESSAGE');
    assertEqual(intent.channelId, 'test_channel');
    assertEqual(intent.content, ''
        + '   |   |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
    );
}

function test_tictactoe_moveOnce() {
    const intent0 = main.command({
        userId: 'alice',
        channelId: 'test_channel',
        content: 'tictactoe start',
    });
    const intent1 = main.command({
        userId: 'alice',
        channelId: 'test_channel',
        content: 'tictactoe move 2',
        state: intent0.state,
    });
    assertEqual(intent1.type, 'MESSAGE');
    assertEqual(intent1.channelId, 'test_channel');
    assertEqual(intent1.content, ''
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