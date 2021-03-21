export type ChatCommand = (o: { 
    state: Object,
    user: any,
    channel: any,
    args: Array<string>,
}) => { 
    newState: Object,
    replies: Iterable<{
        user: any,
        channel: any,
        message: string,
    }>;
};
