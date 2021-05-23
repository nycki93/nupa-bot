import * as discord from 'discord.js';
import * as fs from 'fs';
import * as readline from 'readline';
import { init } from './bot';
import { Effect, Report } from './types';

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

async function consoleMain() {
    const rl = readline.createInterface(process.stdin, process.stdout);
    const eventBucket: Report[] = [];
    let eventNext: Function = null;
    rl.on('line', line => {
        const [user, text] = line.split(': !', 2);
        if (!text) {
            console.log('Input must be of the form user: !command.');
        }
        const report: Report = {
            type: 'message',
            userId: user,
            userName: user,
            text,
        };
        if (eventNext) {
            eventNext(report);
            eventNext = null;
            return;
        }
        eventBucket.push(report);
    });

    const bot = init();
    let t = bot.next();
    while (!t.done) {
        const effect = t.value;
        if (effect.type === 'read') {
            if (eventBucket.length) {
                t = bot.next(eventBucket.shift());
                continue;
            }
            const report = await new Promise<Report>(res => eventNext = res);
            t = bot.next(report);
            continue;
        }
        if (effect.type === 'write') {
            console.log(effect.text);
            t = bot.next();
        }
    }
}

async function discordMain(config: {
    discord: {
        prefix: string; token: string; channel: string;
    };
}) {
    const { prefix, token, channel: channelId } = config.discord;
    if (!token) {
        console.log('Please add a discord token to the config file.');
        process.exit(0);
    }
    if (!channelId) {
        console.log('Please add a channel ID to the config file.');
        process.exit(0);
    }
    const dc = new discord.Client;
    const _channel = await dc.channels.fetch(channelId);
    if (!_channel.isText) {
        console.log('Please check that the configured channel accepts text messages.');
        process.exit(0);
    }
    const channel = _channel as discord.TextChannel;

    const messageBucket = [];
    let messageNext: Function = null;
    dc.on('message', async message => {
        if (!message.content.startsWith(prefix)) return;
        if (message.channel.id !== channelId) return;
        const report: Report = {
            type: 'message',
            userId: message.member.id,
            userName: message.member.displayName,
            text: message.content.slice(prefix.length),
        }
        if (messageNext) {
            messageNext(report);
            messageNext = null;
        } else {
            messageBucket.push(report);
        }
    });
    dc.login(token);

    const generator: Generator<Effect> = init();
    let t = generator.next();
    while (!t.done) {
        const effect = t.value as Effect;
        if (effect.type === 'read') {
            if (messageBucket.length) {
                generator.next(messageBucket.shift());
                continue;
            }
            const report = await new Promise(resolve => {
                messageNext = resolve;
            });
            generator.next(report);
            continue;
        }
        if (effect.type === 'write') {
            channel.send('```' + effect.text + '```');
        }
    }
}

function main() {
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
