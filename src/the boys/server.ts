import { Server } from '../common/server';

import { VoiceChannel, VoiceConnection } from 'discord.js';
import { VOICE_CHANNEL_IDS } from './common/consts';

import { loadVoiceConnection } from './voice-channel';
import { loadDirectMessagServices } from './direct-messages';
import { loadSounds } from './sfx/index';

export class TheBoysServer extends Server {
    initiateClient() {
        this.mENV.CLIENT.on('ready', async () => {
            console.log('Connected as ' + this.mENV.CLIENT.user.tag);
            this.mENV.GENERAL_VOICE_CHANNEL = await this.mENV.CLIENT.channels.fetch(VOICE_CHANNEL_IDS.GENERAL) as VoiceChannel;
            const generalVoiceConnection: VoiceConnection = await this.mENV.GENERAL_VOICE_CHANNEL.join();
            this.mENV.QUIET_PLACE_VOICE_CHANNEL = await this.mENV.CLIENT.channels.fetch(VOICE_CHANNEL_IDS.QUIET_PLACE)  as VoiceChannel;
            loadVoiceConnection(generalVoiceConnection);
            loadDirectMessagServices(generalVoiceConnection);
            loadSounds();
        });    
    
    }
}