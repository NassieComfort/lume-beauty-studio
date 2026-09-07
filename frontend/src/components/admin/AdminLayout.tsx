import { Outlet, NavLink, useNavigate } from "react-router-dom";

import {
  adminLogout,
  getAdminUser,
} from "../../services/adminApi";

const navigation = [
  {
    name: "Overview",
    path: "/admin",
  },
  {
    name: "Appointments",
    path: "/admin/appointments",
  },
  {
    name: "Services",
    path: "/admin/services",
  },
  {
    name: "Availability",
    path: "/admin/availability",
  },
  {
    name: "Revenue",
    path: "/admin/revenue",
  },
  {
    name: "Settings",
    path: "/admin/settings",
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = getAdminUser();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-lume-charcoal text-lume-cream flex">

      <aside className="hidden lg:flex w-64 border-r border-white/10 flex-col">

        <div className="p-8 border-b border-white/10">
          <p className="text-xs tracking-[0.3em] uppercase text-lume-grey">
            Lume
          </p>

          <h1 className="font-display text-2xl mt-2">
            Admin
          </h1>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `block px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-lume-cream text-lume-charcoal"
                      : "text-lume-grey hover:text-lume-cream hover:bg-white/5"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 mb-3">
            <p className="text-sm">
              {user?.name || "Admin"}
            </p>

            <p className="text-xs text-lume-grey mt-1">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm text-lume-grey hover:text-lume-cream"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}