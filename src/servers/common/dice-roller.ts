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

        // coin toss
        if(messageContent === '!cointoss') {
            let result: string;
            var prob1 = Math.floor(Math.random() * 2) + 1;
            var prob2 = Math.floor(Math.random() * 2) + 1;

            result = prob1 === prob2 ? 'Heads!' : 'Tails!';

            message.channel.send(result);
            return;
        }

        // dice roller
        if(messageContent.startsWith('!roll ')) {
            const rollInput = messageContent.slice(6);
            rollInput.replace(' ', '');
 
            let [numberOfDice, typeAndModifier]:any = rollInput.replace(' ', '').split('d');
            let error = `I'm sorry, I couldn't parse that as a dice roll :\\ Expected format is #d#.`;

            if(!numberOfDice || !typeAndModifier) {
                message.channel.send(error);
                return;
            }

            let operator: string;
            if(typeAndModifier.includes('+')) operator = '+';
            if(typeAndModifier.includes('-')) operator = '-';

            let [type, modifier]:any = typeAndModifier.split(operator);

            if(modifier && typeof modifier !== 'number' ) {
                message.channel.send(error);
                return;
            }

            let n = parseInt(numberOfDice);
            type = parseInt(type);

            if(n === NaN || n === 0 || type === NaN || type === 0) {
                message.channel.send(error);
                return;
            }

            let highestResult: any = 0;
            const results: any[] = [];
            let sum: any = 0;
            let successes: number = 0;
            let successDisplay: string = '';
            let crits: number = 0;
            let critDisplay: string = '';
            let modifiedHighest: string = '';
            let modifiedSum: string = '';

            while(n) {
                const result = Math.floor(Math.random() * type + 1);
                highestResult = result > highestResult ? result : highestResult;
                results.push(result);
                sum += result;
                if(result > 5 && type === 10 && serverID === SERVER_IDS.THE_BOYS) successes++
                result === 10 && type === 10 && serverID === SERVER_IDS.THE_BOYS ? crits++ : n--
            }

            if(modifier) {
                modifiedHighest = `${highestResult} ${operator} ${modifier}`;
                highestResult = `${eval(modifiedHighest)} (${modifiedHighest})`;
                modifiedSum = `${sum} ${operator} ${modifier}`;
                sum = `${eval(modifiedSum)} (${modifiedSum})`;
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

            if(serverID === SERVER_IDS.THE_BOYS && type === 10) {
                successDisplay = `Successes: ${successes}     `;
                critDisplay = `Crits: ${crits}     \n`;

            }

            let response = `>>> == ${nickname}'s ${numberOfDice}d${type} results ==\n${successDisplay}${critDisplay}Highest: ${highestResult}     Sum: ${sum}     Results: [${results}]`;

            message.channel.send(response);
            return;
        }
    });
}