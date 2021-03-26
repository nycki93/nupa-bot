import * as readline from 'readline';
import * as Discord from 'discord.js';
import { Readable, Writable } from 'node:stream';

interface Message {
    userId: string,
    channelId: string,
    content: string,
}

interface Client {
    on: (eventType: string, eventHandler: (message: Message) => void) => void;
    send: (message: Message) => void;
}

type Command = (
    state: any, message: Message,
) => {
    state: any, replies: Message[],
}

export function DiscordClient(params: {
    token: string,
    prefix: string,
}) {
    const { token, prefix } = params;
    const dc = new Discord.Client();
    const client: Client = {
        on: (eventType, eventHandler) => {
            if (eventType !== 'message') return;
            dc.on('message', discordMessage => {
                if (!discordMessage.content.startsWith(prefix)) return;
                eventHandler({
                    userId: discordMessage.member.id,
                    channelId: discordMessage.channel.id,
                    content: discordMessage.content.slice(prefix.length),
                })
            });
        },
        send: (message) => (dc.channels
            .fetch(message.channelId)
            .then(c => (c as Discord.TextChannel)
                .send('```' + message.content + '```'))
        ),
    }
    dc.once('ready', () => console.log('Bot started.'));
    dc.login(token);
    return client;
}

export function ConsoleClient(params: {
    input: Readable,
    output: Writable
}) {
    const { input, output } = params;
    const rl = readline.createInterface({input, output});
    const client: Client = {
        on: function(eventType, eventHandler) {
            if (eventType !== 'message') return;
            rl.on('line', line => {
                eventHandler({
                    channelId: ':console',
                    userId: ':console',
                    content: line,
                })
            })
        },
        send: function(message) {
            console.log(message.content);
        },
    }
    return client;
}