export default function GameBoard() {
  const currState = {
    tiles: ['x','o','x','','','','','',''],
  }
  const boxes = currState.tiles.map((tile, i) => {
    const boxId = `box-${i}`;
    if(tile === 'x') {
      return (<div class="box" id={boxId}>X</div>)
    } else if (tile === 'o') {
      return (<div class="box" id={boxId}>O</div>)
    } else {
      return (<div class="box" id={boxId}></div>)
    }
  });
  return (
    <div id="board">
      {boxes}
    </div>
  )
}
