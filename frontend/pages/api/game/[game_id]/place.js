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
    console.log(`Tiles ${tiles}, ${tiles[cell_number]}`)
    console.log(`Players ${user_id}, ${currPlayer}`)
    if(tiles[cell_number] === '' && user_id === currPlayer) {
      console.log(`Can place tile at ${cell_number}`);
      tiles[cell_number] = currTile;
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
