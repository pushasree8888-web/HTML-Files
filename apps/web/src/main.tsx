import React from 'react'
import { createRoot } from 'react-dom/client'
import { ProfilePage } from './pages/ProfilePage'
import { SkillList } from './pages/SkillList'
import { MatchResults } from './pages/MatchResults'
import { ChatWindow } from './pages/ChatWindow'

function App() {
  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Skillmate</h1>
      <ProfilePage />
      <hr />
      <SkillList />
      <hr />
      <MatchResults />
      <hr />
      <ChatWindow />
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
