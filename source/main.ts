import * as readline from 'readline';
import * as discord from 'discord.js';
import mainCommand from './mainCommand';
import * as fs from 'fs';

function main()
{ 
    console.log(JSON.stringify(process.argv, null, 2));
    if (process.argv[2] == 'console') {
        consoleMain();
    } else if (process.argv[2] == 'discord') {
        discordMain();
    } else {
        console.info('Options: console, discord');
        process.exit(0);
    }
}

function consoleMain() 
{
    const rl = readline.createInterface(process.stdin, process.stdout);
    let state = {};
    rl.on('line', line => {
        const reply = mainCommand({
            room: 'console',
            user: 'console',
            text: line,
            state,
        });
        state = reply.state;
        if (reply.type === 'MESSAGE') {
            rl.write(reply.text);
        }
    });
}

async function discordMain() 
{    
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

    if (!config.discord.token) {
        console.log('Please add a valid discord token to config.json.');
        process.exit(0);
    }

    const dc = new discord.Client;
    let state = {};
    dc.on('message', async message => {
        const reply = mainCommand({
            room: message.channel.id,
            user: message.member.id,
            text: message.content,
            state,
        });
        state = reply.state;
        if (reply.type === 'MESSAGE') {
            let room = await dc.channels.fetch(reply.room);
            if (room.isText()) {
                room.send('```' + reply.text + '```');
            }
        }
    });
    dc.login(config.discord.token);
}

if (require.main === module) main();
