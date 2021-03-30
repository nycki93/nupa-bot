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

// const configJson = fs.readFileSync('config.json').toString() || '{}';
// const config = { 
//     ...defaultConfig, 
//     ...JSON.parse(configJson),
// }
// fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
//fs.closeSync(configFile);
const config = defaultConfig;

// if (!config.discord.token) {
//     console.log("Please provide a bot token in config.json.");
//     process.exit(0);
// }

//const client = DiscordClient(config.discord);
const client = ConsoleClient({
    input: process.stdin,
    output: process.stdout,
});

function ping(params: { 
    channelId: string,
}) {
    return {
        type: 'MESSAGE',
        channelId: params.channelId,
        content: 'pong!',
    }
};

export function command(params: {
    userId: string,
    channelId: string,
    content: string,
    state?: any,
}): {
    type: string,
    [key: string]: any
} { 
    const { userId, channelId, content } = params;
    const state = params.state ?? {};
    const m = params.content.match(/^\w+/);
    const keyword = m && m[0];
    if (keyword === 'ping') return ping({ channelId });
    if (keyword === 'tictactoe') return tictactoe({ 
        userId, channelId, content, state,
    });
    return {
        type: 'NONE',
    }
};
