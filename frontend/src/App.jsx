import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]); // State for SQL users
  const [mongoData, setMongoData] = useState([]); // State for MongoDB users
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/users")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/user/getAllMongoUsers")
      .then((res) => res.json())
      .then((data) => {
        console.log("MongoDB data:", data); // Log the data
        setMongoData(data);
      })
      .catch((err) => console.error("Error fetching MongoDB users:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { name, surname, email };
    fetch("http://localhost:8080/user/addUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

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
          {data.map((user) => (
            <tr key={user.id}>
              <td> {user.id} </td>
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
          {mongoData.map((user) => (
            <tr key={user.id}>
              <td> {user._id} </td>
              <td> {user.name} </td>
              <td> {user.surname} </td>
              <td> {user.email} </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Surname"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button type="submit">Add User</button>
      </form>
    </>
  );
}

export default App;
