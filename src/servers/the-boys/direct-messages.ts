import { VoiceConnection } from 'discord.js';
import { ClientManager } from '../../clientManager/clientManager';
import { THE_BOYS_SOUND_BOARD } from '../the-boys/sfx';
import { TERROR_ID } from '../../../env';
import { RESTRICTED_QUAN_DM_COMMANDS, RESTRICTED_QUAN_DM_PREFIXES } from '../quan/direct-messages';
import {
    dismissRestrictedCommands,
    dismissRestrictedPrefixes,
    RESTRICTED_COMMON_DM_COMMANDS,
    RESTRICTED_COMMON_DM_PREFIXES
} from '../common/direct-messages';

export function loadTheBoysDirectMessagServices(voiceConnection: VoiceConnection, clientManager: ClientManager) {
    sendDMResponse(voiceConnection, clientManager);
}

export async function sendDMResponse(voiceConnection: VoiceConnection, clientManager: ClientManager) {
    clientManager.getClient().on('message', async message => {
        if(
            message.channel.type !== 'dm'
            || message.author.id === TERROR_ID
            || !(clientManager.mBoysMembers.includes(message.author.id))
        ) return;

        const dmChannel = message.channel;
        const messageContent = message.content.toLowerCase();

        console.log(`Message recieved from ${message.author.username}: "${messageContent}"`);

        switch(messageContent.toLowerCase()) {
            case '!help':
                dmChannel.send(help)
                return;
            case '!help sfx':
                dmChannel.send(`===SFX LIST=== ${logSFX(THE_BOYS_SOUND_BOARD)}`);
                return;
        }

        if(messageContent.toLowerCase().startsWith('!sfx ')) {
            const command = messageContent.substring(5);
            const SFXPath = THE_BOYS_SOUND_BOARD.get(command.toLowerCase());
            if(SFXPath) {
                voiceConnection.play(SFXPath);
            } else {
                dmChannel.send(`Sound effect '${command}' not found. Type "!help sfx" for a list of sound effects.`);
            }
            return;
        }

        if(
            dismissRestrictedCommands(messageContent, [RESTRICTED_QUAN_DM_COMMANDS, RESTRICTED_COMMON_DM_COMMANDS])
            || dismissRestrictedPrefixes(messageContent, [RESTRICTED_QUAN_DM_PREFIXES, RESTRICTED_COMMON_DM_PREFIXES])
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

const help: string = `== THE BOYS HELP MENU ==
!help sfx: lists all sfx
!sfx [sound effect]: plays desired sound effect
`;

export const RESTRICTED_THE_BOYS_DM_COMMANDS = [
    '!help sfx']

export const RESTRICTED_THE_BOYS_DM_PREFIXES = [
    '!sfx '
]