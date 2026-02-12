import React, { useEffect, useState } from 'react'
import { api } from '@/api/client'

export function SkillList() {
  const [skills, setSkills] = useState<any[]>([])
  const [form, setForm] = useState<any>({ name: '', category: '', tags: '' })

  useEffect(() => {
    api.get('/api/skills').then(r => setSkills(r.data))
  }, [])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      name: form.name,
      category: form.category,
      tags: form.tags.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
    api.post('/api/skills', payload).then(() => api.get('/api/skills').then(r => setSkills(r.data)))
  }

  return (
    <section>
      <h2>Skills</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Tags (comma-separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
        <button type="submit">Create</button>
      </form>
      <ul>
        {skills.map(s => (
          <li key={s._id}>{s.name} — {s.category} — {s.tags?.join(', ')}</li>
        ))}
      </ul>
    </section>
  )
}
