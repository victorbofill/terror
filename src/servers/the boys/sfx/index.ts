const fs = require('fs');

const introDir = `${__dirname}\\intros`
export const ENTRANCE_SFX = {
    DEAN: `${introDir}\\bong.m4a`,
    VICTOR: `${introDir}\\wuba.wav`,
    JACY: `${introDir}\\civ.mp3`,
    KASEY: `${introDir}\\kasey.m4a`,
    SAM: `${introDir}\\halo.mp3`,
    AUSTIN: `${introDir}\\mattress.mp3`
}

const serverDir = `${__dirname}\\server`
export const SERVER_SFX = new Map([
    [`don't touch me`, `${serverDir}\\don't touch me.mp3`],
    ['he dead', `${serverDir}\\he dead.mp3`]
]);

export const SOUND_BOARD = new Map();

export function loadSounds() {
    const soundBoardDir = `${__dirname}\\sound-board`;

    fs.readdir(soundBoardDir, (err, items) => {
        if(items?.length) {
            for (const sfx of items) {
                const command: string = sfx.split('.')[0];
                const file: string = `${soundBoardDir}\\${sfx}`;
                SOUND_BOARD.set(command, file)
            }
        }
    });
}