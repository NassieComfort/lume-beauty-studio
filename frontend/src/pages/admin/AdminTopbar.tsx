import { Bell, Search } from "lucide-react";

const AdminTopbar = () => {
  return (
    <header className="flex items-center justify-between border-b border-lume-cream/10 bg-lume-charcoal px-8 py-5">
      <h2 className="font-display text-2xl text-lume-cream">Dashboard</h2>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 rounded-full bg-lume-chocolate px-4 py-2">
          <Search size={16} className="text-lume-cream/50" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-48 bg-transparent text-sm text-lume-cream placeholder:text-lume-cream/40 focus:outline-none"
          />
        </div>

        <button className="relative rounded-full bg-lume-chocolate p-2.5 text-lume-cream/80 hover:text-lume-cream">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-lume-cream text-[10px] font-semibold text-lume-charcoal">
            2
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-lume-espresso" />
          <div>
            <p className="text-sm font-medium text-lume-cream">Lume Admin</p>
            <p className="text-xs text-lume-cream/50">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;