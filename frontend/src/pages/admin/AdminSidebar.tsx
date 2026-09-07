import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Clock,
  Wallet,
  Users,
  Star,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Appointments", to: "/admin/appointments", icon: CalendarDays },
  { label: "Services", to: "/admin/services", icon: Sparkles },
  { label: "Availability", to: "/admin/availability", icon: Clock },
  { label: "Revenue", to: "/admin/revenue", icon: Wallet },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Reviews", to: "/admin/reviews", icon: Star },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  return (
    <aside className="flex h-screen w-64 flex-col justify-between bg-lume-chocolate px-4 py-6 text-lume-cream">
      <div>
        <div className="mb-10 px-2">
          <h1 className="font-display text-2xl tracking-wide">Lume</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-lume-cream/60">
            Beauty Studio
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-lume-espresso text-lume-cream"
                    : "text-lume-cream/70 hover:bg-lume-espresso/50 hover:text-lume-cream"
                }`
              }
            >
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-lume-cream/70 transition-colors hover:bg-lume-espresso/50 hover:text-lume-cream">
        <LogOut size={18} strokeWidth={1.75} />
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;