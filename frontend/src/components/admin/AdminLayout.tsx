import { Outlet, NavLink, useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

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

       <div className="p-6 border-b border-white/10">
  <Link to="/admin" className="flex flex-col items-start focus:outline-none group">
    <div className="flex items-center gap-2">
      <span className="font-serif text-xl font-normal tracking-[0.2em] text-[#FDFBF7] uppercase leading-none">
        LUME
      </span>
      <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-[#D4C3B5] border border-white/10">
        Admin
      </span>
    </div>
    <span className="text-[8px] font-sans tracking-[0.35em] text-[#D4C3B5] uppercase mt-1 opacity-80">
      Management Studio
    </span>
  </Link>
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