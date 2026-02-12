import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const API_BASE = process.env.API_BASE || 'http://localhost:3001';

export default function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('demo');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/users`).then(r => setUsers(r.data));
    const socket = io(API_BASE);
    socket.emit('chat:join', room);
    socket.on('chat:receive', (msg) => setMessages(prev => [...prev, msg]));
    axios.get(`${API_BASE}/api/chat/${room}`).then(r => setMessages(r.data));
    return () => socket.disconnect();
  }, [room]);

  const createUser = () => {
    axios.post(`${API_BASE}/api/users`, { name }).then(() => axios.get(`${API_BASE}/api/users`).then(r => setUsers(r.data)));
  };

  const send = () => {
    axios.post(`${API_BASE}/api/chat/${room}`, { fromUser: 'u1', toUser: 'u2', content: text }).then(() => setText(''));
  };

  return (
    <SafeAreaView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Skillmate Mobile</Text>
      <View style={{ marginVertical: 8 }}>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 8 }} />
        <Button title="Create User" onPress={createUser} />
      </View>
      <FlatList data={users} keyExtractor={(u) => u._id} renderItem={({ item }) => (
        <Text>{item.name}</Text>
      )} />
      <View style={{ marginVertical: 8 }}>
        <TextInput placeholder="Room" value={room} onChangeText={setRoom} style={{ borderWidth: 1, padding: 8 }} />
        <FlatList data={messages} keyExtractor={(m, i) => m._id || String(i)} renderItem={({ item }) => (
          <Text>{item.fromUser}: {item.content}</Text>
        )} />
        <TextInput placeholder="Message" value={text} onChangeText={setText} style={{ borderWidth: 1, padding: 8 }} />
        <Button title="Send" onPress={send} />
      </View>
    </SafeAreaView>
  );
}
