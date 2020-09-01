import { IENV } from './defs/defs';
import { rebootClient } from '../bot';

export function loadErrorHandler(ENV: IENV) {
    ENV.CLIENT.on('error', async error => {
        console.log('ERROR: ', error.message);

        try {
            ENV.VICTOR_DM.send(`Error with discord: ${error.message}`);
        } catch {
            console.log('DM to Victor failed.')
        }
        
        await rebootClient();
    });
}