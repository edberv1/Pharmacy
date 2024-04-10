import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./components/admin/Admin";
import Client from "./components/client/Client";
import SuperAdmin from "./components/superadmin/SuperAdmin";
import SignUp from "./components/client/pages/SignUp";
import Login from "./components/client/pages/Login";
import AuthRoutes from "./routes/AuthRoutes";
import GuestRoutes from "./routes/GuestRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" index element={<Client />} />

        <Route element={<AuthRoutes />}>
          <Route path="admin" element={<Admin />} />
          <Route path="superadmin" element={<SuperAdmin />} />
        </Route>

        <Route element={<GuestRoutes />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
