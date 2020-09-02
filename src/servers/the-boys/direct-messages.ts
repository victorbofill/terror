import { VoiceConnection } from 'discord.js';
import { ClientManager } from '../../clientManager/clientManager';
import { SOUND_BOARD } from './sfx';
import { TERROR_ID } from '../../../env';

export function loadDirectMessagServices(voiceConnection: VoiceConnection, clientManager: ClientManager) {
    sendDMResponse(voiceConnection, clientManager);
}

export async function sendDMResponse(voiceConnection: VoiceConnection, clientManager: ClientManager) {
    clientManager.getClient().on('message', async message => {
        if(!(
            message.channel.type === 'dm'
            && message.author.id !== TERROR_ID
            && clientManager.mBoysMembers.includes(message.author.id)
        )) return;

        const dmChannel = message.channel;
        const messageContent = message.content.toLowerCase();

        console.log(`Message recieved from ${message.author.username}: "${messageContent}"`);

        switch(messageContent.toLowerCase()) {
            case '!help':
                dmChannel.send(help)
                return;
            case '!help sfx':
                dmChannel.send(`===SFX LIST=== ${logSFX(SOUND_BOARD)}`);
                return;
            case '!reboot':
                console.log(message.author.username, ' initated reboot.');
                await clientManager.rebootClient();
                return;
        }

        if(messageContent.toLowerCase().startsWith('!sfx ')) {
            const command = messageContent.substring(5);
            const SFXPath = SOUND_BOARD.get(command.toLowerCase());
            if(SFXPath) {
                voiceConnection.play(SFXPath);
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

const help: string = `== HELP MENU ==
!help sfx: lists all sfx
!sfx [sound effect]: plays desired sound effect
!reboot: reboots Terror. If this doesn't fix bugs, let Victork now
`;