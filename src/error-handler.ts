import { IENV } from './defs/defs';
import { MEMBER_IDS } from '../env';
import { initiateClient } from './bot';

export function loadErrorHandler(ENV: IENV) {
    ENV.CLIENT.on('error', async error => {
        console.log('ERROR: ', error.message);

        try {
            ENV.VICTOR_DM.send(`Error with discord: ${error.message}`);
        } catch {
            console.log('DM to Victor failed.')
        }
    });

    if(!ENV.ERROR_HAS_REPEATED) {
        ENV.ERROR_HAS_REPEATED = true;
        initiateClient();
    } else {
        console.log('Error has repeated. Manual attention required.');
    }
}