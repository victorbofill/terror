import { VoiceConnection, VoiceChannel } from 'discord.js';
import { IServer } from '../../common/defs';

export interface IQuanServer extends IServer {
    mQuanVoiceConnection: VoiceConnection;
    mQuanVoiceChannel: VoiceChannel;
}