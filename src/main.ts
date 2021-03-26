import * as fs from 'fs';
import { ConsoleClient, DiscordClient } from './client.js';
import tictactoe from './tictactoe.js';
import { Command, Message } from './types.js';

const defaultConfig = {
    version: '1',
    discord: {
        token: '',
        prefix: '!',
    }
}

const configJson = fs.readFileSync('config.json').toString() || '{}';
const config = { 
    ...defaultConfig, 
    ...JSON.parse(configJson),
}
fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
//fs.closeSync(configFile);

if (!config.discord.token) {
    console.log("Please provide a bot token in config.json.");
    process.exit(0);
}
//const client = DiscordClient(config.discord);
const client = ConsoleClient({
    input: process.stdin,
    output: process.stdout,
});

const commands: {[key: string]: Command} = {
    ping: (state: any, message: Message) => ({
        state,
        replies: [{
            userId: message.userId,
            channelId: message.channelId,
            content: 'pong!',
        }],
    }),
    tictactoe,
}

const stateCache = {};
client.on('message', message => {
    const m = message.content.match(/^\w+/);
    if (!m || !m[0]) return;
    const keyword = m[0];
    if (!(keyword in commands)) return;

    const command = commands[keyword];
    const oldState = stateCache[keyword] || {};
    const { state, replies } = command(oldState, message);
    stateCache[keyword] = state;
    replies.forEach(client.send);
});
