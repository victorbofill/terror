import { VoiceConnection, VoiceChannel } from 'discord.js';
import { ENTRANCE_SFX, SERVER_SFX } from './sfx/index';
import { MEMBER_IDS, VOICE_CHANNEL_IDS, SERVER_IDS, TERROR_ID } from '../../../env';
import { ClientManager } from '../../clientManager/clientManager';

const THE_BOYS = SERVER_IDS.THE_BOYS;

export function loadVoiceConnection(voiceChannel: VoiceChannel, voiceConnection: VoiceConnection, clientManager: ClientManager) {
    protections(voiceChannel, voiceConnection, clientManager);
    playConnectionSFX(voiceConnection, clientManager);
    playOutroSFX(voiceConnection, clientManager);
}

// keep terror doing its thing
function protections(voiceChannel: VoiceChannel, voiceConnection: VoiceConnection, clientManager: ClientManager) {
    voiceConnection.on('disconnect', async () => {
        // reconnect if disconnected
        if(!voiceChannel.members.get(TERROR_ID)) {
            const voiceConnection = await voiceChannel.join();
            voiceConnection.play(SERVER_SFX.get(`don't touch me`));
        }
    });

    clientManager.getClient().on('voiceStateUpdate', async (oldPresence, newPresence) =>{
        if (!(newPresence.id === TERROR_ID)) return;

        // rejoin channel if moved
        if(!(newPresence.channelID === VOICE_CHANNEL_IDS.get(THE_BOYS).GENERAL)) {
            const voiceConnection = await voiceChannel.join();
            voiceConnection.play(SERVER_SFX.get(`don't touch me`));
        }
    });
}

function playOutroSFX(voiceConnection: VoiceConnection, clientManager: ClientManager) {
    // play sfx if someone leaves the channel due to afk
    clientManager.getClient().on('voiceStateUpdate', async (oldPresence, newPresence) => {
        if (newPresence.id !== TERROR_ID && newPresence.channelID === VOICE_CHANNEL_IDS.get(THE_BOYS).SNORING_CHANNEL) {
            voiceConnection.play(SERVER_SFX.get('he dead'));
        } else { 
            return;
        }

    });
}

// user connect sfx
function playConnectionSFX(voiceConnection: VoiceConnection, clientManager: ClientManager) {
    const theBoys = MEMBER_IDS.get(THE_BOYS);

    // play custom sfx for core group members
    clientManager.getClient().on('voiceStateUpdate', async (oldState, newState) => {

        if((oldState.channel?.members?.size < newState.channel?.members?.size
            || oldState.channel?.members?.size === undefined)
            && newState.channel?.members?.size > 2
            && Object.values(theBoys).includes(newState.id)
            && newState.channelID === VOICE_CHANNEL_IDS.get(THE_BOYS).GENERAL
        ) {
            let introSound;
            switch (newState.id) {
                case MEMBER_IDS.get(THE_BOYS).JACY:
                    introSound = ENTRANCE_SFX.JACY;
                    break;
                case MEMBER_IDS.get(THE_BOYS).KASEY:
                    introSound = ENTRANCE_SFX.KASEY;
                    break;
                case MEMBER_IDS.get(THE_BOYS).SAM:
                    introSound = ENTRANCE_SFX.SAM;
                    break;
                case MEMBER_IDS.get(THE_BOYS).AUSTIN:
                    introSound = ENTRANCE_SFX.AUSTIN;
                    break;
                case MEMBER_IDS.get(THE_BOYS).DEAN:
                    introSound = ENTRANCE_SFX.DEAN;
                    break;
                case MEMBER_IDS.get(THE_BOYS).VICTOR:
                    introSound = ENTRANCE_SFX.VICTOR;
                    break;
            }
            voiceConnection.play(introSound);
        }
    });
}