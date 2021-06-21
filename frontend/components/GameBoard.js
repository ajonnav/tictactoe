export default function GameBoard({currState, onEmptyCellClickHandler, winner}) {
  const boxes = currState.tiles.map((tile, i) => {
    const boxId = `box-${i}`;
    if(tile === 'x') {
      return (<div className="box" key={i} id={boxId}>X</div>)
    } else if (tile === 'o') {
      return (<div className="box" key={i} id={boxId}>O</div>)
    } else if(winner === null) {
      return (<div className="box" key={i} id={boxId} onClick={onEmptyCellClickHandler}></div>)
    } else {
      return (<div className="box" key={i} id={boxId}></div>)
    }
  });
  return (
    <div>
      {winner !== null && <div>
        {winner} is the winner!!
        </div>
      }
      <div id="board">
        {boxes}
      </div>
      <button href="/">Go home</button>
    </div>
  )
}
