const fs = require('fs');

const workingDir = process.cwd();
const sfxDir = workingDir + '\\sfx'

export const QUAN_MUSIC = new Map();

export function loadQuanMusic() {
    const musicDir = `${sfxDir}\\music`;

    fs.readdir(musicDir, (err, items) => {
        if(items?.length) {
            for (const sfx of items) {
                const command: string = sfx.split('.')[0];
                const file: string = `${musicDir}\\${sfx}`;
                QUAN_MUSIC.set(command, file)
            }
        }
    });
}

export const QUAN_SOUND_BOARD = new Map();

export function loadQuanSounds() {
    const soundBoardDir = `${sfxDir}\\sound-board`;

    fs.readdir(soundBoardDir, (err, items) => {
        if(items?.length) {
            for (const sfx of items) {
                const command: string = sfx.split('.')[0];
                const file: string = `${soundBoardDir}\\${sfx}`;
                QUAN_SOUND_BOARD.set(command, file)
            }
        }
    });
}