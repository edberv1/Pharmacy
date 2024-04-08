import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./components/admin/Admin";
import Client from "./components/client/Client";
import SuperAdmin from "./components/superadmin/SuperAdmin";
import SignUp from "./components/client/pages/SignUp";
import Login from "./components/client/pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Client />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/signup" element= {<SignUp/>}></Route>
        <Route path="/signup" element= {<Login/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
