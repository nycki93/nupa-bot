import ticTacToe from './ticTacToe.js';

interface TestResult {
    pass: boolean;
    expected: any;
    actual: any;
}

const tests: Record<string, () => TestResult> = {};

tests.ticTacToe_blankBoard = function() {
    const { replies } = ticTacToe({ 
        state: {},
        channel: 'aaa', 
        user: 'bbb', 
        args: ['ccc', 'start'],
    });
    const first = replies[Symbol.iterator]().next();
    if (first.done) return {
        pass: false,
        actual: '0 replies',
        expected: '1 reply',
    }
    const actual = first.value.message;
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
    const { newState: state1 } = ticTacToe({
        state: {},
        channel: 'aaa',
        user: 'bbb',
        args: ['ccc', 'start'],
    })
    const { replies } = ticTacToe({
        state: state1,
        channel: 'aaa',
        user: 'bbb',
        args: ['ccc', 'move', '2'],
    })
    const actual = replies[Symbol.iterator]().next().value.message;
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