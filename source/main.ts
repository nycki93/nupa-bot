import * as discord from 'discord.js';
import * as fs from 'fs';
import * as readline from 'readline';
import { mainCommand } from './mainCommand';

function readWriteConfig(path = 'config.json') {
    const fp = fs.openSync('config.json', 'w+');
    const config = {
        discord: { 
            prefix: '!',
            token: '',
        },
        ...JSON.parse(fs.readFileSync(fp).toString() || '{}'),
    };
    fs.writeFileSync(fp, JSON.stringify(config, null, 2));
    fs.closeSync(fp);
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
            rl.write(reply.message);
        } else if (reply.error) {
            rl.write('[ERROR] ' + reply.error);
        }
    });
}

function discordMain(config: { 
    prefix: string, 
    token: string,
}) {
    const { prefix, token } = config;    
    if (!token) {
        console.log('Please add a discord token to the config file.');
        process.exit(0);
    }
    const dc = new discord.Client;
    let state = {};
    dc.on('message', async message => {
        if (!message.content.startsWith(prefix)) return;
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
    console.log(JSON.stringify(process.argv, null, 2));
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
