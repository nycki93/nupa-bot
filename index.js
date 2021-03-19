const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const PREFIX = 'please ';

const client = new Discord.Client();
client.once('ready', () => {
	console.log('Hello, ' + process.env.NAME + '!');
});

client.on('message', message => {
	console.log(message.content);
	if (message.content === PREFIX + 'ping') {
		message.channel.send('Pong.');
	}
});

client.login(process.env.TOKEN);
