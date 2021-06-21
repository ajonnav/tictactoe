import Link from 'next/link'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function Navbar() {
  const user = supabase.auth.user()
  const router = useRouter()
  return (
    <div>
      <Link href="/"><button>Home</button></Link>
      <Link href="/stats"><button>Stats</button></Link>
      <button className="button block" onClick={() => supabase.auth.signOut() && router.push("/")}>Sign Out</button>
      { user && <div>You are: {user.id}</div>}
    </div>
  )
}
