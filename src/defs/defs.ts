import {
    Client,
    VoiceChannel,
    DMChannel
} from 'discord.js';

export interface IENV {
    CLIENT: Client;
    GENERAL_VOICE_CHANNEL: VoiceChannel,
    QUIET_PLACE_VOICE_CHANNEL: VoiceChannel,
    VICTOR_DM: DMChannel,
    ERROR_HAS_REPEATED: boolean
}