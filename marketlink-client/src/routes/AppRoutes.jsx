import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import FarmerLayout from "../layouts/FarmerLayout";
import AdminLayout from "../layouts/AdminLayout";
import GuestRoute from "./GuestRoute";
import RoleRoute from "./RoleRoute";
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Markets from "../pages/public/Markets";
import Farmers from "../pages/public/Farmers";
import Products from "../pages/public/Products";
import { ProductDetails, FarmerDetails, MarketDetails } from "../pages/public/Details";
import HowItWorks from "../pages/public/HowItWorks";
import FAQ from "../pages/public/FAQ";
import SellerGuide from "../pages/public/SellerGuide";
import Assistant from "../pages/ai/Assistant";
import NotFound from "../pages/public/NotFound";
import CustomerDashboard from "../pages/customer/Dashboard";
import CustomerCart from "../pages/customer/Cart";
import CustomerCheckout from "../pages/customer/Checkout";
import CustomerOrders from "../pages/customer/Orders";
import CustomerOrderDetails from "../pages/customer/OrderDetails";
import FarmerDashboard from "../pages/farmer/Dashboard";
import FarmerProducts from "../pages/farmer/Products";
import FarmerProductForm from "../pages/farmer/ProductForm";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminCart from "../pages/admin/Cart";
import PortalNotifications from "../pages/portal/Notifications";
import {
  CustomerFavorites, CustomerProfile, CustomerNotifications, CustomerReviews,
  FarmerProfile, FarmerOrders, FarmerOrderDetails, FarmerPickupSlots, FarmerReviews, FarmerAnalytics,
  AdminFarmers, AdminCustomers, AdminMarkets, AdminProducts, AdminReviews, AdminReports, AdminCategories, AdminAnnouncements,
} from "../pages/portal/PortalPages";

export default function AppRoutes() {
  return <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/markets" element={<Markets />} />
      <Route path="/markets/:id" element={<MarketDetails />} />
      <Route path="/farmers" element={<Farmers />} />
      <Route path="/farmers/:id" element={<FarmerDetails />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/seller-guide" element={<SellerGuide />} />
      <Route path="/assistant" element={<Assistant />} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>
    </Route>

    <Route element={<RoleRoute allowedRoles={["customer"]} />}>
      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="markets" element={<Markets />} />
        <Route path="markets/:id" element={<MarketDetails />} />
        <Route path="farmers/:id" element={<FarmerDetails />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="cart" element={<CustomerCart />} />
        <Route path="checkout" element={<CustomerCheckout />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="orders/:id" element={<CustomerOrderDetails />} />
        <Route path="favorites" element={<CustomerFavorites />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="reviews" element={<CustomerReviews />} />
      </Route>
    </Route>

    <Route element={<RoleRoute allowedRoles={["farmer"]} />}>
      <Route path="/farmer" element={<FarmerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<FarmerDashboard />} />
         <Route path="notifications" element={<PortalNotifications />} />
        <Route path="profile" element={<FarmerProfile />} />
        <Route path="products" element={<FarmerProducts />} />
        <Route path="products/add" element={<FarmerProductForm />} />
        <Route path="products/:id/edit" element={<FarmerProductForm />} />
        <Route path="orders" element={<FarmerOrders />} />
        <Route path="orders/:id" element={<FarmerOrderDetails />} />
        <Route path="pickup-slots" element={<FarmerPickupSlots />} />
        <Route path="reviews" element={<FarmerReviews />} />
        <Route path="analytics" element={<FarmerAnalytics />} />
      </Route>
    </Route>

    <Route element={<RoleRoute allowedRoles={["admin"]} />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
         <Route path="cart" element={<AdminCart />} />
         <Route path="notifications" element={<PortalNotifications admin />} />
        <Route path="farmers" element={<AdminFarmers />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="markets" element={<AdminMarkets />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>;
}
