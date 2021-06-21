import { useState, useEffect } from 'react'

export default function Leaderboard({page, items, setPage, hasNext}) {
  const rows = items.map((item, i) => {
    return (
      <div className="table-row" key={i} id={`table-row-${i}`}>
        <div>{item.user_id}</div>
        <div>{item.score}</div>
      </div>
    )
  })
  return (
      <div id="leaderboard">
        <h2>Leaderboard</h2>
        <div id="leaderboard-table" className="table">
          {rows}
        </div>
        <div id="nav-parent">
          <button id="page-back" className="nav-control" disabled={page <= 1} onClick={() => setPage(page - 1)}>&lt;</button>
          <div id="current-page" className="nav-control">{page}</div>
          <button id="page-front" className="nav-control" disabled={!hasNext} onClick={() => setPage(page + 1)}>&gt;</button>
        </div>
      </div>)
}
