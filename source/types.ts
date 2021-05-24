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

export interface EffectLoadApp {
    type: 'load app',
    app: string,
}

export type Effect = EffectNone | EffectRead | EffectWrite | EffectRoll | EffectLoadApp;

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

export interface ReportLoadApp {
    type: 'load app',
    app: Generator<Effect, null, Report>,
}

export type Report = ReportNone | ReportMessage | ReportRoll | ReportLoadApp;