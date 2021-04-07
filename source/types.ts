export type Query = {
    text: string,
    args?: string[],
    userId: string,
    userName: string,
};

export type Reply = {
    message?: string,
    error?: string,
}
