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

function ping(params: { 
    channelId: string,
    state: any,
}) {
    return {
        type: 'MESSAGE',
        channelId: params.channelId,
        content: 'pong!',
        state: params.state,
    }
};

export function command(params: {
    userId: string,
    channelId: string,
    content: string,
    state: any,
}) { 
    const m = params.content.match(/^\w+/);
    const keyword = m && m[0];
    if (keyword === 'ping') return ping(params);
    if (keyword === 'tictactoe') return tictactoe(params);
    return {
        type: 'NONE',
        state: params.state,
    }
};
