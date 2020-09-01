import { Client, DMChannel } from 'discord.js';
import { IClientManager } from './defs';
import { API_KEY, VICTOR_ID } from '../../env';

export class ClientManager implements IClientManager {
    mClient = undefined;
    mErrorHasRepeated = false;
    mVictorDM = undefined;

    async init() {
        await this.initiateClient();
    }

    getClient(): Client {
        return this.mClient;
    }

    getErrorHasRepeated(): boolean {
        return this.mErrorHasRepeated;
    }

    getVictorDM(): DMChannel {
        return this.mVictorDM;
    }

    async initiateClient() {
        this.mClient = new Client();
        await this.mClient.login(API_KEY)

        console.log('Connected as ' + this.mClient.user.tag);

        const victor = await this.mClient.users.fetch(VICTOR_ID);
        this.mVictorDM = await victor.createDM();

        this.loadErrorHandler();
    }

    async disconnectClient() {
        await this.mClient.destroy();
        delete this.mClient;
    }

    async rebootClient() {
        await this.disconnectClient();
        await this.initiateClient();
    }

    loadErrorHandler() {
        this.mClient.on('error', async error => {
            console.log('ERROR: ', error.message);
    
            try {
                this.mVictorDM.send(`Error with discord: ${error.message}`);
            } catch {
                console.log('DM to Victor failed.')
            }
            
            await this.rebootClient();
        });
    }
}