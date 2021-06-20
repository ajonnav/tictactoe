import { supabase } from '../../../../utils/supabaseClient'

export default async function handler(req, res) {
  if(req.method === 'POST') {
    const { game_id } = req.query;
    console.log(`game ID ${game_id}`);

    let { data: games, error } = await supabase
      .from('games')
      .select("current_state")
      .eq('id', game_id)
    if(error !== null) {
      // TODO: handle error better
      console.log(error);
      return
    }
    const { cell_number } = req.body;
    if(games.length > 1) {
      res.status(500).json({error: 'error querying for current game state'});
      return
    }
    const { current_state, current_state: { tiles } } = games[0];
    console.log(games);
    if(tiles[cell_number] === '') {
      console.log(`Can place tile at ${cell_number}`);
      tiles[cell_number] = 'o';
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
      res.status(400);
    }
  }
}
