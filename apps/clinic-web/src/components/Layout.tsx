import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/queue", label: "Live Queue", icon: "🔄" },
    ...(user?.role === "MANAGER" || user?.role === "ADMIN"
      ? [{ to: "/reports", label: "Reports", icon: "📈" }]
      : []),
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-5">
          <img
            src="/logo.jpg"
            alt="Smart Health System"
            className="h-9 w-9 object-contain"
          />
          <div>
            <div className="text-sm font-bold text-slate-900">SHS Clinic</div>
            <div className="text-xs text-slate-500">{user?.role}</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 px-2">
            <div className="text-sm font-semibold text-slate-900">
              {user?.name}
            </div>
            <div className="text-xs text-slate-500">
              {user?.email || user?.phone}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Mobile header */}
        <header className="border-b border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">SHS Clinic Dashboard</div>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Sign Out
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
