import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import dashboardIcon from "../assets/icons/dashboard.svg";
import productIcon from "../assets/icons/product.svg";
import categoryIcon from "../assets/icons/category.svg";
import cartIcon from "../assets/icons/cart.svg";
import userIcon from "../assets/icons/user.svg";
import settingIcon from "../assets/icons/setting.svg";

const Sidebar = () => {
  const { currentPage, setCurrentPage } = useContext(AppContext);

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: dashboardIcon },
    { key: "products", label: "Products", icon: productIcon },
    { key: "categories", label: "Categories", icon: categoryIcon },
    { key: "orders", label: "Orders", icon: cartIcon },
    { key: "customers", label: "Customers", icon: userIcon },
    // { key: "analytics", label: "Analytics", icon: dashboardIcon },
    { key: "settings", label: "Settings", icon: settingIcon },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 min-h-screen p-6">
      <div className="mb-10">
        <h2 className="text-3xl font-light bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
          Glitzzera
        </h2>
        <p className="text-gray-400 text-sm font-light">Admin Panel</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setCurrentPage(item.key)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-100 flex items-center space-x-3 relative ${
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
    </div>
  );
};

export default Sidebar;
