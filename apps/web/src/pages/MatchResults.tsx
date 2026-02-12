import React, { useEffect, useState } from 'react'
import { api } from '@/api/client'

export function MatchResults() {
  const [userId, setUserId] = useState('')
  const [results, setResults] = useState<any[]>([])

  function onMatch() {
    api.post('/api/match', { userId }).then(r => setResults(r.data.recommendations || []))
  }

  return (
    <section>
      <h2>Matchmaking</h2>
      <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
      <button onClick={onMatch}>Find Matches</button>
      <ul>
        {results.map(r => (
          <li key={r.userId}>{r.userId} — score {r.score.toFixed(3)}</li>
        ))}
      </ul>
    </section>
  )
}
