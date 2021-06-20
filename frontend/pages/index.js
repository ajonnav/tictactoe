import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import { useRouter } from 'next/router'

export default function Home() {
  const [session, setSession] = useState(null)
  const router = useRouter()

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const newGameHandler = async event => {
    console.log('here');
    event.preventDefault();
    const res = await fetch('/api/game', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
    console.log('here 2');
    const result = await res.json();
    console.log(result);
    const { id } = result;
    router.push(`/game/${id}`);
  };

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <div><button id="new-game-btn" onClick={newGameHandler}>Start New Game</button></div>}
    </div>
  )
}
