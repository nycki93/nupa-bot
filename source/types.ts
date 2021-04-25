export type Query = {
    text: string,
    args?: string[],
    userId: string,
    userName: string,
};

export interface ActionMessage {
    type: 'MESSAGE',
    message: string,
}

export interface ActionError {
    type: 'ERROR',
    error: string,
}

export interface ActionQuit {
    type: 'QUIT',
}

export interface ActionNone {
    type: 'NONE',
}

export type Action = ActionMessage | ActionError | ActionQuit | ActionNone;
