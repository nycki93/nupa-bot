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