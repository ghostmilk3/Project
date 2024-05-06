import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const getUsers = async () => {
      const response = await axios('http://0.0.0.0:8080/users?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTBmYzI5ZmQ0Zjk3M2ZhMWJlODQzMiIsImlhdCI6MTcxMjM5MjcwOCwiZXhwIjoxNzEyMzk2MzA4fQ.ziBqYeKs5XALQzcNo_DexWRIv3mIvTpwIDkT3R76LaA')
      setUsers(response.data)
    }
    getUsers() 
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <button>新建</button>
        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
          {users.map(user => (
            <tr>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td><button>Delete</button></td>
            </tr>
          ))}
        </table>
      </header>
    </div>
  );
}

export default App;
