import { useRouter } from 'next/router'
import GameBoard from '../../components/GameBoard'
import { supabase } from '../../utils/supabaseClient'
import { useState } from 'react';
import { computer_uuid } from '../api/game'
import { calculateTurn, calculateWinner } from '../api/game/[game_id]/place'

const Game = ({ current_state, player_1, player_2 }) => {
  const [currState, setCurrState] = useState(current_state);
  const [subscription, setSubscription] = useState();
  const router = useRouter()
  const { game_id } = router.query

  if(!subscription) {
    const games = supabase
      .from(`games:id=eq.${game_id}`)
      .on('*', payload => {
        const { new: { current_state: newCurrState } } = payload;
        setCurrState(newCurrState);
      })
      .subscribe()
    setSubscription(games);
  }

  const onEmptyCellClickHandler = async (event) => {
    event.preventDefault();
    const user = supabase.auth.user()
    const cellNumber = event.target["id"].replace("box-", "");
    const res = await fetch(`/api/game/${game_id}/place`, {
      body: JSON.stringify({
        cell_number: cellNumber,
        user_id: user.id,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
    const result = await res.json();
    if(res.status !== 200) {
      // TODO: manage this better.
      alert(`ERROR: ${result.error}`);
      console.log(`Error: ${result}`);
    }
  }

  const { tiles } = currState;
  const { currPlayer, currTile } = calculateTurn(tiles, player_1, player_2);
  const winner = calculateWinner(tiles, player_1, player_2);

  if(winner === null && currPlayer === computer_uuid) {
    playComputerTurn(game_id, tiles);
  }

  return <GameBoard currState={currState} onEmptyCellClickHandler={onEmptyCellClickHandler} winner={winner}/>;
}

export async function getServerSideProps(context) {
  const { game_id } = context.params;
  let { data: games, error } = await supabase
    .from('games')
    .select("*")
    .eq('id', game_id)
  if(error !== null) {
    // TODO: handle error better
    console.log(error);
  } else if(games.length > 1) {
    console.log('error querying for current game state');
  }
  const { current_state, player_1, player_2 } = games[0];
  return {
    props: { current_state, player_1, player_2 }, // will be passed to the page component as props
  }
}

async function playComputerTurn(game_id, tiles) {
  console.log('trying to play computer turn');
  await new Promise(resolve => setTimeout(resolve, 1000));
  const cellNumber = tiles.reduce((tileNum, currVal, index) => {
    if(tileNum !== -1) {
      return tileNum
    }
    if(currVal === '') {
      return index
    }
    return tileNum
  }, -1)

  if(cellNumber !== -1) {
    const res = await fetch(`/api/game/${game_id}/place`, {
      body: JSON.stringify({
        cell_number: cellNumber,
        user_id: computer_uuid,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
    const result = await res.json();
    if(res.status !== 200) {
      // TODO: manage this better.
      alert(`Error playing computer turn: ${result.error}`);
      console.log(`Error playing computer turn: ${result}`);
    }
  }
}

export default Game
