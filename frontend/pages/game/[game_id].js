import { useRouter } from 'next/router'
import GameBoard from '../../components/GameBoard'

const Game = ({currState}) => {
  const router = useRouter()
  const { game_id } = router.query
  console.log(game_id);

  return <GameBoard currState={currState}/>;
}

export async function getServerSideProps(context) {
  const currState = {
    tiles: ['x','o','x','','','','','',''],
  }
  return {
    props: {currState}, // will be passed to the page component as props
  }
}

export default Game
