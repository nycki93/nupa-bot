export type Query = {
    user: string,
    room: string,
    text: string,
    state: any,
}

export enum REPLY_TYPE {
    NONE,
    MESSAGE,
    ERROR,
}

export type ReplyNone = {
    type: REPLY_TYPE.NONE,
}

export type ReplyMessage = { 
    type: REPLY_TYPE.MESSAGE,
    room: string, 
    text: string,
    state: any,
};

export type ReplyError = {
    type: REPLY_TYPE.ERROR,
    room: string,
    text: string,
}

export type Reply = {
    type: REPLY_TYPE,
}

export type Command = ((query: Query) => Reply);
