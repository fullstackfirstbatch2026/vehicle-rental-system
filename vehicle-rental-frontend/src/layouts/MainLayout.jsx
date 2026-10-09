import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Users,
  ClipboardList,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Vehicles",
      path: "/vehicles",
      icon: Car,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Rentals",
      path: "/rentals",
      icon: ClipboardList,
    },
    {
      name: "Payments",
      path: "/payments",
      icon: CreditCard,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
  ];

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          inset-y-0 left-0
          z-50
          w-64
          bg-slate-900
          text-white
          min-h-screen
          flex flex-col
          transform
          transition-transform
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* Logo */}
        <div className="p-6 border-b border-slate-700">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-white text-slate-900 flex items-center justify-center">
                <Car size={22} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-wide">
                  DRIVEGO
                </h1>

                <p className="text-xs text-slate-400">
                  Vehicle Rental
                </p>
              </div>

            </div>

            {/* Mobile Close */}
            <button
              onClick={closeSidebar}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X size={22} />
            </button>

          </div>

        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-3">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} />

                    <span className="font-medium">
                      {item.name}
                    </span>

                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-900" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700">

          <div className="flex items-center gap-3 px-3 py-3">

            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>

            <div>
              <p className="text-sm font-medium">
                Admin Panel
              </p>

              <p className="text-xs text-slate-400">
                System Administrator
              </p>
            </div>

          </div>

        </div>

      </aside>

      {/* Main Area */}
      <main className="flex-1 min-w-0">

        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center"
            >
              <Menu size={22} className="text-slate-700" />
            </button>

            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                Vehicle Rental Management
              </h2>

              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                Manage your rental operations
              </p>
            </div>

          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3">

            <div className="text-right hidden sm:block">

              <p className="text-sm font-medium text-slate-800">
                Admin
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>

            </div>

            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-semibold">
              A
            </div>

          </div>

        </header>

        {/* Page Content */}
        <section className="p-4 sm:p-6 lg:p-8">
          {children}
        </section>

      </main>

    </div>
  );
}

export default MainLayout;