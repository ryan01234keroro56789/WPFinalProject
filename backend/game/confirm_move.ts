import {GameNotFoundError, UserNotInGameError, NotCurrentPlayerError} from '../game/error';
import {GameModel} from '../models/game';
import {makeMove} from '../board/make_move';
import {Color, toMove} from '../board/models';
import {GameView} from '../views/game';
import {MoveView} from '../views/move';
import {WebSocketConnection} from '../websocket/web_socket_connection';

export async function confirmMove(username: string, gameId: number, source: number, destination: number): Promise<void> {
  const game = await GameModel.findOne({gameId});
  if(!game) {
    throw new GameNotFoundError;
  }
  const index = game.players.indexOf(username);
  if(index === -1) {
    throw new UserNotInGameError;
  }
  if(index !== game.currentPlayer) {
    throw new NotCurrentPlayerError;
  }
  const color = (game.blackPlayer === index ? Color.BLACK : Color.RED);
  const move = makeMove(game, color, toMove(source, destination), username);
  game.currentPlayer ^= 1;
  await game.save();
  WebSocketConnection.broadcastMakeMove(gameId, new GameView(game), new MoveView(move));
}
