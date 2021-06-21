import { supabase } from '../../utils/supabaseClient'

export default async function handler(req, res) {
  if(req.method === 'GET') {
    const { data: all_ids, error: countError } = await supabase
      .from('games')
      .select('id', { count: 'exact' })
      .not('winner', 'is', null)
    if(countError !== null) {
      res.status(500).json({countError});
      return
    }

    const { page } = req.query;
    const pageSize = 10;
    const { data: items, error: error } = await supabase
      .from('games')
      .select('*')
      .not('winner', 'is', null)
      .order('completed_time, id', { ascending: false })
      .range((page-1) * pageSize, (page) * pageSize - 1 )
    if(error !== null) {
      res.status(500).json({error});
      return
    }
    console.log(((page) * pageSize - 1));
    console.log(all_ids.length);
    res.status(200).json({ items, hasNext: ((page) * pageSize) < all_ids.length })
  }
}
