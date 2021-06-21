import { useState, useEffect } from 'react'
import Leaderboard from '../components/Leaderboard'

export default function Stats() {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([]);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/leaderboard?page=${page}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      });
      const result = await res.json();
      const { items: fetchedItems, hasNext: fetchedHasNext } = result;
      console.log(`hehe ${fetchedItems}, ${fetchedHasNext}`);
      console.log(fetchedItems);
      setItems(fetchedItems);
      setHasNext(fetchedHasNext);
    }
    fetchData()
  }, [page])
  return <Leaderboard page={page} items={items} setPage={setPage} hasNext={hasNext}/>
}
