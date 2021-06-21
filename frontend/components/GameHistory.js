import { useState, useEffect } from 'react'

export default function GameHistory() {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([]);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/games?page=${page}`, {
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
        <div>{item.id}</div>
        <div>{item.player_1}</div>
        <div>{item.player_2}</div>
        <div>{item.winner}</div>
      </div>
    )
  }) : [];
  return (
      <div id="game-history">
        <h2>Game History</h2>
        <div id="game-history-table" className="table">
          <div className="table-row" key={0} id={`table-row-0`}>
            <div><b>Game ID</b></div>
            <div><b>Player 1</b></div>
            <div><b>Player 2</b></div>
            <div><b>Winner</b></div>
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
