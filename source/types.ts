export type Query = {
    user: string,
    room: string,
    text: string,
    state: any,
};

export interface ReplyNone {
    type: 'NONE',
    state?: any,
}

export interface ReplyMessage {
    type: 'MESSAGE'
    room: string,
    text: string,
    state: any,
}

export interface ReplyError {
    type: 'ERROR',
    room: string,
    text: string,
    state: any,
}

export type Reply = ReplyNone | ReplyMessage | ReplyError;

export type Command = ((query: Query) => Reply);
