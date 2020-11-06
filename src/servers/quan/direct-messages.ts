import { VoiceConnection } from 'discord.js';
import { ClientManager } from '../../clientManager/clientManager';
import { QUAN_SOUND_BOARD, QUAN_MUSIC } from '../quan/sfx';
import { BOTTIE_ID } from '../../../env';
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
            || message.author.id === BOTTIE_ID
            || !(clientManager.mQuanMembers.includes(message.author.id))
        ) return;

        const dmChannel = message.channel;
        const messageContent = message.content.toLowerCase();

        if(
            dismissRestrictedCommands(messageContent, [RESTRICTED_COMMON_DM_COMMANDS])
            || dismissRestrictedPrefixes(messageContent, [RESTRICTED_COMMON_DM_PREFIXES])
        ) return;

        console.log(`Message recieved from ${message.author.username}: "${messageContent}"`);

        switch(messageContent.toLowerCase()) {
            case '!help':
                dmChannel.send(help)
                return;
            case '!help sfx':
                dmChannel.send(`===SFX LIST=== ${logSFX(QUAN_SOUND_BOARD)}`);
                return;
            case '!help music':
                dmChannel.send(`===MUSIC LIST=== ${logSFX(QUAN_MUSIC)}`);
                return;
        }

        if(messageContent.toLowerCase().startsWith('!sfx')) {
            const command = messageContent.substring(5);
            const SFXPath = QUAN_SOUND_BOARD.get(command.toLowerCase());
            if(SFXPath) {
                voiceConnection.play(SFXPath);
            } else {
                dmChannel.send(`Sound effect'${command}' not found. Type "!help sfx" for a list of sound effects.`);
            }
            return;
        }

        if(messageContent.toLowerCase().startsWith('!music')) {
            const command = messageContent.substring(7);
            const musicPath = QUAN_MUSIC.get(command.toLowerCase());
            if(musicPath) {
                voiceConnection.play(musicPath);
            } else {
                dmChannel.send(`Sound effect '${command}' not found. Type "!help sfx" for a list of sound effects.`);
            }
            return;
        }

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
!help sfx: lists all sfx
!help music: lists all music
!music [music]: play desired music
!sfx [sound effect]: plays desired sound effect
`;

export const RESTRICTED_QUAN_DM_COMMANDS = [
    '!help sfx',
    '!help music'
]

export const RESTRICTED_QUAN_DM_PREFIXES = [
    '!music',
    '!sfx'
]