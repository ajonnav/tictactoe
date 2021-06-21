import { supabase } from '../../utils/supabaseClient'

export default async function handler(req, res) {
  if(req.method === 'GET') {
    const { data: count, error: countError } = await supabase
      .from('leaderboard')
      .select('*', { count: 'exact', head: true })
    if(countError !== null) {
      res.status(500).json({countError});
      return
    }

    const { page } = req.query;
    const pageSize = 10;
    const { data: items, error: error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .range((page-1) * pageSize, (page) * pageSize - 1)
    if(error !== null) {
      res.status(500).json({error});
      return
    }
    res.status(200).json({ items, hasNext: ((page) * pageSize - 1) < count })
  }
}
