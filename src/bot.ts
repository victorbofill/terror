const Discord = require('discord.js');
import { ClientManager } from './clientManager/clientManager';
import { TheBoysServer } from './servers/the boys/the-boys';
import { SERVER_IDS } from '../env';

async function initiateBot() {
    const clientManager = await new ClientManager();
    await clientManager.init();

    const theBoyseServer = new TheBoysServer();
    await theBoyseServer.init(clientManager, SERVER_IDS.THE_BOYS);
}

initiateBot();