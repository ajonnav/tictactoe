export default function GameBoard({currState, onEmptyCellClickHandler}) {
  const boxes = currState.tiles.map((tile, i) => {
    const boxId = `box-${i}`;
    if(tile === 'x') {
      return (<div className="box" key={i} id={boxId}>X</div>)
    } else if (tile === 'o') {
      return (<div className="box" key={i} id={boxId}>O</div>)
    } else {
      return (<div className="box" key={i} id={boxId} onClick={onEmptyCellClickHandler}></div>)
    }
  });
  return (
    <div id="board">
      {boxes}
    </div>
  )
}
