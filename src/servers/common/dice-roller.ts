import { Message, GuildMember } from 'discord.js';
import { ClientManager } from '../../clientManager/clientManager';
import { BOTTIE_ID, SERVER_IDS, CHAT_CHANNEL_IDS } from '../../../env';

export function loadDiceRoller(clientManager: ClientManager, serverID: SERVER_IDS) {
    sendRollResult(clientManager, serverID);
}

export function sendRollResult(clientManager: ClientManager, serverID: SERVER_IDS): void {
    const channelID = CHAT_CHANNEL_IDS.get(serverID).DICE_CHANNEL;
    clientManager.getClient().on('message', async message => {
        if(
            message.channel.id !== channelID
            || message.author.id === BOTTIE_ID
        ) return;

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
            const response = await generateRollResult(messageContent, message, serverID);

            message.channel.send(response);
            return;
        }
    });
}

export async function generateRollResult(messageContent: string, message: Message, serverID?: string): Promise<string> {
    // remove !roll from the message
    const rollInput = messageContent.slice(6);
    // remove all spaces, if any
    rollInput.replace(' ', '');

    let [numberOfDice, typeAndModifier]:any = rollInput.replace(' ', '').split('d');
    let error = `I'm sorry, I couldn't parse that as a dice roll :\\ Expected format is #d#[+/- #].`;

    if(!numberOfDice || !typeAndModifier) {
        message.channel.send(error);
        return;
    }

    let operator: string;
    if(typeAndModifier.includes('+')) operator = '+';
    if(typeAndModifier.includes('-')) operator = '-';

    let [type, modifier]:any = typeAndModifier.split(operator);
    modifier = parseInt(modifier);

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
    let modifiedHighest: string = '';
    let modifiedSum: string = '';
    let critCount: number = 0;
    let critSum: number = 0;
    let critDisplay: string = '';

    // roll as many dice as requested
    while(n) {
        // roll the die type requested
        const result = Math.floor(Math.random() * type + 1);
        // track the highest result
        highestResult = result > highestResult ? result : highestResult;
        // track all results
        results.push(result);
        // track sum of all rolls
        sum += result;
        // if playing Vampire, track successes
        if(result > 5 && type === 10) successes++
        // if playing Vampire, track critical successes
        result === 10 && type === 10 ? critCount++ : n--;
    }

    // sort the results from least to greatest
    results.sort((a,b) => { return a - b });

    // if a modifier exists, process it
    if(modifier) {
        // create the expression of the modifiedHighest
        modifiedHighest = `${highestResult} ${operator} ${modifier}`;
        // convert the expression into a number and record the result as a string
        highestResult = `${eval(modifiedHighest)} (${modifiedHighest})`;
        
        // create the expression of the modifiedSum
        modifiedSum = `${sum} ${operator} ${modifier}`;
        // convert the expression into a number and record the result as a string
        sum = `${eval(modifiedSum)} (${modifiedSum})`;
    }

    // if there are more than 10 results, reduce the length to 9 for display purposes
    if(results.length > 10) {
        results.length = 9;
        results.push('...');
    }

    if(!results.length || highestResult === 0 || sum === 0) {
        message.channel.send(error);
        return;
    }

    let nickname: string = 'Your';

    // retrieve the user's name, if possible
    if(serverID) {
        const user: GuildMember = await message.guild.members.fetch(message.author.id);
        nickname = user.nickname ? user.nickname : message.author.username;
        nickname += `'s`;
    };

    // if playing Vampire, include successes in the display
    if(type === 10) {
        successDisplay = `Successes: ${successes}     `;
    }

    // if playing Quan, calculate crits
    if(type === 12 && results.includes(12)) {
        // create a temporary array to use
        const resultsIterator: any[] = Array.from(results);
        critSum = 12;
        // as long as another 12 exists, continue iterating
        while(resultsIterator.length && resultsIterator.includes(12)) {
            resultsIterator.length --
            critSum += resultsIterator[resultsIterator.length - 1];
        }
        // once complete, include the modifier if it exists
        if(modifier) critSum += modifier;
    }

    // if there is a critSum, include it in the display
    if(critSum > 0) {
        critDisplay += `Crit!! ${critSum}`;
    }

    // if there is a critCount, include it in the display
    if(critCount > 0) {
        critDisplay += `Crits: ${critCount}`;
    }

    return `>>> == ${nickname} ${rollInput} results ==\n${successDisplay}${critDisplay}\n Highest: ${highestResult}     Sum: ${sum}     Results: [${results}]`;
}