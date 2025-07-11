import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Functions
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://glitzzera-backend.vercel.app/api/products"
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    // State values
    products,
    loading,
    currentPage,

    selectedProduct,

    // Stats derived from products
    stats: {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.status).length,
      outOfStock: products.filter((p) => p.is_oos).length,
      lowStock: products.filter((p) => p.stockQty < 10).length,
    },

    // functions
    fetchProducts,
    setCurrentPage,
    setSelectedProduct,
  };

  return (
    <AppContext.Provider value={contextValue}> {children}</AppContext.Provider>
  );
};

export default AppContextProvider;
