import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Client, Events, GatewayIntentBits } from 'discord.js';

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
    const client = new Client({ intents: [ GatewayIntentBits.Guilds ]});
    const config = readWriteConfig();

    client.once(Events.ClientReady, c => {
        console.log(`Connected as ${c.user.tag}`);
    });

    client.on(Events.MessageCreate, (message) => {
        console.log("new message");
        console.log(message.cleanContent);
    });

    // Login to Discord with your client's token
    client.login(config.token);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}