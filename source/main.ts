import * as discord from 'discord.js';
import * as fs from 'fs';
import * as readline from 'readline';
import { mainCommand } from './mainCommand';

function readWriteConfig(path = 'config.json') {
    const configJson = fs.readFileSync(path).toString();
    const defaults = {
        discord: { 
            prefix: '!',
            token: '',
            channel: '',
        },
    };
    const config = { ...defaults, ...JSON.parse(configJson) };
    fs.writeFileSync(path, JSON.stringify(config, null, 2));
    return config;
}

function consoleMain() 
{
    const rl = readline.createInterface(process.stdin, process.stdout);
    let state = {};
    rl.on('line', line => {
        const { state: newState, reply } = mainCommand({
            state,
            query: { user: 'console', text: line },
        });
        state = newState;
        if (reply.message) {
            console.log(reply.message);
        } else if (reply.error) {
            console.log('[ERROR] ' + reply.error);
        }
    });
}

function discordMain(config: { 
    discord: { 
        prefix: string; token: string; channel: string; 
    }; 
}) {
    const { prefix, token, channel } = config.discord;   
    if (!token) {
        console.log('Please add a discord token to the config file.');
        process.exit(0);
    }
    if (!channel) {
        console.log('Please add a channel ID to the config file.');
        process.exit(0);
    }
    const dc = new discord.Client;
    let state = {};
    dc.on('message', async message => {
        if (!message.content.startsWith(prefix)) return;
        if (message.channel.id !== channel) return;
        const args = message.content.slice(prefix.length).split(/\s+/);
        const { state: newState, reply } = mainCommand({
            state,
            query: {
                user: message.member.id,
                text: message.content,
                args,
            }
        });
        state = newState;
        if (reply.message) {
            message.channel.send('```' + reply.message + '```');
        } else if (reply.error) {
            message.channel.send('```[ERROR] ' + reply.error + '```');
        }
    });
    dc.login(token);
}

function main()
{ 
    if (process.argv[2] == 'console') {
        consoleMain();
    } else if (process.argv[2] == 'discord') {
        const config = readWriteConfig();
        discordMain(config);
    } else {
        console.info('Options: console, discord');
        process.exit(0);
    }
}







if (require.main === module) main();
