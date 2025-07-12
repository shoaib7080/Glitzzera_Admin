import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  // States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    lowStock: 0,
  });

  // Functions
  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem("glitzzera_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchProducts();
      fetchCategories();
    } else {
      setLoading(false);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("glitzzera_admin_auth", "true");
    fetchProducts();
    fetchCategories();
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("glitzzera_admin_auth");
    setCurrentPage("dashboard");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://glitzzera-backend.vercel.app/api/products"
      );
      const data = await response.json();
      setProducts(data.products);
      setStats({
        totalProducts: data.totalCount || 0,
        activeProducts: data.activeCount || 0,
        outOfStock: data.outOfStockCount || 0,
        lowStock: data.lowStockCount || 0,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://glitzzera-backend.vercel.app/api/categories"
      );
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const contextValue = {
    products,
    categories,
    loading,
    currentPage,
    selectedProduct,
    stats,
    isAuthenticated,
    sidebarOpen,
    toggleSidebar,
    login,
    logout,
    fetchProducts,
    fetchCategories,
    setCurrentPage,
    setSelectedProduct,
  };

  return (
    <AppContext.Provider value={contextValue}> {children}</AppContext.Provider>
  );
};

export default AppContextProvider;
