import { VoiceChannel, VoiceConnection } from 'discord.js';
import { IBoysServer } from './defs/the-boys-defs';
import { ClientManager } from '../../clientManager/clientManager';

import { VOICE_CHANNEL_IDS, SERVER_IDS } from '../../../env';

import { loadVoiceConnection } from './voice-connection';
import { loadTheBoysDirectMessagServices } from './direct-messages';
import { loadTheBoysSounds } from './sfx/index';

export class TheBoysServer implements IBoysServer {
    mClientManager: ClientManager;
    mServerID: SERVER_IDS;
    mGeneralVoiceConnection: VoiceConnection;
    mGeneralVoiceChannel: VoiceChannel;
    mQuietPlaceConnection: undefined;

    async init(clientManager: ClientManager, serverID: SERVER_IDS) {
        this.mClientManager = clientManager;
        this.mServerID = serverID;

        const voiceChannelID = VOICE_CHANNEL_IDS.get(this.mServerID).GENERAL;
        this.mGeneralVoiceChannel = await this.mClientManager.getClient().channels.fetch(voiceChannelID) as VoiceChannel;
        this.mGeneralVoiceConnection = await this.mGeneralVoiceChannel.join();

        loadVoiceConnection(this.mGeneralVoiceChannel, this.mGeneralVoiceConnection, this.mClientManager);
        loadTheBoysDirectMessagServices(this.mGeneralVoiceConnection, this.mClientManager);
        loadTheBoysSounds();
    }
}