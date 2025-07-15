import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  // States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("glitzzera_admin_currentPage") || "dashboard";
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // States for Orders
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [message, setMessage] = useState({ text: "", type: "" }); // For displaying success/error messages

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    lowStock: 0,
  });

  // Update the setCurrentPage function to persist the page
  const setCurrentPageWithPersistence = (page) => {
    setCurrentPage(page);
    localStorage.setItem("glitzzera_admin_currentPage", page);
  };

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
    localStorage.removeItem("glitzzera_admin_currentPage");
    setCurrentPage("dashboard");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`
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
      setProducts([]);
      setStats({
        totalProducts: 0,
        activeProducts: 0,
        outOfStock: 0,
        lowStock: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/categories`
      );
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // --- Order Related Functions ---
  const fetchOrders = async () => {
    try {
      setOrderLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setMessage({ text: "Failed to load orders.", type: "error" });
    } finally {
      setOrderLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      const response = await fetch(
        ` ${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );
      if (!response.ok) {
        // Attempt to read error message from response if available
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      const newOrder = await response.json();
      setOrders((prevOrders) => [...prevOrders, newOrder]); // Add the new order to the state
      setMessage({ text: "Order placed successfully!", type: "success" });
      fetchOrders(); // Re-fetch orders to ensure the list is up-to-date
      return newOrder;
    } catch (error) {
      console.error("Error creating order:", error);
      setMessage({
        text: `Error placing order: ${error.message}`,
        type: "error",
      });
      throw error; // Re-throw to allow component to handle specific errors if needed
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
    // State values for orders
    orders,
    orderLoading,
    selectedOrder,
    message,
    toggleSidebar,
    login,
    logout,
    fetchProducts,
    fetchCategories,
    setCurrentPage: setCurrentPageWithPersistence,
    setSelectedProduct,
    // Functions for orders
    fetchOrders,
    createOrder,
    setSelectedOrder,
    setMessage,
  };

  return (
    <AppContext.Provider value={contextValue}> {children}</AppContext.Provider>
  );
};

export default AppContextProvider;
