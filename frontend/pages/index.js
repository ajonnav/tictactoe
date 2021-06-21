import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/router'
import { removeFromGameQueue } from './api/game'

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
    const user = supabase.auth.user()
    findGame(router, user);
  }

  const multiText = findingGame ? 'Finding game...' : 'Find Multiplayer Game';
  return (
    <div className="container">
      {!session ? <Auth /> : <div>
        <Navbar/>
        <br/>
        <button id="new-comp-game-btn" onClick={newComputerGameHandler}>Start New Game</button>
        <button id="new-multi-game-btn" onClick={newMultiplayerGameHandler} enabled={!findingGame}>{multiText}</button>
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
        const { new: { game_id: next_game_id }, eventType } = payload;
        if(eventType !== 'DELETE') {
          removeFromGameQueue(user.id);
        }
        router.push(`/game/${next_game_id}`);
      })
      .subscribe()
  } else {
    router.push(`/game/${game_id}`);
  }
}
