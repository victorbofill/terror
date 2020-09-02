import { Client, DMChannel } from 'discord.js';

export interface IClientManager {
    mClient: Client;
    mErrorHasRepeated: boolean;
    mVictorDM: DMChannel;
    mBoysMembers: any;
    mQuanMembers: any;

    getClient(): Client;

    getErrorHasRepeated(): boolean;

    getVictorDM(): DMChannel;

    initiateClient(): void;

    disconnectClient(): void;

    rebootClient(): void;

    loadErrorHandler(): void;
}

