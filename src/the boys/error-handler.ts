export function loadErrorHandler() {
    this.mENV.CLIENT.on('error', async error => {
        console.log('ERROR: ', error.message);

        try {
            this.mENV.VICTOR_DM.send(`Error with discord: ${error.message}`);
        } catch {
            console.log('DM to Victor failed.')
        }
        
        await this.rebootClient();
    });
}