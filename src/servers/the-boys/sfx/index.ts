const fs = require('fs');

const workingDir = process.cwd();
const sfxDir = workingDir + '\\sfx'

const introDir = `${sfxDir}\\intros`
export const ENTRANCE_SFX = {
    DEAN: `${introDir}\\bong.m4a`,
    VICTOR: `${introDir}\\wuba.wav`,
    JACY: `${introDir}\\civ.mp3`,
    KASEY: `${introDir}\\kasey.m4a`,
    SAM: `${introDir}\\halo.mp3`,
    AUSTIN: `${introDir}\\mattress.mp3`
}

const serverDir = `${sfxDir}\\server`
export const SERVER_SFX = new Map([
    [`don't touch me`, `${serverDir}\\don't touch me.mp3`],
    ['he dead', `${serverDir}\\he dead.mp3`]
]);

export const THE_BOYS_SOUND_BOARD = new Map();

export function loadTheBoysSounds() {
    const soundBoardDir = `${sfxDir}\\sound-board`;

    fs.readdir(soundBoardDir, (err, items) => {
        if(items?.length) {
            for (const sfx of items) {
                const command: string = sfx.split('.')[0];
                const file: string = `${soundBoardDir}\\${sfx}`;
                THE_BOYS_SOUND_BOARD.set(command, file)
            }
        }
    });
}