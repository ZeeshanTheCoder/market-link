import DashboardShell from "./DashboardShell";

const links = [
  { to: "/customer/dashboard", label: "Dashboard" },
  { to: "/customer/assistant", label: "AI Assistant" },
  { to: "/customer/products", label: "Browse Products" },
  { to: "/customer/markets", label: "Find Markets" },
  { to: "/customer/cart", label: "My Cart" },
  { to: "/customer/orders", label: "My Orders" },
  { to: "/customer/favorites", label: "Favorites" },
  { to: "/customer/reviews", label: "My Reviews" },
  { to: "/customer/notifications", label: "Notifications" },
  { to: "/customer/profile", label: "Profile" },
];

export default function CustomerLayout() {
  return <DashboardShell links={links} portalLabel="Customer" />;
}
