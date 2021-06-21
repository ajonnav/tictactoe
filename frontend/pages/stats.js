import { useState, useEffect } from 'react'
import Leaderboard from '../components/Leaderboard'
import GameHistory from '../components/GameHistory'

export default function Stats() {
  return (<div>
    <Leaderboard/>
    <GameHistory/>
    </div>)
}
