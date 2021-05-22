export interface EffectNone {
    type: 'none',
}

export interface EffectRead {
    type: 'read',
}

export interface EffectWrite {
    type: 'write',
    text: string,
}

export type Effect = EffectNone | EffectRead | EffectWrite;

export interface ReportNone {
    type: 'none',
}

export interface ReportMessage {
    type: 'message',
    userId: string,
    userName: string,
    text: string,
}

export type Report = ReportNone | ReportMessage;