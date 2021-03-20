const tests:{ [key: string]: () => Promise<boolean> } = {};

tests.ticTacToe_blankBoard = async function() {
    return false;
}

async function main() {
    await Promise.all(Object.keys(tests).map(key => {
        return false;
    }));
}
main();