import { SERVER_IDS } from '../../../env';
import { IClientManager } from '../../clientManager/clientManager-defs';
import { ClientManager } from '../../clientManager/clientManager';

export interface IServer {
    mClientManager: IClientManager;
    mServerID: SERVER_IDS;

    init(clientManager: ClientManager, serverID: SERVER_IDS ): void;
};