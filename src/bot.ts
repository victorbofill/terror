const Discord = require('discord.js');
import { ClientManager } from './clientManager/clientManager';

export async function initiateBot() {
    const clientManager = await new ClientManager();
    await clientManager.init();

    clientManager.mClient.on('ready', async () => {
        clientManager.onClientReady();
    });
}

initiateBot();