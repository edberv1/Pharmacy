import { useEffect, useState } from 'react';
import UserTable from '../components/UserTable';


const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await fetch('http://localhost:8081/superAdmin/getAllUsers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };
  
    fetchUsers();
  }, []);
  
  return (
    <div>
      <UserTable/>
      <h1>All Users</h1>
      {users.map(user => (
        <div key={user.id}>
          <p>{user.id}</p>
          <h2>{user.firstname}</h2>
          <p>{user.email}</p>        
        </div>
      ))}
    </div>
  );
};

export default Users;
