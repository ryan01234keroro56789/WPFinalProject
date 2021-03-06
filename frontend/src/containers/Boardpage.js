import Board from "../components/Board";
import cover from "../chessPieces/cover.png";
import { useState, useEffect } from "react";
import { useWebsocket, ConnectionState, WebSocketState } from '../useWebsocket';
import bc from "../chessPieces/bc.png";
import bg from "../chessPieces/bg.png";
import bk from "../chessPieces/bk.png";
import bm from "../chessPieces/bm.png";
import bn from "../chessPieces/bn.png";
import bp from "../chessPieces/bp.png";
import br from "../chessPieces/br.png";
import rc from "../chessPieces/rc.png";
import rg from "../chessPieces/rg.png";
import rk from "../chessPieces/rk.png";
import rm from "../chessPieces/rm.png";
import rn from "../chessPieces/rn.png";
import rp from "../chessPieces/rp.png";
import rr from "../chessPieces/rr.png";
import empty from "../chessPieces/empty.png";
import "./Select.css";
import { firstClickApi, secondClickApi } from "../api";
import Title from "../components/Title";
import GameOverpage from "./GameOverpage";
import "./button.css"
import { InvalidDestinationSelectionError, InvalidSourceSelectionError, NoPossibleDestinationError, RequireLoginError, InternalServerError, NotYourTurnError } from "../error";

const chessImage = [bk, bg, bm, br, bn, bc, bp, rk, rg, rm, rr, rn, rc, rp, cover, empty];

const BoardPage = ({username, player1, player2, roomID, gameId, firstPlayer}) => {

  const [source, setSource] = useState(-1);

  const myStyle = {
    backgroundImage: "url('https://pic.52112.com/180317/180317_143/n4SNygWU7T_small.jpg')",
    backgroundSize: 'contain',
    height: '720px',
  };

  const blocks = {
    height: '75px',
    width: '75px',
    border: '2px solid black',
    alignItems: 'center',
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'center',
  }

  const [board, setBoard] = useState(new Array(32).fill(14));
  const [firstClicked, setFirstClicked] = useState(false);
  const [nowPlayer, setNowPlayer] = useState(firstPlayer);
  const [player1Color, setPlayer1Color] = useState(rk);
  const [player2Color, setPlayer2Color] = useState(bk);
  const [won, setWon] = useState(false);
  const [tie, setTie] = useState(false);
  const [winPlayer, setWinPlayer] = useState("")
  const [currentElement, setCurrentElement] = useState(null);

  const UnSelectThis = (thisElement) => {
    thisElement.classList.remove("selected");
    setCurrentElement(null);
  };

  const SelectThis = (thisElement) => {
    if(currentElement) {
      UnSelectThis(currentElement);
    }
    thisElement.classList.add("selected");
    setCurrentElement(thisElement);
  };


  const handleMakeMove = (game, move) => {
    setBoard(game.board)
    setNowPlayer(game.players[game.currentPlayer])
    if (game.players[game.blackPlayer] === player1) {
      setPlayer1Color(bk);
      setPlayer2Color(rk);
    }
    else {
      setPlayer1Color(rk);
      setPlayer2Color(bk);
    }
    if (game.noFlipEatCount >= 60) {
      setTie(true);
    }
    if (game.winPlayer !== -1) {
      setWon(true);
      if (game.players[game.winPlayer] === player1) {
        setWinPlayer(player1);
      }
      else {
        setWinPlayer(player2);
      }
    }
  }

  const {state, sendConnectionState} = useWebsocket({handleMakeMove});
  useEffect(() => {
    if (state === WebSocketState.OPEN) {
      sendConnectionState(ConnectionState.GAME, gameId);
    }
  }, [state]);

  const handleOnClick = async (index, event) => {
    try {
      if(!firstClicked) {
        const {moves} = await firstClickApi(gameId, index);
        setFirstClicked(true);
        setSource(index);
        SelectThis(event.target);
      }
      else {
        await secondClickApi(gameId, source, index);
        setFirstClicked(false);
        setSource(-1);
        UnSelectThis(event.target);
      }
    } catch(error) {
      if(error instanceof InvalidDestinationSelectionError) {
        alert('Not a valid Destination!!!');
        setFirstClicked(false);
        setSource(-1);
        UnSelectThis(currentElement);
      }

      else if(error instanceof InvalidSourceSelectionError) {
        alert('Not a valid Source!!!');
      }

      else if(error instanceof NoPossibleDestinationError) {
        alert('No Possible Destination!!!');
      }

      else if(error instanceof RequireLoginError) {
        alert("Please Log In Again!!!");
      }

      else if(error instanceof InternalServerError) {
        console.log("Internal Server Error!!");
      }

      else if(error instanceof NotYourTurnError) {
        console.log("Not Your Turn!!!")
      }
    }
  }

  const test = {
    margin: '3px',
  }

  if(won || tie) {
    return (
      <GameOverpage winPlayer={winPlayer} isTie={tie}></GameOverpage>
    )
  }

  else {
    return (
      <div className="Boardpage" style={myStyle}>
        <Title>
          <h2>Unrated Game ({player1} vs {player2})</h2>
        </Title>
        <Title>
          <h3>Room ID: {roomID}</h3>
        </Title>
        <Title>
          <h3>It's {nowPlayer}'s turn</h3>
        </Title>
        <Title>
          <h3>{player1}: <img src = {player1Color}/>    {player2}: <img src={player2Color}/></h3>
        </Title>
        <Board>{board.map((chess_id, index) => (<div style = {blocks} key={index*100+chess_id}>
        <img src = {chessImage[chess_id]} onClick={(event) => {handleOnClick(index, event);}} style={test}/>
        </div>))}</Board>
      </div>
    )
  }
}

export default BoardPage;
