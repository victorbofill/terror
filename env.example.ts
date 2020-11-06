// this is an example of what the env.ts file looks like, though the actual values are not uploaded to github
export const API_KEY = 'discord api key';

export const BOTTIE_ID = 'bottie id';
export const VICTOR_ID = 'my id';

export enum SERVER_IDS {
    SERVER_1 = 'server 1 id'
}

export const MEMBER_IDS = new Map([
    [SERVER_IDS.SERVER_1, {
        VICTOR: VICTOR_ID,
        MEMBER_2: 'member 2 id',
        MEMBER_3: 'member 3 id'
    }]
]);

export const VOICE_CHANNEL_IDS = new Map([
    [SERVER_IDS.SERVER_1, {
        CHANNEL_1: 'channel 1 id'
    }]
])

export const CHAT_CHANNEL_IDS = new Map([
    [SERVER_IDS.SERVER_1, {
        CHANNEL_1: 'channel 1 id'
    }]
]);