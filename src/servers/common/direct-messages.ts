import { ClientManager } from '../../clientManager/clientManager';
import { TERROR_ID } from '../../../env';
import { generateRollResult } from '../common/dice-roller';
import { RESTRICTED_THE_BOYS_DM_COMMANDS, RESTRICTED_THE_BOYS_DM_PREFIXES } from '../the-boys/direct-messages';
import { RESTRICTED_QUAN_DM_COMMANDS, RESTRICTED_QUAN_DM_PREFIXES } from '../quan/direct-messages';

export function loadCommonDirectMessagServices(clientManager: ClientManager) {
    sendDMResponse(clientManager);
}

export async function sendDMResponse(clientManager: ClientManager) {
    clientManager.getClient().on('message', async message => {
        if(
            message.channel.type !== 'dm'
            || message.author.id === TERROR_ID
        ) return;

        const dmChannel = message.channel;
        const messageContent = message.content.toLowerCase();

        console.log(`Message recieved from ${message.author.username}: "${messageContent}"`);

        switch(messageContent.toLowerCase()) {
            case '!help':
                dmChannel.send(help)
                return;
            case '!reboot':
                console.log(message.author.username, ' initated reboot.');
                await clientManager.rebootClient();
                return;
        }

        if(messageContent.toLowerCase().startsWith('!roll ')) {
            const response = await generateRollResult(messageContent, message);
            dmChannel.send(response);
            return;
        }

        if(
            dismissRestrictedCommands(messageContent, [RESTRICTED_THE_BOYS_DM_COMMANDS, RESTRICTED_QUAN_DM_COMMANDS])
            || dismissRestrictedPrefixes(messageContent, [RESTRICTED_THE_BOYS_DM_PREFIXES, RESTRICTED_QUAN_DM_PREFIXES])
        ) return;

        dmChannel.send(`'${messageContent}' is not a command. Type !help for help.`)
    });
}

const help: string = `== COMMON HELP MENU ==
!roll #d#[+/- #]: rolls dice for you. The first # is how many to roll, second is type of die [optional: + or - a third number]
!reboot: reboots Terror. If this doesn't fix bugs, let Victor know
`;

export const RESTRICTED_COMMON_DM_COMMANDS = [
    '!reboot'
]

export const RESTRICTED_COMMON_DM_PREFIXES = [
    '!roll '
]

export function dismissRestrictedCommands(command: string, restrictedCommands: any[]): boolean {
    let isRestricted = false;
    restrictedCommands.forEach(list => {
        list.forEach(restrictedCommand => {
            switch(command) {
                case `${restrictedCommand}`: isRestricted = true;
            }
        });
    });
    return isRestricted;
}

export function dismissRestrictedPrefixes(command: string, restrictedPrefixes: any[]): boolean {
    let isRestricted = false;
    restrictedPrefixes.forEach(list => {
        list.forEach(restrictedPrefix => {
            if(command.startsWith(restrictedPrefix)) isRestricted =  true;
        });
    });
    return isRestricted;
}