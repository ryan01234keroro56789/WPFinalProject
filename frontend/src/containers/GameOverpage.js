import ConfirmButton from "../components/ConfirmButton";
import Title from "../components/Title";
import { Button } from "antd";
import { useState, useEffect } from "react";
import Gamepage from "./Gamepage";
import "./button.css"
import { useWebsocket, ConnectionState, WebSocketState } from '../useWebsocket';

const GameOverpage = ({winPlayer, isTie}) => {

  const {state, sendConnectionState} = useWebsocket({});

  useEffect(() => {
    if (state === WebSocketState.OPEN) {
      sendConnectionState(ConnectionState.MAIN);
    }
  }, [state]);
  
  const myStyle = {
    backgroundImage: "url('https://pic.52112.com/180317/180317_143/n4SNygWU7T_small.jpg')",
    backgroundSize: 'contain',
    height: '720px',
  };

  const [reverse, setReverse] = useState(false)

  const handleOnClick = () => {
    setReverse(true);
  }

  if(reverse) {
    return (
      <Gamepage></Gamepage>
    )
  }

  else {
    return (
      <div className="GameOverpage" style={myStyle}>
        <Title>
          <h1>遊戲結束</h1>
        </Title>
        { isTie ? 
        <Title>
          <h1>平手</h1>
        </Title> :
        <Title>
          <h1>恭喜{winPlayer}獲勝</h1>
        </Title>
        }
        <ConfirmButton>
          <Button onClick={handleOnClick}>返回</Button>
        </ConfirmButton>
      </div>
    )
  }
}

export default GameOverpage;
