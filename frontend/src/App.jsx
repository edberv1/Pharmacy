import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./components/admin/Admin";
import Client from "./components/client/Client";
import SuperAdmin from "./components/superadmin/SuperAdmin";
import NotFound from "./components/NotFound";
import SignUp from "./components/client/pages/SignUp";
import Login from "./components/client/pages/Login";
import withRole from "./routes/WithRole";
import Users from "./components/superadmin/pages/Users";
import Roles from "./components/superadmin/pages/Roles";
import Profile from "./components/client/pages/Profile";
import Pharmacies from "./components/admin/pages/Pharmacies";
import Products from "./components/admin/pages/Products";
import ProfileAdmin from "./components/admin/pages/Profile";
import Requests from "./components/superadmin/pages/Requests";
import Statistics from "./components/superadmin/pages/Statistics";
import PharmacyForm from "./components/client/pages/PharmacyForm";
import Home from "./components/client/pages/Home";

import AboutUsClient from "./components/client/pages/AboutUs";
import ClientPharmacies from "./components/client/pages/Pharmacies";
import PharmacyDetails from "./components/client/components/PharmacyDetails";

function App() {
  const AdminRoute = withRole(Admin, "admin");
  const SuperAdminRoute = withRole(SuperAdmin, "superadmin");
  const UsersRoute = withRole(Users, "superadmin");
  const RolesRoutes = withRole(Roles, "superadmin");
  const PharmaciesRoute = withRole(Pharmacies, "superadmin");
  const ProductsRoute = withRole(Products, "admin");
  const ProfileAdminRoute = withRole(ProfileAdmin, "admin");
  const RequestsRoute = withRole(Requests, "superadmin");
  const StatisticsRoute = withRole(Statistics, "superadmin");

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Client />}>

          <Route path="/" index element={<Home />} /> {/* Add this line */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pharmacyForm" element={<PharmacyForm />} />

          <Route path="/pharmacies" element={<ClientPharmacies />} />
          <Route path="/aboutUs" element={<AboutUsClient />} />
          <Route path="/pharmacies/:id" element={<PharmacyDetails />} />

        </Route>

        {/* Admin Routes */}
        <Route path="admin/*" element={<AdminRoute />}>
          <Route path="profileAdmin" element={<ProfileAdminRoute />} />
          <Route path="products" element={<ProductsRoute />} />
        </Route>

        {/* Admin Routes */}

        {/* SuperAdmin Routes */}
        <Route path="superadmin/*" element={<SuperAdminRoute />}>
          <Route path="users" element={<UsersRoute />} />
          <Route path="roles" element={<RolesRoutes />} />
          <Route path="pharmacies" element={<PharmaciesRoute />} />

          <Route path="requests" element={<RequestsRoute />} />
          <Route path="statistics" element={<StatisticsRoute />} />
        </Route>
        {/* SuperAdmin Routes */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
