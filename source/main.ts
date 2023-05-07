import * as fs from 'node:fs';
import * as readline from 'readline/promises';
import { fileURLToPath } from 'node:url';
import { Client, Events, GatewayIntentBits, TextChannel } from 'discord.js';

import { Bot, BotResponse } from './bot.js';

type Config = {
    prefix: string,
    token: string,
    channel: string,
}

const DEFAULT_CONFIG = {
    prefix: '!',
    token: '',
    channel: '',
}

function readWriteConfig(path = 'config.json') {
    let config: Config;
    try {
        const json = fs.readFileSync(path).toString();
        config = { ...DEFAULT_CONFIG, ...JSON.parse(json) };
    } catch {
        config = DEFAULT_CONFIG;
    }
    fs.writeFileSync(path, JSON.stringify(config, null, 2));
    return config;
}

function runDiscord() {
    const client = new Client({ intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]});
    const config = readWriteConfig();
    let bot = new Bot();

    client.once(Events.ClientReady, async c => {
        console.log(`Connected as ${c.user.tag}`);
        const _ch = await c.channels.fetch(config.channel);
        if (!_ch.isTextBased) {
            console.log("Can't connect bot to non-text channel!");
            process.exit(1);
        }
        const ch = _ch as TextChannel;
        const r = bot.init();
        ch.send(r.message);
    });

    client.on(Events.MessageCreate, async m => {
        if (!m.content.startsWith('!')) return;
        const [a0, ...args] = m.content.slice('!'.length).split(/\s/);
        let r: BotResponse;
        if (a0 === 'reload') {
            await m.channel.send('Shutting down.')
            process.exit(2);
        }
        if (bot.commands().includes(a0)) {
            try {
                r = bot.handle([a0, ...args]);
            } catch (e) {
                console.log(e);
                await m.channel.send(`[CRASH]: ${e}`);
                process.exit(2);
            }
        }
        if (r && r.error) {
            await m.channel.send(`[ERROR] ${r.error}`);
        }
        if (r && r.message) {
            await m.channel.send(r.message);
        }
    });

    client.login(config.token);
}

async function runConsole() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const bot = new Bot();
    const r: BotResponse = bot.init();
    console.log(`<bot> ${r.message}`);
    while (true) {
        const m = await rl.question('<user> ');
        if (!m.startsWith('!')) continue;
        const [a0, ...args] = m.slice('!'.length).split(/\s/);
        if (!bot.commands().includes(a0)) continue;
        let r: BotResponse;
        try {
            r = bot.handle([a0, ...args]);
        } catch (e) {
            console.log(`[CRASH]: ${e}`);
            process.exit(2);
        }
        if (r.message) {
            console.log(r.message);
        }
        if (r.error) {
            console.log(`[ERROR] ${r.error}`);
        }
        if (r.quit) {
            break;
        }
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    if (process.argv[2] === 'discord') {
        runDiscord();
    }
    if (process.argv[2] === 'console') {
        runConsole();
    }
}