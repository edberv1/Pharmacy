import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./layouts/admin/Admin";
import Client from "./layouts/client/Client";
import SuperAdmin from "./layouts/superadmin/SuperAdmin";
import NotFound from "./layouts/NotFound";
import SignUp from "./layouts/client/pages/SignUp";
import Login from "./layouts/client/pages/Login";
import withRole from "./routes/WithRole";
import Users from "./layouts/superadmin/pages/Users";
import Roles from "./layouts/superadmin/pages/Roles";
import Profile from "./layouts/client/pages/Profile";
import Pharmacies from "./layouts/admin/pages/Pharmacies";
import Products from "./layouts/admin/pages/Products";
import ProfileAdmin from "./layouts/admin/pages/Profile";
import Requests from "./layouts/superadmin/pages/Requests";
import Statistics from "./layouts/superadmin/pages/Statistics";
import PharmacyForm from "./layouts/client/pages/PharmacyForm";
import Home from "./layouts/client/pages/Home";

import AboutUsClient from "./layouts/client/pages/AboutUs";
import ClientPharmacies from "./layouts/client/pages/Pharmacies";
import PharmacyDetails from "./layouts/client/components/PharmacyDetails";

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
