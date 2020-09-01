const Discord = require('discord.js');
import { ClientManager } from './clientManager/clientManager';

export async function initiateBot() {
    const clientManager = await new ClientManager();
    await clientManager.init();
}

initiateBot();