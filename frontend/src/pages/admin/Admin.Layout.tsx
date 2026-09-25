import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Clock3,
  Wallet,
  Settings,
  LogOut,
  Search,
} from "lucide-react";

import lumeLogo from "../../assets/public/logo/lume logo.jpeg";

type IconName =
  | "dashboard"
  | "appointments"
  | "services"
  | "availability"
  | "revenue"
  | "settings";

function Icon({ name }: { name: IconName }) {
  const icons = {
    dashboard: LayoutDashboard,
    appointments: CalendarDays,
    services: Sparkles,
    availability: Clock3,
    revenue: Wallet,
    settings: Settings,
  };

  const IconComponent = icons[name];

  return <IconComponent size={18} strokeWidth={1.8} />;
}

const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: "dashboard" as IconName,
  },
  {
    label: "Appointments",
    path: "/admin/appointments",
    icon: "appointments" as IconName,
  },
  {
    label: "Services",
    path: "/admin/services",
    icon: "services" as IconName,
  },
  {
    label: "Availability",
    path: "/admin/availability",
    icon: "availability" as IconName,
  },
  {
    label: "Revenue",
    path: "/admin/revenue",
    icon: "revenue" as IconName,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: "settings" as IconName,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const storedUser = localStorage.getItem(
    "lume_admin_user"
  );

  let adminName = "Lume Admin";
  let adminEmail = "admin@lumebeautystudio.com";

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);

      if (user.name) {
        adminName = user.name;
      }

      if (user.email) {
        adminEmail = user.email;
      }
    } catch {
      // Ignore invalid stored user data.
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(
      "lume_admin_token"
    );

    localStorage.removeItem(
      "lume_admin_user"
    );

    setMobileMenuOpen(false);

    navigate("/admin/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  return (
    <div className="admin-shell">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`admin-sidebar ${
          mobileMenuOpen
            ? "admin-sidebar-open"
            : ""
        }`}
      >
        <div className="admin-brand">
          <img
            src={lumeLogo}
            alt="Lume Beauty Studio"
            className="admin-brand-logo"
          />
        </div>

        <nav className="admin-navigation">
          <div className="admin-navigation-label">
            Management
          </div>

          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `admin-nav-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="admin-nav-icon">
                <Icon name={item.icon} />
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-name">
            {adminName}
          </div>

          <div className="admin-user-email">
            {adminEmail}
          </div>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              aria-label="Open navigation"
              className="admin-mobile-menu-button"
              onClick={() =>
                setMobileMenuOpen(true)
              }
            >
              <Menu size={22} />
            </button>

            <div className="admin-topbar-title">
              Lume Beauty Studio
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-search-wrapper">
              <Search size={15} />

              <input
                type="search"
                className="admin-search"
                placeholder="Search..."
                aria-label="Search"
              />
            </div>

            <div className="admin-avatar">
              {adminName
                .split(" ")
                .map((word) =>
                  word.charAt(0)
                )
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}