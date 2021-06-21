import { useState, useEffect } from 'react'
import Leaderboard from '../components/Leaderboard'
import GameHistory from '../components/GameHistory'
import Navbar from '../components/Navbar'

export default function Stats() {
  return (<div>
    <Navbar/>
    <br/>
    <Leaderboard/>
    <GameHistory/>
    </div>)
}
