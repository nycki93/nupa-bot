import * as ticTacToe from './ticTacToe.js';

interface TestResult {
    pass: boolean;
    expected: any;
    actual: any;
}

const tests: Record<string, () => TestResult> = {};

tests.ticTacToe_blankBoard = function() {
    const board = ticTacToe.newBoard();
    const actual = ticTacToe.display(board);
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