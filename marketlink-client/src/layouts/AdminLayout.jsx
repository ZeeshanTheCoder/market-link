import DashboardShell from "./DashboardShell";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/cart", label: "Product Cart" },
  { to: "/admin/notifications", label: "Notifications" },
  { to: "/admin/farmers", label: "Farmers" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/markets", label: "Markets" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/announcements", label: "Announcements" },
  { to: "/admin/reports", label: "Reports" },
];

export default function AdminLayout() {
  return <DashboardShell links={links} portalLabel="Admin Console" />;
}
