import React, { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import EditProduct from "./components/EditProducts";
import Categories from "./pages/Categories";
import Customers from "./pages/Customers";
import Login from "./pages/Login";
import AddProduct from "./components/AddProduct";
import AddCategory from "./components/AddCategory";

const App = () => {
  const {
    currentPage,
    isAuthenticated,
    login,
    loading,
    toggleSidebar,
    sidebarOpen,
  } = useContext(AppContext);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }
  // Render different components based on the current page
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "editProduct":
        return <EditProduct />;
      case "addProduct":
        return <AddProduct />;
      case "categories":
        return <Categories />;
      case "addCategory":
        return <AddCategory />;
      case "customers":
        return <Customers />;
      default:
        return <Dashboard />;
    }
  };

  // Main layout
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-0">{renderPage()}</div>
    </div>
  );
};

export default App;
