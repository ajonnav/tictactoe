import Link from 'next/link'
import { supabase } from '../utils/supabaseClient'

export default function Navbar() {
  const user = supabase.auth.user()
  return (
    <div>
      <Link href="/"><button>Home</button></Link>
      <Link href="/stats"><button>Stats</button></Link>
      <button className="button block" onClick={() => supabase.auth.signOut()}>Sign Out</button>
      <div>You are: {user.id}</div>
    </div>
  )
}
