/**
 * NOT CURRENTLY BEING USED
 */

import { IENV } from './defs/defs';

export function loadMessageServices(ENV: IENV) {
    reactToKeywords(ENV);
}

export function reactToKeywords(ENV: IENV) {
    ENV.CLIENT.on('message', message => {
    });
}