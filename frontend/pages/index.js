import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/router'
import { removeFromGameQueue } from './api/game'

export default function Home() {
  const [session, setSession] = useState(null)
  const [findingGame, setFindingGame] = useState(false)
  const [username, setUsername] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playEnabled, setPlayEnabled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    setLoading(true)
    const user = supabase.auth.user()
    if(user) {
      try {
        let { data, error, status } = await supabase
          .from('profiles')
          .select(`username`)
          .eq('id', user.id)
          .single()

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          setUsername(data.username)
          if(data.username !== null && data.username !== '') {
            setPlayEnabled(true)
          }
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  async function updateProfile({ username }) {
    setLoading(true)
    const user = supabase.auth.user()
    if(user) {
      try {

        const updates = {
          id: user.id,
          username,
          updated_at: new Date(),
        }

        let { error } = await supabase.from('profiles').upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        })

        if (error) {
          throw error
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
        if(username !== null && username !== '') {
          setPlayEnabled(true)
        }
      }
    }
  }

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
        <div className="form-widget">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="text" value={session.user.email} disabled />
          </div>
          <div>
            <label htmlFor="username">Name (must be set to play)</label>
            <input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <button
              className="button block primary"
              onClick={() => updateProfile({ username })}
              disabled={loading}
            >
              'Update'
            </button>
          </div>
        </div>
        <br/>
        <button id="new-comp-game-btn" onClick={newComputerGameHandler} disabled={!playEnabled}>Start New Game</button>
        <button id="new-multi-game-btn" onClick={newMultiplayerGameHandler} disabled={(findingGame || !playEnabled)}>{multiText}</button>
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
          router.push(`/game/${next_game_id}`);
        }
      })
      .subscribe()
  } else {
    router.push(`/game/${game_id}`);
  }
}
