import React, { useState, useEffect } from 'react';
import { useMsal, useAccount } from "@azure/msal-react";
import { getGraphClient, getRecentChats } from './graphService';
import { loginRequest } from './config';
import './App.css';

function App() {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  const loadTodos = async () => {
    if (!account) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const graphClient = getGraphClient(instance, account);
      const chatTodos = await getRecentChats(graphClient);
      setTodos(chatTodos);
    } catch (err) {
      setError("Failed to load todos from Teams chats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  useEffect(() => {
    if (account) {
      loadTodos();
    }
  }, [account]);

  if (!account) {
    return (
      <div className="login-container">
        <h1>Teams Todo Liste</h1>
        <button onClick={handleLogin} className="login-button">
          Mit Microsoft anmelden
        </button>
      </div>
    );
  }

  return (
    <div className="todo-app">
      <div className="header">
        <h1>Teams Todos</h1>
        <button onClick={handleLogout} className="logout-button">
          Abmelden
        </button>
      </div>

      {loading && <div className="loading">Lade Todos...</div>}
      {error && <div className="error">{error}</div>}

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="todo-checkbox"
            />
            <div className="todo-content">
              <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                {todo.text}
              </span>
              <span className="todo-timestamp">
                {new Date(todo.timestamp).toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <button onClick={loadTodos} className="refresh-button">
        Aktualisieren
      </button>
    </div>
  );
}

export default App;
