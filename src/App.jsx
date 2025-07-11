import React, { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import EditProduct from "./components/EditProducts";

const App = () => {
  const { currentPage } = useContext(AppContext);

  // Render different components based on the current page
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "editProduct":
        return <EditProduct />;
      // Add more cases for other pages as needed
      default:
        return <Dashboard />;
    }
  };

  // Main layout
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1">{renderPage()}</div>
    </div>
  );
};

export default App;
