export type Message = {
    user: string,
    room: string,
    text: string,
};

export type IntentNone = { 
    type: 'NONE',
};

export type IntentMessage = { 
    type: 'MESSAGE', 
    room: string, 
    text: string,
};

export type Intent = IntentNone | IntentMessage;
