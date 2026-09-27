import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icons";
import { useAuth } from "../../hooks/useAuth";
import { dashboardPathFor } from "../../utils/roleHome";
import { useStore } from "../../context/StoreContext";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/markets", label: "Markets" },
  { to: "/farmers", label: "Farmers" },
  { to: "/products", label: "Products" },
  { to: "/how-it-works", label: "How It Works" },
];

const linkClass = ({ isActive }) =>
  `nav-item relative whitespace-nowrap py-2 text-[12.5px] font-extrabold tracking-[-.01em] transition-all duration-300 ${
    isActive
      ? "text-leaf-700 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-leaf-600 after:content-['']"
      : "text-navy-800 hover:-translate-y-0.5 hover:text-leaf-700"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    setAccountOpen(false);
    navigate("/");
  };

  const closeMenus = () => {
    setOpen(false);
    setAccountOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-cream/90 shadow-[0_10px_30px_rgba(20,56,92,.05)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-4 xl:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="relative flex items-center gap-2">
          <Link
            to="/customer/cart"
            className="nav-icon-button nav-cart-icon"
            aria-label={`Cart with ${itemCount} items`}
            title="Cart"
            onClick={() => setAccountOpen(false)}
          >
            <Icon name="basket" className="h-[19px] w-[19px]" strokeWidth={1.9} />
            {itemCount > 0 && <span className="nav-cart-count">{itemCount > 99 ? "99+" : itemCount}</span>}
          </Link>

          <button
            type="button"
            className="nav-icon-button xl:hidden"
            onClick={() => {
              setOpen((o) => !o);
              setAccountOpen(false);
            }}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            title={open ? "Close menu" : "Open menu"}
          >
            <Icon name={open ? "close" : "menu"} className="h-[19px] w-[19px]" />
          </button>

          <button
            type="button"
            className="nav-icon-button hidden xl:inline-flex"
            onClick={() => setAccountOpen((o) => !o)}
            aria-label={user ? "Account menu" : "Sign in menu"}
            aria-expanded={accountOpen}
            title={user ? "Account" : "Account"}
          >
            <Icon name="user" className="h-[19px] w-[19px]" strokeWidth={1.9} />
          </button>

          {accountOpen && (
            <div className="nav-account-popover" role="menu">
              {user ? (
                <>
                  <div className="px-2 pb-2 text-[11px] font-extrabold uppercase tracking-[.08em] text-stone-500">
                    {user.name || "My Account"}
                  </div>
                  <Link to={dashboardPathFor(user.role)} onClick={closeMenus} className="nav-popover-link" role="menuitem">
                    Dashboard
                  </Link>
                  <button type="button" onClick={handleLogout} className="nav-popover-link nav-popover-danger" role="menuitem">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenus} className="nav-popover-link" role="menuitem">
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMenus} className="nav-popover-link nav-popover-primary" role="menuitem">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-stone-200/70 bg-white/98 px-4 pb-5 pt-3 shadow-lg xl:hidden">
          <nav className="grid gap-1 sm:grid-cols-2" aria-label="Mobile">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={closeMenus}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2.5 text-sm font-bold ${isActive ? "bg-leaf-100 text-leaf-800" : "text-navy-800 hover:bg-leaf-50"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-3 flex items-center gap-2 border-t border-stone-100 pt-3">
            {user ? (
              <>
                <Link to={dashboardPathFor(user.role)} onClick={closeMenus} className="nav-popover-link flex-1" role="menuitem">
                  Dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="nav-popover-link nav-popover-danger flex-1" role="menuitem">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenus} className="nav-popover-link flex-1" role="menuitem">
                  Login
                </Link>
                <Link to="/register" onClick={closeMenus} className="nav-popover-link nav-popover-primary flex-1" role="menuitem">
                  Sign Up
                </Link>
              </>
            )}
            <Link
              to="/customer/cart"
              onClick={closeMenus}
              className="nav-popover-link nav-popover-cart"
              aria-label={`Cart with ${itemCount} items`}
            >
              <Icon name="basket" className="h-[17px] w-[17px]" />
              <span>{itemCount}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
