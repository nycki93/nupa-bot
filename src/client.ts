import * as Discord from 'discord.js';

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
            return dc.on('message', discordMessage => {
                if (!discordMessage.content.startsWith(prefix)) return;
                return eventHandler({
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