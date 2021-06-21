import { supabase } from '../../utils/supabaseClient'

export default async function handler(req, res) {
  if(req.method === 'POST') {
    const { user_id } = req.body;
    console.log(user_id);
    let { data: game_queue, error } = await supabase
      .from('game_queue')
      .select('*')
      .is('game_id', null)
      .neq('user_id', user_id)
      .order('id', { ascending: true })

    console.log(game_queue)
    if(game_queue.length > 0) {
      const { id: game_queue_id, user_id: other_user_id } = game_queue[0];
      const currState = {
        tiles: ['','','','','','','','',''],
      };
      // someone waiting in game_queue
      let { data, error } = await supabase
        .from('games')
        .insert([{current_state: currState, player_1: user_id, player_2: other_user_id }]);
      console.log(`People in queue ${data}`);
      if(error !== null) {
        // TODO: handle better
        console.log(error)
        res.status(500).json({error: error});
        return
      } else if(data.length == 0) {
        res.status(500).json({error: 'error creating game'});
        return
      }
      const { id: game_id } = data[0]
      let { data: queue_data, error: queue_error } = await supabase
        .from('game_queue')
        .update({ game_id: game_id })
        .eq('id', game_queue_id)
      if(queue_error !== null) {
        // TODO: handle better
        console.log(queue_error)
        res.status(500).json({error: queue_error});
        return
      }
      res.status(200).json({game_id})
    } else {
      // no one in queue
      let { data, error } = await supabase
        .from('game_queue')
        .insert([{user_id: user_id }]);
      console.log(`No one in queue ${data}`);
      if(error !== null) {
        // TODO: handle better
        console.log(error)
        res.status(500).json({error: error});
        return
      } else if(data.length == 0) {
        res.status(500).json({error: 'error joining on game queue'});
        return
      }
      const { id: game_queue_id } = data[0];
      res.status(200).json({game_queue_id});
    }
  }
}
