import * as fs from 'node:fs';
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

function main() {
    const client = new Client({ intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]});
    const config = readWriteConfig();
    const bot = new Bot();

    client.once(Events.ClientReady, async c => {
        console.log(`Connected as ${c.user.tag}`);
        const _ch = await c.channels.fetch(config.channel);
        if (!_ch.isTextBased) {
            console.log("Can't connect bot to non-text channel!");
            process.exit(0);
        }
        const ch = _ch as TextChannel;
        const r = bot.init();
        ch.send(r.message);
    });

    client.on(Events.MessageCreate, m => {
        if (!m.content.startsWith('!')) return;
        const [a0, ...args] = m.content.slice('!'.length).split(/\s/);
        if (bot.commands().includes(a0)) {
            let r: BotResponse;
            try {
                r = bot.handle([a0, ...args]);
            } catch (e) {
                console.log(e);
                m.channel.send(`[CRASH]: ${e}`);
                process.exit(0);
            }
            if (r.error) {
                m.channel.send(`[ERROR] ${r.error}`);
            }
            if (r.message) {
                m.channel.send(r.message);
            }
        }
    });

    client.login(config.token);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}