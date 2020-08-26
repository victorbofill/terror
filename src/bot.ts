const Discord = require('discord.js');

import { VoiceChannel, VoiceConnection } from 'discord.js';
import { IENV } from './defs/defs';
import { API_KEY, VOICE_CHANNEL_IDS, MEMBER_IDS } from '../env';

import { loadVoiceConnection } from './voice-channel';
import { loadDirectMessagServices } from './direct-messages';
import { loadSounds } from './sfx/index';
import { loadErrorHandler } from './error-handler';

const ENV: IENV = {
    CLIENT: undefined,
    GENERAL_VOICE_CHANNEL: undefined,
    QUIET_PLACE_VOICE_CHANNEL: undefined,
    VICTOR_DM: undefined,
    ERROR_HAS_REPEATED: false
}

initiateClient();

export async function initiateClient() {
    ENV.CLIENT = new Discord.Client();
    ENV.CLIENT.login(API_KEY);

    ENV.CLIENT.on('ready', async () => {
        console.log('Connected as ' + ENV.CLIENT.user.tag);

        // set up environment variables
        ENV.GENERAL_VOICE_CHANNEL = await ENV.CLIENT.channels.fetch(VOICE_CHANNEL_IDS.GENERAL) as VoiceChannel;
        const generalVoiceConnection: VoiceConnection = await ENV.GENERAL_VOICE_CHANNEL.join();

        ENV.QUIET_PLACE_VOICE_CHANNEL = await ENV.CLIENT.channels.fetch(VOICE_CHANNEL_IDS.QUIET_PLACE)  as VoiceChannel;

        const victor = await ENV.CLIENT.users.fetch(MEMBER_IDS.VICTOR);
        ENV.VICTOR_DM = await victor.createDM();

        // load functions
        loadVoiceConnection(ENV, generalVoiceConnection);
        loadDirectMessagServices(ENV, generalVoiceConnection);
        loadSounds();
        loadErrorHandler(ENV);
    });    
}

export async function disconnectClient() {
    await ENV.CLIENT.destroy();
    delete ENV.CLIENT;
}

export async function rebootClient() {
    await disconnectClient();
    await initiateClient();
}