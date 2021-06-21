import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import Account from '../components/Account'
import { useRouter } from 'next/router'

export default function Home() {
  const [session, setSession] = useState(null)
  const [findingGame, setFindingGame] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const newComputerGameHandler = async event => {
    event.preventDefault();
    const user = supabase.auth.user()
    const res = await fetch('/api/game', {
      body: JSON.stringify({
        user_id: user.id,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
    const result = await res.json();
    const { id } = result;
    router.push(`/game/${id}`);
  };

  const newMultiplayerGameHandler = async event => {
    event.preventDefault();
    if(findingGame) {
      return
    }
    setFindingGame(true);
    // first see if other players are on the queue
    const user = supabase.auth.user()
    findGame(router, user);
    // listen for updates on that queue ID
    // redirect user when a game gets assigned
  }

  const multiText = findingGame ? 'Finding game...' : 'Find Multiplayer Game';
  console.log(session);
  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <div>
        <Account key={session.user.id} session={session}/>
        <button id="new-game-btn" onClick={newComputerGameHandler}>Start New Game</button>
        <button id="new-game-btn" onClick={newMultiplayerGameHandler} enabled={!findingGame}>{multiText}</button>
      </div>}
    </div>
  )
}

async function findGame(router, user) {
  const res = await fetch('/api/find_game', {
    body: JSON.stringify({
      user_id: user.id,
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });
  const result = await res.json();
  const { game_id, game_queue_id } = result;
  if(!game_id) {
    const games = supabase
      .from(`game_queue:id=eq.${game_queue_id}`)
      .on('*', payload => {
        console.log(payload);
        const { new: { game_id: next_game_id } } = payload;
        router.push(`/game/${next_game_id}`);
      })
      .subscribe()
  } else {
    router.push(`/game/${game_id}`);
  }
}
