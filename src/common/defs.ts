import {
    Client,
    DMChannel
} from 'discord.js';
import { SERVER_IDS } from './consts';

export interface IENV {
    CLIENT: Client;
    VICTOR_DM: DMChannel,
    ERROR_HAS_REPEATED: boolean
}

export interface IServer {
    mServerID: string;
    mENV: IENV;

    initiateClient(server: SERVER_IDS): void;

    disconnectClient(): void;

    rebootClient(): void;
}

