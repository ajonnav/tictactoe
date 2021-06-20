import { supabase } from '../../utils/supabaseClient'

const computer_uuid = '2d3df715-ae42-4194-b390-4c7aae079782';

export default async function handler(req, res) {
  if(req.method === 'POST') {
    const { user_id } = req.body;
    console.log(user_id);
    const currState = {
      tiles: ['','','','','','','','',''],
    };
    const { data, error } = await supabase
      .from('games')
      .insert([{current_state: currState, player_1: user_id, player_2: computer_uuid }]);
    console.log(data);
    console.log(error);
    if(error !== null) {
      res.status(400).json(error);
    } else {
      if(data.length > 1) {
        res.status(400).json({error: 'error creating game'});
      } else {
        res.status(200).json(data[0]);
      }
    }
  }
}
