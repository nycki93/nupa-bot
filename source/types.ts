export type Query = {
    text: string,
    args?: string[],
    user: string,
};

export type Reply = {
    message?: string,
    error?: string,
}
