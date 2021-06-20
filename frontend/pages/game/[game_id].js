import { useRouter } from 'next/router'
import GameBoard from '../../components/GameBoard'
import { supabase } from '../../utils/supabaseClient'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Game = ({current_state}) => {
  const router = useRouter()
  const { game_id } = router.query

  const onEmptyCellClickHandler = async (event) => {
    event.preventDefault();
    const cellNumber = event.target["id"].replace("box-", "");
    const res = await fetch(`/api/game/${game_id}/place`, {
      body: JSON.stringify({
        cell_number: cellNumber,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
    const result = await res.json();
    if(res.status !== 200) {
      alert(`ERROR: ${result.error}`);
      console.log(`Error: ${result}`);
    } else {
      console.log(`Success! ${res.data}`);
    }
  }
  return <GameBoard currState={current_state} onEmptyCellClickHandler={onEmptyCellClickHandler}/>;
}

export async function getServerSideProps(context) {
  const currState = {
    tiles: ['x','o','x','','','','','',''],
  }
  const { game_id } = context.params;
  let { data: games, error } = await supabase
    .from('games')
    .select("current_state")
    .eq('id', game_id)
  if(error !== null) {
    // TODO: handle error better
    console.log(error);
  } else if(games.length > 1) {
    console.log('error querying for current game state');
  }
  const { current_state } = games[0];
  return {
    props: {current_state}, // will be passed to the page component as props
  }
}

export default Game
