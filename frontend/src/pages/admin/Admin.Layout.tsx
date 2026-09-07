import { NavLink, Outlet, useNavigate } from "react-router-dom";


type IconName =
  | "dashboard"
  | "appointments"
  | "services"
  | "availability"
  | "revenue"
  | "settings";

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "dashboard") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }

  if (name === "appointments") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }

  if (name === "services") {
    return (
      <svg {...common}>
        <path d="M12 3l2.7 5.5L21 9.4l-4.5 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2L3 9.4l6.3-.9L12 3z" />
      </svg>
    );
  }

  if (name === "availability") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 14" />
      </svg>
    );
  }

  if (name === "revenue") {
    return (
      <svg {...common}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7H14.5a3.5 3.5 0 010 7H7" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21h-2.6v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 008 15a1.7 1.7 0 00-1.5-1H6v-2.6h.5A1.7 1.7 0 008 10a1.7 1.7 0 00-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 001.9.3 1.7 1.7 0 001-1.5V5h2.6v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.5 1h.1V14h-.1a1.7 1.7 0 00-1.5 1z" />
    </svg>
  );
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

  const storedUser = localStorage.getItem("lume_admin_user");

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
    localStorage.removeItem("lume_admin_token");
    localStorage.removeItem("lume_admin_user");

    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-name">LUME</div>
          <div className="admin-brand-subtitle">
            Beauty Studio
          </div>
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
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            Lume Beauty Studio
          </div>

          <div className="admin-topbar-right">
            <input
              type="search"
              className="admin-search"
              placeholder="Search..."
              aria-label="Search"
            />

            <div className="admin-avatar">
              {adminName
                .split(" ")
                .map((word) => word.charAt(0))
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