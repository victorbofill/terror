const Discord = require('discord.js');

import { QuanServer } from './quan/server';
import { TheBoysServer } from './the boys/server';

import { SERVER_IDS } from './common/consts';

// const quan = new QuanServer(SERVER_IDS.QUAN);
const theBoys = new TheBoysServer(SERVER_IDS.THE_BOYS);

load();

async function load() {
    // quan.initiateClient(SERVER_IDS.QUAN);
    theBoys.initiateClient();
}