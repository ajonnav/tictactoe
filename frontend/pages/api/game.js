import { supabase } from '../../utils/supabaseClient'

export default async function handler(req, res) {
  if(req.method === 'POST') {
    const { data, error } = await supabase
      .from('games')
      .insert([{}]);
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
