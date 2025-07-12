import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const { stats, products, loading } = useContext(AppContext);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl text-black font-bold mb-6">
        Glitzzera Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Total Products</h3>
          <p className="text-2xl text-gray-500 font-bold">
            {stats.totalProducts}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Products</h3>
          <p className="text-2xl font-bold text-green-600">
            {stats.activeProducts}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Out of Stock</h3>
          <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Low Stock</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-700 font-semibold mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
              Add New Product
            </button>
            <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100">
              View Orders
            </button>
            <button className="w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100">
              Manage Categories
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-700 font-semibold mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div>• New product added: Gold Necklace</div>
            <div>• Order #1234 completed</div>
            <div>• Stock updated for Diamond Ring</div>
            <div>• Category "Bracelets" created</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-700 font-semibold mb-4">Alerts</h3>
          <div className="space-y-2">
            {stats.lowStock > 0 && (
              <div className="p-2 bg-orange-50 text-orange-700 rounded text-sm">
                {stats.lowStock} products have low stock
              </div>
            )}
            {stats.outOfStock > 0 && (
              <div className="p-2 bg-red-50 text-red-700 rounded text-sm">
                {stats.outOfStock} products are out of stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
