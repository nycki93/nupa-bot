import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Client, Events, GatewayIntentBits, TextChannel } from 'discord.js';

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
    let state = {
        game: {
            playing: null,
            message: null,
        }
    };
    const client = new Client({ intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]});
    const config = readWriteConfig();

    client.once(Events.ClientReady, async c => {
        console.log(`Connected as ${c.user.tag}`);
        const channel = await c.channels.fetch(config.channel);
        if (channel.isTextBased) {
            (channel as TextChannel).send('Bot connected!');
        }
    });

    client.on(Events.MessageCreate, m => {
        if (!m.content.startsWith('!')) return;
        const args = m.content.slice('!'.length).split(/\s/);
        console.log(args);
        const command = args[0].toLowerCase();
        if (command === 'help') {
            m.channel.send('Commands: help, ping, game');
        } else if (command === 'ping') {
            m.channel.send('pong!');
        } else if (command === 'game') {
            state.game = game({ state: state.game, args });
            if (state.game.message) {
                m.channel.send(state.game.message);
            }
        }
    });

    client.login(config.token);
}

function game(o: { state: any, args: string[]}) {
    const { state, args } = o;
    const subcommand = args.length > 1 && args[1];
    if (state.playing === null && (!subcommand || subcommand === 'help')) {
        return {
            ...state,
            message: `Usage: ${args[0]} start guess`,
        }
    }
    if (state.playing === null && subcommand === 'start') {
        const choice = args.length > 2 && args[2];
        if (choice === 'guess') {
            return {
                ...state,
                playing: 'guess',
                solution: 69,
                message: 'Guessing game started! Guess my number with !game guess <number>.',
            }
        }
        return {
            ...state,
            message: `Available games: guess`,
        }
    }
    if (state.playing === 'guess') {
        const guess = args.length > 2 && Number(args[2]);
        if (!guess) {
            return {
                ...state,
                message: `Usage: ${args[0]} ${args[1]} <number>`,
            }
        }
        if (guess < state.solution) {
            return {
                ...state,
                message: 'Too low!',
            }
        }
        if (guess > state.solution) {
            return {
                ...state,
                message: 'Too high!',
            }
        }
        return {
            playing: null,
            message: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let's shake it up a little. Barry! Breakfast is ready! Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan you believe this is happening? - I can't. I'll pick you up. Looking sharp. Use the stairs. Your father paid good money for those. Sorry. I'm excited. Here's the graduate. We're very proud of you, son. A perfect report card, all B's. Very proud."
        }
    }
    return {
        ...state,
        message: `Usage: ${args[0]} start guess`,
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}