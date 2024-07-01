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

import MyPharmacyDetails from "./layouts/admin/components/MyPharmacyDetails";
import MyPharmacies from "./layouts/admin/pages/MyPharmacies"; 
import PasswordResetRequest from "./layouts/client/components/PasswordResetRequest";
import PasswordResetForm from "./layouts/client/components/PasswordResetForm";
import ProductDetails from "./layouts/client/components/ProductDetails";
import Cart from "./layouts/client/components/Cart";
import License from "./layouts/admin/pages/License";
import StatisticsAdmin from "./layouts/admin/pages/StatisticsAdmin"
import Contacts from "./layouts/superadmin/pages/Contacts" 
import Success from "./layouts/client/components/Success";
import Mbrojtje from "./layouts/client/pages/Mbrojtje"

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
  const LicenseRoute = withRole(License, "admin")
  const MyPharmaciesRoute = withRole(MyPharmacies, "admin");
  const MyPharmacyDetailsRoute = withRole(MyPharmacyDetails , "admin");
  const StatisticsAdminRoute = withRole(StatisticsAdmin, "admin");
  const ContactsRoute = withRole(Contacts, "superadmin");

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
          <Route path="/pharmacies/:pharmacyId/products/:productId" element={<ProductDetails />} />
          <Route path="/password-reset-request" element={<PasswordResetRequest />} />
          <Route path="/password-reset-form" element={<PasswordResetForm />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment-success" element={<Success />} />
          <Route path="/mbrojtje" element={<Mbrojtje/>} />

        </Route>

        {/* Admin Routes */}
        <Route path="admin/*" element={<AdminRoute />}>
          <Route path="profileAdmin" element={<ProfileAdminRoute />} />
          <Route path="products" element={<ProductsRoute />} />

          <Route path="myPharmacies" element={<MyPharmaciesRoute />} />
          <Route path="myPharmacies/:id" element={<MyPharmacyDetailsRoute />} /> 

          <Route path="license" element={<LicenseRoute />} />StatisticsAdminRoute
          <Route path="statistics" element={<StatisticsAdminRoute />} />
        </Route>

        {/* Admin Routes */}

        {/* SuperAdmin Routes */}
        <Route path="superadmin/*" element={<SuperAdminRoute />}>
          <Route path="users" element={<UsersRoute />} />
          <Route path="roles" element={<RolesRoutes />} />
          <Route path="pharmacies" element={<PharmaciesRoute />} />

          <Route path="requests" element={<RequestsRoute />} />
          <Route path="statistics" element={<StatisticsRoute />} />
          <Route path="contacts" element={<ContactsRoute />} />
        </Route>
        {/* SuperAdmin Routes */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
