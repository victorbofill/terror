import { VoiceConnection } from 'discord.js';
import { IENV } from './defs/defs';
import { SOUND_BOARD } from './sfx';
import { TERROR_ID, MEMBER_IDS } from '../env';
import { initiateClient, disconnectClient } from './bot';

export function loadDirectMessagServices(ENV, generalVoiceConnection) {
    sendDMResponse(ENV, generalVoiceConnection);
}

export async function sendDMResponse(ENV: IENV, generalVoiceConnection: VoiceConnection) {
    ENV.CLIENT.on('message', async message => {
        const messageContent = message.content.toLowerCase();
        const dmChannel = message.channel;
        if(dmChannel.type === 'dm' && message.author.id !== TERROR_ID) {
            console.log(`Message recieved from ${message.author.username}: "${messageContent}"`);

            switch(messageContent.toLowerCase()) {
                case '!help':
                    dmChannel.send(help)
                    return;
                case '!help sfx':
                    dmChannel.send(`===SFX LIST=== ${logSFX(SOUND_BOARD)}`);
                    return;
                case '!reboot':
                    if(message.author.id === MEMBER_IDS.VICTOR) {
                        await disconnectClient();
                        await initiateClient();

                        const victor = await ENV.CLIENT.users.fetch(MEMBER_IDS.VICTOR);
                        const victorDM = await victor.createDM();
                        victorDM.send('Bootup complete.');
                
                        return;
                    }
                    dmChannel.send(`'${messageContent}' is not a command. Type !help for help.`);
                    return;
            }

            if(messageContent.toLowerCase().startsWith('!sfx ')) {
                const command = messageContent.substring(5);
                const SFXPath = SOUND_BOARD.get(command.toLowerCase());
                if(SFXPath) {
                    generalVoiceConnection.play(SFXPath);
                } else {
                    dmChannel.send(`Sound effect '${command}' not found. Type "!help sfx" for a list of sound effects.`);
                }
                return;
            }

            dmChannel.send(`'${messageContent}' is not a command. Type !help for help.`)
        }
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
!sfx [sound effect]: plays desired sound effect`;