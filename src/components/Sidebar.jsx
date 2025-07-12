import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import dashboardIcon from "../assets/icons/dashboard.svg";
import productIcon from "../assets/icons/product.svg";
import categoryIcon from "../assets/icons/category.svg";
import cartIcon from "../assets/icons/cart.svg";
import userIcon from "../assets/icons/user.svg";
import settingIcon from "../assets/icons/setting.svg";

const Sidebar = () => {
  const { currentPage, setCurrentPage, logout, sidebarOpen, toggleSidebar } =
    useContext(AppContext);

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: dashboardIcon },
    { key: "products", label: "Products", icon: productIcon },
    { key: "categories", label: "Categories", icon: categoryIcon },
    { key: "orders", label: "Orders", icon: cartIcon },
    { key: "customers", label: "Customers", icon: userIcon },
    { key: "settings", label: "Settings", icon: settingIcon },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 min-h-screen p-6 flex-col">
        <div className="mb-10">
          <h2 className="text-3xl font-light bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
            Glitzzera
          </h2>
          <p className="text-gray-400 text-sm font-light">Admin Panel</p>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-100 flex items-center space-x-3 ${
                currentPage === item.key
                  ? "bg-blue-500/10 text-blue-200 border-l-3 border-blue-400"
                  : "hover:bg-white/5 text-gray-300 hover:text-white"
              }`}
            >
              <img
                src={item.icon}
                alt={item.label}
                className={`w-5 h-5 ${
                  currentPage === item.key
                    ? "filter brightness-0 invert opacity-80"
                    : "filter brightness-0 invert opacity-60"
                }`}
              />
              <span className="font-light">{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="w-full text-left px-4 py-3 rounded-lg transition-all duration-100 text-gray-300 hover:text-white hover:bg-red-500/10 mt-4 flex items-center space-x-3"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="font-light">Logout</span>
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-3 flex flex-col fixed z-50 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="mb-6 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors self-start"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Menu Items */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setCurrentPage(item.key);
                if (sidebarOpen) toggleSidebar();
              }}
              className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center ${
                sidebarOpen ? "justify-start space-x-3" : "justify-center"
              } ${
                currentPage === item.key
                  ? "bg-blue-500/10 text-blue-200"
                  : "hover:bg-white/5 text-gray-300 hover:text-white"
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <img
                src={item.icon}
                alt={item.label}
                className={`w-5 h-5 flex-shrink-0 ${
                  currentPage === item.key
                    ? "filter brightness-0 invert opacity-80"
                    : "filter brightness-0 invert opacity-60"
                }`}
              />
              {sidebarOpen && (
                <span className="font-light whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={logout}
          className={`w-full p-3 rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-red-500/10 mt-4 flex items-center ${
            sidebarOpen ? "justify-start space-x-3" : "justify-center"
          }`}
          title={!sidebarOpen ? "Logout" : undefined}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {sidebarOpen && (
            <span className="font-light whitespace-nowrap overflow-hidden">
              Logout
            </span>
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
