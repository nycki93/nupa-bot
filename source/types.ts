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

export interface EffectRoll {
    type: 'roll',
    max: number,
}

export type Effect = EffectNone | EffectRead | EffectWrite | EffectRoll;

export interface ReportNone {
    type: 'none',
}

export interface ReportMessage {
    type: 'message',
    userId: string,
    userName: string,
    text: string,
}

export interface ReportRoll {
    type: 'roll',
    value: number,
}

export type Report = ReportNone | ReportMessage | ReportRoll;