import { VoiceConnection, VoiceChannel } from 'discord.js';
import { IServer } from '../../common/defs'

export interface IBoysServer extends IServer {
    mGeneralVoiceConnection: VoiceConnection;
    mGeneralVoiceChannel: VoiceChannel;
    mQuietPlaceConnection: undefined;

}