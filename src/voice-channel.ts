const path = require('path');

import { VoiceConnection } from 'discord.js';
import { IENV } from './defs/defs';
import { ENTRANCE_SFX, SERVER_SFX } from './sfx/index';
import { MEMBER_IDS, TERROR_ID, VOICE_CHANNEL_IDS } from '../env';

export function loadVoiceConnection(ENV: IENV, generalVoiceConnection: VoiceConnection) {
    protections(ENV, generalVoiceConnection);
    playConnectionSFX(ENV, generalVoiceConnection);
    playOutroSFX(ENV, generalVoiceConnection);
}

// keep terror doing its thing
function protections(ENV: IENV, generalVoiceConnection: VoiceConnection) {
    generalVoiceConnection.on('disconnect', async () => {
        // reconnect if disconnected
        if(!ENV.GENERAL_VOICE_CHANNEL.members.get(TERROR_ID)) {
            const voiceConnection = await ENV.GENERAL_VOICE_CHANNEL.join();
            voiceConnection.play(SERVER_SFX.get(`don't touch me`));
        }
    });

    ENV.CLIENT.on('voiceStateUpdate', async (oldPresence, newPresence) =>{
        if (!(newPresence.id === TERROR_ID)) return;

        // rejoin channel if moved
        if(!(newPresence.channelID === VOICE_CHANNEL_IDS.GENERAL)) {
            const voiceConnection = await ENV.GENERAL_VOICE_CHANNEL.join();
            voiceConnection.play(SERVER_SFX.get(`don't touch me`));
        }
    });
}

function playOutroSFX(ENV: IENV, generalVoiceConnection: VoiceConnection) {
    // play sfx if someone leaves the channel due to afk
    ENV.CLIENT.on('voiceStateUpdate', async (oldPresence, newPresence) => {
        if (newPresence.id !== TERROR_ID && newPresence.channelID === VOICE_CHANNEL_IDS.SNORING_CHANNEL) {
            generalVoiceConnection.play(SERVER_SFX.get('he dead'));
        } else { 
            return;
        }

    });
}

// user connect sfx
function playConnectionSFX(ENV: IENV, generalVoiceConnection: VoiceConnection) {
    // play custom sfx for core group members
    ENV.CLIENT.on('voiceStateUpdate', async (oldState, newState) => {
        if((oldState.channel?.members?.size < newState.channel?.members?.size
            || oldState.channel?.members?.size === undefined)
            && newState.channel?.members?.size > 2
            && Object.values(MEMBER_IDS).includes(newState.id)
        ) {
            let introSound;
            switch (newState.id) {
                case MEMBER_IDS.JACY:
                    introSound = ENTRANCE_SFX.JACY;
                    break;
                case MEMBER_IDS.KASEY:
                    introSound = ENTRANCE_SFX.KASEY;
                    break;
                case MEMBER_IDS.SAM:
                    introSound = ENTRANCE_SFX.SAM;
                    break;
                case MEMBER_IDS.AUSTIN:
                    introSound = ENTRANCE_SFX.AUSTIN;
                    break;
                case MEMBER_IDS.DEAN:
                    introSound = ENTRANCE_SFX.DEAN;
                    break;
                case MEMBER_IDS.VICTOR:
                    introSound = ENTRANCE_SFX.VICTOR;
                    break;
            }
            generalVoiceConnection.play(introSound);
        }
    });
}