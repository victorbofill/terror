import { VoiceConnection } from 'discord.js';
import { IServer } from '../../common/defs'

export interface IBoysServer extends IServer {
    mGeneralVoiceConnection: VoiceConnection;
    mQuietPlaceConnection: VoiceConnection;
}