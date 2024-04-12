import { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";

function Users() {
  // Define state to store the list of users
  const [users, setUsers] = useState([]);

  // Fetch all users from the backend when the component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/superadmin/getAllUsers');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchUsers();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <>
      <Sidebar/>
      <div>
        <h2>All Users</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Users;
