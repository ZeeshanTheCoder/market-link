import DashboardShell from "./DashboardShell";

const links = [
  { to: "/farmer/dashboard", label: "Dashboard" },
  { to: "/farmer/notifications", label: "Notifications" },
  { to: "/farmer/products", label: "My Products" },
  { to: "/farmer/orders", label: "Orders" },
  { to: "/farmer/pickup-slots", label: "Pickup Slots" },
  { to: "/farmer/reviews", label: "Reviews" },
  { to: "/farmer/analytics", label: "Analytics" },
  { to: "/farmer/profile", label: "Stall Profile" },
];

export default function FarmerLayout() {
  return <DashboardShell links={links} portalLabel="Farmer" />;
}
