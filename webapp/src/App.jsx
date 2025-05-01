import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserList from './features/users/UserList';

function App() {
  return (
    <div className="App">
      <UserList />
    </div>
  );
}

export default App
