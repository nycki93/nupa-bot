import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';

import ticTacToe from './ticTacToe.js';
import { Client, Command, Message } from './types.js';

dotenv.config();
const PREFIX = '!';

const dc = new Discord.Client();
const client: Client = {
    on: (messageHandler) => dc.on('message', discordMessage => (
        messageHandler({
            userId: discordMessage.member.id,
            channelId: discordMessage.channel.id,
            content: discordMessage.content,
        })
    )),
    send: (message) => (dc.channels
        .fetch(message.channelId)
        .then(c => (c as Discord.TextChannel)
            .send('```' + message.content + '```'))
    ),
}
dc.once('ready', () => console.log('Bot started.'));
dc.login(process.env.TOKEN);

const commands: {[key: string]: Command} = {
    ping: (state: any, message: Message) => ({
        state,
        replies: [{
            userId: message.userId,
            channelId: message.channelId,
            content: 'pong!',
        }],
    }),
    tictactoe: (state: any, message: Message) => {
        const { newState, replies } = ticTacToe({
            state, 
            user: message.userId, 
            channel: message.channelId, 
            args: message.content.split(/\s+/),
        });
        return { 
            state: newState, 
            replies: Array.from(replies).map(r => ({
                userId: r.user,
                channelId: r.channel,
                content: r.message,
            })),
        };
    },
}

const stateCache = {};

client.on(message => {
    const m = message.content.match('^' + PREFIX + '((\\w+).*)$');
    if (!m || !m[2]) return;
    const content = m[1];
    const keyword = m[2];
    
    if (!(keyword in commands)) return;
    const command = commands[keyword];
    const oldState = stateCache[keyword] || {};
    const { state, replies } = command(oldState, {...message, content});
    stateCache[keyword] = state;
    replies.forEach(client.send);
});