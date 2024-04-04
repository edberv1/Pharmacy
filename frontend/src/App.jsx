import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);// State for SQL users
  const [mongoData, setMongoData] = useState([]); // State for MongoDB users

  useEffect(() => {
    fetch("http://localhost:8081/users")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/test/getAllMongoUsers")
      .then((res) => res.json())
      .then((data) => {
        console.log("MongoDB data:", data); // Log the data
        setMongoData(data);
      })
      .catch((err) => console.error("Error fetching MongoDB users:", err));
  }, []);

  return (
    <>
      <h1>With SQL</h1>
      <table>
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Surname</th>
          <th>Email</th>
        </thead>
        <tbody>
          {data.map(user => (
            <tr key={user.id}>
              <td> {user._id} </td>
              <td> {user.name} </td>
              <td> {user.surname} </td>
              <td> {user.email} </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>With Mongo</h1>
      <table>
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Surname</th>
          <th>Email</th>
        </thead>
        <tbody>
        {mongoData.map(user => (
            <tr key={user.id}>
              <td> {user._id} </td>
              <td> {user.name} </td>
              <td> {user.surname} </td>
              <td> {user.email} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;


