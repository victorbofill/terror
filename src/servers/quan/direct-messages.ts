import { VoiceConnection } from 'discord.js';
import { ClientManager } from '../../clientManager/clientManager';
import { QUAN_SOUND_BOARD, QUAN_MUSIC } from '../quan/sfx';
import { TERROR_ID, VICTOR_ID } from '../../../env';
import { RESTRICTED_THE_BOYS_DM_COMMANDS, RESTRICTED_THE_BOYS_DM_PREFIXES } from '../the-boys/direct-messages';
import {
    dismissRestrictedCommands,
    dismissRestrictedPrefixes,
    RESTRICTED_COMMON_DM_COMMANDS,
    RESTRICTED_COMMON_DM_PREFIXES
} from '../common/direct-messages';

export function loadQuanDirectMessagServices(voiceConnection: VoiceConnection, clientManager: ClientManager) {
    sendDMResponse(voiceConnection, clientManager);
}

export async function sendDMResponse(voiceConnection: VoiceConnection, clientManager: ClientManager) {
    clientManager.getClient().on('message', async message => {
        if(
            message.channel.type !== 'dm'
            || message.author.id === TERROR_ID
            || !(clientManager.mQuanMembers.includes(message.author.id))
        ) return;

        const dmChannel = message.channel;
        const messageContent = message.content.toLowerCase();

        console.log(`Message recieved from ${message.author.username}: "${messageContent}"`);

        switch(messageContent.toLowerCase()) {
            case '!help':
                dmChannel.send(help)
                return;
            case '!help quansfx':
                if(message.author.id === VICTOR_ID) {
                    dmChannel.send(`===SFX LIST=== ${logSFX(QUAN_SOUND_BOARD)}`);
                    return;
                } else break;
            case '!help quanmusic':
                if(message.author.id === VICTOR_ID) {
                    dmChannel.send(`===MUSIC LIST=== ${logSFX(QUAN_MUSIC)}`);
                } else break;
                return;
        }

        if(messageContent.toLowerCase().startsWith('!quansfx ') && message.author.id === VICTOR_ID) {
            const command = messageContent.substring(9);
            const SFXPath = QUAN_SOUND_BOARD.get(command.toLowerCase());
            if(SFXPath) {
                voiceConnection.play(SFXPath);
            } else {
                dmChannel.send(`Sound effect '${command}' not found. Type "!help sfx" for a list of sound effects.`);
            }
            return;
        }

        if(messageContent.toLowerCase().startsWith('!quanmusic ') && message.author.id === VICTOR_ID) {
            const command = messageContent.substring(11);
            const musicPath = QUAN_MUSIC.get(command.toLowerCase());
            if(musicPath) {
                voiceConnection.play(musicPath);
            } else {
                dmChannel.send(`Sound effect '${command}' not found. Type "!help sfx" for a list of sound effects.`);
            }
            return;
        }

        if(
            dismissRestrictedCommands(messageContent, [RESTRICTED_THE_BOYS_DM_COMMANDS, RESTRICTED_COMMON_DM_COMMANDS])
            || dismissRestrictedPrefixes(messageContent, [RESTRICTED_THE_BOYS_DM_PREFIXES, RESTRICTED_COMMON_DM_PREFIXES])
        ) return;

        dmChannel.send(`'${messageContent}' is not a command. Type !help for help.`)
    });
}

function logSFX(SFX: Map<string, string>) {
    let sfx = `
    `
    for (const [key, value] of SFX) sfx += `${key}
    `
    return sfx;
}

const help: string = `== QUAN HELP MENU ==
!help quansfx: lists all sfx
!help quanmusic: lists all music
!quanmusic [music]: play desired music
!quansfx [sound effect]: plays desired sound effect
`;

export const RESTRICTED_QUAN_DM_COMMANDS = [
    '!help quansfx',
    '!help quanmusic'
]

export const RESTRICTED_QUAN_DM_PREFIXES = [
    '!quanmusic ',
    '!quansfx '
]