import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [mongoData, setMongoData] = useState([]); // State for MongoDB users

  useEffect(() => {
    fetch("http://localhost:8081/users")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Fetch MongoDB users
    fetch("http://localhost:8080/api/test/getAllMongoUsers")
      .then((res) => res.json())
      .then((data) => {
        console.log("MongoDB data:", data); // Log the data
        setMongoData(data);
      })
      .catch((err) => console.error("Error fetching MongoDB users:", err));
  }, []);

  return (
    <div>
      <h1>With SQL</h1>
      <table>
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Surname</th>
          <th>Email</th>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d._id}>
              <td> {d._id} </td>
              <td> {d.name} </td>
              <td> {d.surname} </td>
              <td> {d.email} </td>
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
          {mongoData.map((d) => (
            <tr key={d._id}>
              <td>{d._id}</td>
              <td>{d.name}</td>
              <td>{d.surname}</td>
              <td>{d.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
