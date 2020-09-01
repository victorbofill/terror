import {
    VoiceChannel,
    DMChannel
} from 'discord.js';
import { IENV } from '../../common/defs';

export interface IBoysENV extends IENV {
    GENERAL_VOICE_CHANNEL: VoiceChannel,
    QUIET_PLACE_VOICE_CHANNEL: VoiceChannel,
    VICTOR_DM: DMChannel,
}