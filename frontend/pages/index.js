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

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <div><button id="new-game-btn" onClick={newGameHandler}>Start New Game</button></div>}
    </div>
  )
}
