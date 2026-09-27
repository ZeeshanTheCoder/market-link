import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import Icon from "../components/common/Icons";
import StatusBadge from "../components/common/StatusBadge";
import { useAuth } from "../hooks/useAuth";

export default function DashboardShell({ links, portalLabel, dark = false }) {
  const { user, logout } = useAuth();
  const displayUser = user || { name: portalLabel, role: portalLabel.toLowerCase() };
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebar = dark ? "bg-navy-900 text-navy-100" : "border-r border-stone-200 bg-white text-ink";
  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition ${
      dark
        ? isActive ? "bg-navy-700 text-white" : "text-navy-100 hover:bg-navy-800"
        : isActive ? "bg-leaf-100 text-leaf-800" : "text-stone-700 hover:bg-leaf-50"
    }`;

  return (
    <div className="min-h-screen bg-cream lg:flex">
      {open && <div className="fixed inset-0 z-30 bg-navy-900/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col p-4 transition-transform lg:static lg:translate-x-0 ${sidebar} ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label={`${portalLabel} navigation`}
      >
        <div className="mb-6 px-2 pt-1">
          <Logo light={dark} tagline={false} />
        </div>
        <p className={`mb-2 px-3 text-[11px] font-bold uppercase tracking-widest ${dark ? "text-navy-100/60" : "text-stone-400"}`}>
          {portalLabel}
        </p>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-stone-200 bg-white px-4 sm:px-6">
          <button type="button" className="rounded-lg p-2 hover:bg-leaf-50 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <div className="hidden text-sm text-stone-500 lg:block">{portalLabel}</div>
          <div className="ml-auto flex items-center gap-3">
            {!dark && (
              <Link to="/" className="hidden text-sm font-medium text-leaf-700 hover:underline sm:block">
                View site
              </Link>
            )}
            <span className="hidden text-sm font-semibold text-navy-800 sm:block">{displayUser.name}</span>
            <StatusBadge status={displayUser.role} />
            <button type="button" onClick={handleLogout} className="btn-outline px-4 py-1.5">
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
