import { useState, useEffect } from 'react'

export default function Leaderboard() {
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

  const rows = items ? items.map((item, i) => {
    return (
      <div className="table-row" key={i + 1} id={`table-row-${i + 1}`}>
        <div></div>
        <div>{item.user_id}</div>
        <div>{item.score}</div>
        <div></div>
      </div>
    )
  }) : [];
  return (
      <div id="leaderboard" class="leaderboard">
        <h2>Leaderboard</h2>
        <div id="leaderboard-table" className="table">
          <div className="table-row" key={0} id={`table-row-0`}>
            <div></div>
            <div><b>User</b></div>
            <div><b>Number of Games Won</b></div>
            <div></div>
          </div>
          {rows}
        </div>
        <br/>
        <div id="nav-parent">
          <button id="page-back" className="nav-control" disabled={page <= 1} onClick={() => setPage(page - 1)}>&lt;</button>
          <div id="current-page" className="nav-control">Page {page}</div>
          <button id="page-front" className="nav-control" disabled={!hasNext} onClick={() => setPage(page + 1)}>&gt;</button>
        </div>
      </div>)
}
