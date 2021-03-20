import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';

import * as ticTacToe from './ticTacToe.js';

const PREFIX = '!';
const client = new Discord.Client();
dotenv.config();

const mono = (t) => '```' + t + '```';

const state = {};

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
        if (args[1] === 'start') {
            state['tictactoe'] = ticTacToe.newBoard();
            message.channel.send(mono(ticTacToe.display(state['tictactoe'])));
        } else if (args[1] === 'move') {
            const i = parseInt(args[2]);
            const { board, err } = ticTacToe.move(state['tictactoe'], i)
            if (!board) return message.channel.send(err);
            state['tictactoe'] = board;
            message.channel.send(mono(ticTacToe.display(state['tictactoe'])));
        }
    }
}); 

client.login(process.env.TOKEN);
