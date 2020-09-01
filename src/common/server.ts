import { Client } from 'discord.js';
import { IServer } from './defs';
import { SERVER_IDS } from './consts';

import { API_KEY } from '../../env';


export class Server implements IServer {
    mServerID = undefined;
    mENV = undefined;

    constructor(serverID) {
        this.mServerID = serverID;

        this.mENV = {
            CLIENT: new Client(),
            VICTOR_DM: undefined,
            ERROR_HAS_REPEATED: undefined
        }

        this.mENV.CLIENT.login(API_KEY);

        this.initiateClient(this.mServerID);
    }

    initiateClient(server: SERVER_IDS) {
        return;
    }

    async disconnectClient() {
        await this.mENV.CLIENT.destroy();
        delete this.mENV.CLIENT;
    }

    async rebootClient() {
        await this.disconnectClient();
        await this.initiateClient(this.mServerID);
    }
}