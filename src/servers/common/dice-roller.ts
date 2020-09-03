import { ClientManager } from '../../clientManager/clientManager';
import { TERROR_ID, SERVER_IDS, CHAT_CHANNEL_IDS } from '../../../env';

export function loadDiceRoller(clientManager: ClientManager, serverID: SERVER_IDS) {
    sendDMResponse(clientManager, serverID);
}

export function sendDMResponse(clientManager: ClientManager, serverID: SERVER_IDS): void {
    const channelID = CHAT_CHANNEL_IDS.get(serverID).DICE_CHANNEL;
    clientManager.getClient().on('message', async message => {
        if(!(
            message.channel.id === channelID
            && message.author.id !== TERROR_ID
        )) return;

        const messageContent = message.content.toLowerCase();

        // dice roller
        if(messageContent.startsWith('!roll ')) {
            const rollInput = messageContent.slice(6);
            rollInput.replace(' ', '');
 
            let [numberOfDice, type]:any = rollInput.replace(' ', '').split('d');
            let error = `I'm sorry, I couldn't parse that as a dice roll :\\ Expected format is #d#.`;

            if(!numberOfDice || !type) {
                message.channel.send(error);
                return;
            }

            let n = parseInt(numberOfDice);
            type = parseInt(type);

            if(n === NaN || n === 0 || type === NaN || type === 0) {
                message.channel.send(error);
                return;
            }

            let highestResult: number = 0;
            const results: any[] = [];
            let sum: number = 0;
            let successes: number = 0;
            let successDisplay: string = '';
            let crits: number = 0;
            let critDisplay: string = '';

            while(n) {
                const result = Math.floor(Math.random() * type + 1);
                highestResult = result > highestResult ? result : highestResult;
                results.push(result);
                sum += result;
                if(result > 5 && type === 10 && serverID === SERVER_IDS.THE_BOYS) successes++
                result === 10 && type === 10 && serverID === SERVER_IDS.THE_BOYS ? crits++ : n--
            }

            if(results.length > 10) {
                results.length = 9;
                results.push('...');
            }

            if(!results.length || highestResult === 0 || sum === 0) {
                message.channel.send(error);
                return;
            }

            const user = await message.guild.members.fetch(message.author.id);
            const nickname: string = user.nickname ? user.nickname: message.author.username;

            if(serverID === SERVER_IDS.THE_BOYS) {
                successDisplay = `Successes: ${successes}     `;
                critDisplay = `Crits: ${crits}     \n`;

            }

            let response = `>>> == ${nickname}'s ${numberOfDice}d${type} results ==\n${successDisplay}${critDisplay}Highest: ${highestResult}     Sum: ${sum}     Results: [${results}]`;

            message.channel.send(response);
        }
    });
}