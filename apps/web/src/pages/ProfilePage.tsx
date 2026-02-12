import React, { useEffect, useState } from 'react'
import { api } from '@/api/client'

export function ProfilePage() {
  const [users, setUsers] = useState<any[]>([])
  const [form, setForm] = useState<any>({ name: '', bio: '', skillsOffered: '', skillsToLearn: '' })

  useEffect(() => {
    api.get('/api/users').then(r => setUsers(r.data))
  }, [])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      name: form.name,
      bio: form.bio,
      skillsOffered: form.skillsOffered.split(',').map((s: string) => s.trim()).filter(Boolean),
      skillsToLearn: form.skillsToLearn.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
    api.post('/api/users', payload).then(() => api.get('/api/users').then(r => setUsers(r.data)))
  }

  return (
    <section>
      <h2>Profile</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Bio" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
        <input placeholder="Skills Offered (comma-separated)" value={form.skillsOffered} onChange={e => setForm({ ...form, skillsOffered: e.target.value })} />
        <input placeholder="Skills To Learn (comma-separated)" value={form.skillsToLearn} onChange={e => setForm({ ...form, skillsToLearn: e.target.value })} />
        <button type="submit">Create</button>
      </form>
      <ul>
        {users.map(u => (
          <li key={u._id}>{u.name} — offered: {u.skillsOffered?.join(', ')} — learn: {u.skillsToLearn?.join(', ')}</li>
        ))}
      </ul>
    </section>
  )
}
