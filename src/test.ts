import ticTacToe from './tictactoe.js';

interface TestResult {
    pass: boolean;
    expected: any;
    actual: any;
}

const tests: Record<string, () => TestResult> = {};

tests.ticTacToe_blankBoard = function() {
    const { replies } = ticTacToe({}, {
        channelId: 'aaa',
        userId: 'bbb',
        content: 'ccc start',
    });
    if (replies.length != 1) return {
        pass: false,
        actual: replies.length + ' replies',
        expected: '1 reply',
    }
    const actual = replies[0].content;
    const expected = (''
        + '   |   |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
    );
    return {
        pass: actual === expected,
        actual,
        expected,
    }
}

tests.ticTacToe_move = function() {
    const { state: state1 } = ticTacToe({}, {
        userId: 'aaa',
        channelId: 'bbb',
        content: 'ccc start',
    });
    const { replies } = ticTacToe(state1, {
        userId: 'ddd',
        channelId: 'bbb',
        content: 'ccc move 2',
    });
    const actual = replies[0].content;
    const expected = (''
        + '   | X |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
        + '---+---+---\n'
        + '   |   |   \n'
    );
    return {
        pass: actual === expected,
        actual,
        expected,
    }
}

function main() {
    const keys = Object.keys(tests);
    keys.forEach(key => {
        const result = tests[key]();
        if (result.pass) return;
        console.log(''
            + 'Failed test ' + key + '.\n'
            + 'Expected:\n' + result.expected + '\n'
            + 'But got:\n' + result.actual + '\n'
        );
        process.exit(1);
    })
    console.log(keys.length + ' tests OK. \n');
    process.exit(0);
}
main();