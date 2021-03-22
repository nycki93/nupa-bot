export type ChatCommand = (o: { 
    state: Object,
    user: any,
    channel: any,
    args: Array<string>,
}) => { 
    newState: Object,
    replies: Iterable<{
        user: any,
        channel: any,
        message: string,
    }>;
};

export interface Message {
    userId: string,
    channelId: string,
    content: string,
}

export interface Client {
    on: (messageHandler: (message: Message) => void) => void;
    send: (message: Message) => void;
}

export type Command = (
    state: any, message: Message,
) => {
    state: any, replies: Message[],
}