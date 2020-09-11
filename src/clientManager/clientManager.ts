import { Client, DMChannel } from 'discord.js';
import { IClientManager } from './clientManager-defs';
import { API_KEY, VICTOR_ID, KASEY_ID, SERVER_IDS } from '../../env';

import { TheBoysServer } from '../servers/the-boys/the-boys';
import { QuanServer } from '../servers/quan/quan';
import { loadCommonDirectMessagServices } from '../servers/common/direct-messages';

export class ClientManager implements IClientManager {
    mClient = undefined;
    mErrorHasRepeated = false;
    mVictorDM = undefined;
    mQuanMembers = undefined;
    mBoysMembers = undefined;
    mKaseyDM = undefined;

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

        this.mClient.on('ready', async () => {
            this.mBoysMembers = this.mClient.guilds.cache.get(SERVER_IDS.THE_BOYS).members.cache.keyArray();
            this.mQuanMembers = this.mClient.guilds.cache.get(SERVER_IDS.QUAN).members.cache.keyArray();
    
            const victor = await this.mClient.users.fetch(VICTOR_ID);
            this.mVictorDM = await victor.createDM();
    
            const kasey = await this.mClient.users.fetch(KASEY_ID);
            this.mKaseyDM = await kasey.createDM();
    
            loadCommonDirectMessagServices(this);

            this.loadErrorHandler();
            
            const theBoyseServer = new TheBoysServer();
            await theBoyseServer.init(this, SERVER_IDS.THE_BOYS);
    
            const quanServer = new QuanServer();
            await quanServer.init(this, SERVER_IDS.QUAN);
    
            console.log('Connected as ' + this.mClient.user.tag);
    
        })
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