import * as readline from 'readline'

function parrotBot(event) {
    if (event.type === 'message') {
        return [{
            type: 'say',
            text: `Squawk! ${event.text}!`,
        }]
    } else {
        return [{
            type: 'err',
            text: `Unknown event ${event}.`,
        }]
    }
}

function runConsole(bot) {
    while (true) {
        const rl = readline.createInterface(process.stdin, process.stdout);

        // Collect line events in a bucket in case they arrive faster
        // than they are answered.
        const sendQueue = []
        let sendNext: Function = null
        rl.on('line', line => {
            const event = {
                type: 'message',
                text: line,
            }
            if (sendNext) {
                sendNext(event)
                sendNext = null
            } else {
                sendQueue.push(event)
            }
        })


    }
}