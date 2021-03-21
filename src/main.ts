import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';

import ticTacToe from './ticTacToe.js';

dotenv.config();
const PREFIX = '!';
const client = new Discord.Client();

const mono = (t: string) => '```' + t + '```';

const stateCache = {};

client.once('ready', () => {
	console.log('Bot started.');
});

client.on('message', message => {
    const m = message.content.match('^' + PREFIX + '(.+)( .+)?$');
    if (!m || !m[1]) return;
    console.log(m[0]);
    const args = m[1].split(/\s+/);
    const command = args[0];

	if (command === 'ping') {
		message.channel.send('Pong.');
	} else if (command === 'tictactoe') {
        const key = message.channel.id + ':tictactoe';
        const { newState, replies } = ticTacToe({
            state: stateCache[key] || {},
            user: message.member.id,
            channel: message.channel.id,
            args,
        })
        stateCache[key] = newState;
        for (const reply of replies) {
            message.channel.send(mono(reply.message));
        }
    }
}); 

client.login(process.env.TOKEN);
