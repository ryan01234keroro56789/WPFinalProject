import {WebSocket} from 'ws';
import {WebSocketConnection} from './web_socket_connection';
import {IncomingMessage} from 'http';

export async function onWssConnection(ws: WebSocket, req: IncomingMessage): Promise<void> {
  try {
    /*
    if(!hasAuth(req.headers)) {
      throw new Error('no authorization token');
    }
    const token = req.headers.authorization;
    const jwtPayload = readToken(token);
    if(!isUserToken(jwtPayload)) {
      throw new Error('invalid token content');
    }
    */
    WebSocketConnection.createConnection(ws);
  } catch(err: unknown) {
    ws.close();
  }
}
