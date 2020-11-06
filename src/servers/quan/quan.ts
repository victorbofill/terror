import { VoiceChannel, VoiceConnection, TextChannel } from 'discord.js';
import { IQuanServer } from './defs/quan-defs';
import { ClientManager } from '../../clientManager/clientManager';

import { VOICE_CHANNEL_IDS, SERVER_IDS } from '../../../env';
import { loadDiceRoller } from '../common/dice-roller';
import { loadQuanDirectMessagServices } from './direct-messages';
import { loadQuanSounds, loadQuanMusic } from '../quan/sfx';

export class QuanServer implements IQuanServer {
    mClientManager: ClientManager;
    mServerID: SERVER_IDS;
    mQuanVoiceConnection: VoiceConnection;
    mQuanVoiceChannel: VoiceChannel;
    mQuanChatChannel: TextChannel;

    async init(clientManager: ClientManager, serverID: SERVER_IDS) {
        this.mClientManager = clientManager;
        this.mServerID = serverID;

        const voiceChannelID = VOICE_CHANNEL_IDS.get(this.mServerID).QUAN;
        this.mQuanVoiceChannel = await this.mClientManager.getClient().channels.fetch(voiceChannelID) as VoiceChannel;
        this.mQuanVoiceConnection = await this.mQuanVoiceChannel.join();

        loadDiceRoller(this.mClientManager, this.mServerID);
        loadQuanDirectMessagServices(this.mQuanVoiceConnection, this.mClientManager);
        loadQuanSounds();
        loadQuanMusic();
    }
}