import React, { useContext, useState, useEffect } from "react";
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
import OrderPage from "./pages/OrderPage";
import Coupons from "./pages/Coupons";
import AddCoupon from "./components/AddCoupon";
import CategoryProducts from "./components/CategoryProducts";
import OneSignal from "react-onesignal";

const App = () => {
  const context = useContext(AppContext);
  const { currentPage, isAuthenticated, login, loading } = context;
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    OneSignal.init({
      appId: "f24916b5-6d3b-4f2b-b217-bb79311509bd", // From OneSignal dashboard
      allowLocalhostAsSecureOrigin: true, // For local testing
      notifyButton: { enable: true }, // Optional: Shows subscription bell
    }).then(() => {
      setInitialized(true);
      OneSignal.Slidedown.promptPush(); // Prompt for permission
    });
  }, []);

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
      case "orderPage":
        return <OrderPage />;
      case "customers":
        return <Customers />;
      case "coupons":
        return <Coupons />;
      case "addCoupon":
        return <AddCoupon />;
      case "categoryProducts":
        return <CategoryProducts />;
      default:
        return <Dashboard />;
    }
  };

  // Main layout
  return (
    <div className="flex bg-gray-100 min-h-screen overflow-y-hidden">
      <Sidebar />
      <div className="flex-1 ml-10 md:ml-64 overflow-x-auto">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
