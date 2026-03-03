import WebSocketService from './WebSocketService';
import { WS_SERVER_URL } from '../../config/env';

const webSocketService = new WebSocketService(WS_SERVER_URL);

export default webSocketService;
