import { supabase } from '../../../../utils/supabaseClient'

export default async function handler(req, res) {
  if(req.method === 'POST') {
    const { game_id } = req.query;
    console.log(`game ID ${game_id}`);

    let { data: games, error } = await supabase
      .from('games')
      .select("*")
      .eq('id', game_id)
    if(error !== null) {
      // TODO: handle error better
      console.log(error);
      return
    }
    const { cell_number, user_id } = req.body;
    if(games.length > 1) {
      res.status(500).json({error: 'error querying for current game state'});
      return
    }
    const { current_state, current_state: { tiles }, player_1, player_2 } = games[0];
    const { currPlayer, currTile } = calculateTurn(tiles, player_1, player_2);
    const currWinner = calculateWinner(tiles, player_1, player_2);
    if(tiles[cell_number] === '' && user_id === currPlayer && currWinner === null) {
      console.log(`Can place tile at ${cell_number}`);
      tiles[cell_number] = currTile;
      const winner = calculateWinner(tiles, player_1, player_2);
      current_state.tiles = tiles;
      const { data, error: updateError } = await supabase
        .from('games')
        .update({ current_state: current_state })
        .eq('id', game_id)
      if(updateError !== null) {
          // TODO: handle error better
          res.status(500).json({error: 'error updating game state'});
          return
      }
      res.status(200).json(data);
    } else {
      console.log(`CANNOT place tile at ${cell_number}`);
      res.status(200).json({});
    }
  }
}

export function calculateTurn(tiles, player_1, player_2) {
  return tiles.reduce((prevState, currVal) => {
    const { currPlayer, currTile } = prevState;
    if(currVal !== '') {
      if(currPlayer === player_1) {
        return { currPlayer: player_2, currTile: 'o' };
      } else {
        return { currPlayer: player_1, currTile: 'x' };
      }
    }
    return prevState;
  }, { currPlayer: player_1, currTile: 'x' })
}

export function calculateWinner(tiles, player_1, player_2) {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winningCombos.reduce((winningPlayer, currCombo) => {
    if(winningPlayer !== null) {
      return winningPlayer
    }
    const [a, b, c] = currCombo;
    if(tiles[a] === tiles[b] && tiles[a] === tiles[c] && tiles[a] !== '') {
      return tiles[a] === 'x' ? player_1 : player_2
    }
    return null
  }, null);
}
