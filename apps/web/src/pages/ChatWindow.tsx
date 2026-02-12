import React, { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { api } from '@/api/client'

let socket: Socket | null = null

export function ChatWindow() {
  const [roomId, setRoomId] = useState('demo')
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')

  useEffect(() => {
    socket = io(import.meta.env.VITE_API_BASE || 'http://localhost:3001')
    socket.emit('chat:join', roomId)
    socket.on('chat:receive', (msg) => setMessages(prev => [...prev, msg]))
    api.get(`/api/chat/${roomId}`).then(r => setMessages(r.data))
    return () => { socket?.disconnect() }
  }, [roomId])

  function send() {
    const payload = { fromUser: 'u1', toUser: 'u2', content: text }
    api.post(`/api/chat/${roomId}`, payload).then(() => setText(''))
  }

  return (
    <section>
      <h2>Chat</h2>
      <input placeholder="Room" value={roomId} onChange={e => setRoomId(e.target.value)} />
      <div style={{ border: '1px solid #ccc', height: 150, overflow: 'auto', padding: 8 }}>
        {messages.map((m, i) => <div key={m._id || i}>{m.fromUser}: {m.content}</div>)}
      </div>
      <input placeholder="Message" value={text} onChange={e => setText(e.target.value)} />
      <button onClick={send}>Send</button>
    </section>
  )
}
