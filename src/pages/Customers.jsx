// src/pages/Customers.jsx
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import ViewOrderModal from "../components/ViewOrderModal";

const Customers = () => {
  const { setCurrentPage, setSelectedOrder } = useContext(AppContext);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [viewOrderModal, setViewOrderModal] = useState({
    isOpen: false,
    order: null,
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/info`
      );
      const data = await response.json();
      setCustomers(data.detailedUsers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (customerId) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  const handleViewOrder = async (order) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}`
      );
      const fullOrderData = await response.json();
      setViewOrderModal({ isOpen: true, order: fullOrderData });
    } catch (error) {
      console.error("Error fetching order details:", error);
      // Fallback to basic order data if API fails
      setViewOrderModal({ isOpen: true, order });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderStatus: newStatus }),
        }
      );
      if (response.ok) {
        // Refresh customer data to show updated order status
        await fetchCustomers();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-gray-900 font-bold">
          Customers ({customers.length})
        </h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border placeholder-gray-400 text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div
        className="space-y-4 overflow-y-auto flex-1 pr-2 "
        style={{ scrollbarWidth: "none" }}
      >
        {filteredCustomers.map((customer) => (
          <div
            key={customer.user._id}
            className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden"
          >
            {/* Customer Summary */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={customer.user.avatar}
                    alt={customer.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${customer.user.name}&background=3b82f6&color=fff`;
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {customer.user.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {customer.user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {customer.orders.length}
                    </div>
                    <div className="text-xs text-gray-500">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {customer.wishlistItems.length}
                    </div>
                    <div className="text-xs text-gray-500">Wishlist</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Joined</div>
                    <div className="text-sm text-gray-900">
                      {new Date(customer.user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpand(customer.user._id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {expandedCustomer === customer.user._id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedCustomer === customer.user._id && (
              <div className="border-t border-gray-300 bg-gray-50 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-2 text-gray-900">
                          {customer.user.phone}
                        </span>
                      </div>
                      {customer.user.alternatePhone && (
                        <div>
                          <span className="text-gray-500">Alt Phone:</span>
                          <span className="ml-2 text-gray-900">
                            {customer.user.alternatePhone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Wishlist Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Wishlist Items ({customer.wishlistItems.length})
                    </h4>
                    {customer.wishlistItems.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {customer.wishlistItems.slice(0, 3).map((item) => (
                          <div
                            key={item._id}
                            className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border"
                          >
                            {item.productId?.shortTitle || "Unknown Product"} -
                            ₹{item.productId?.price || 0}
                          </div>
                        ))}
                        {customer.wishlistItems.length > 3 && (
                          <div className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-600">
                            +{customer.wishlistItems.length - 3} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No wishlist items</p>
                    )}
                  </div>
                </div>

                {/* All Orders List */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    All Orders ({customer.orders.length})
                  </h4>
                  {customer.orders.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {customer.orders.map((order) => (
                        <div
                          key={order._id}
                          className="flex items-center justify-between p-3 bg-white border border-gray-400 rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium text-gray-900">
                                  ₹{order.totalAmount}
                                </span>
                                <span className="ml-2 text-gray-500 text-sm">
                                  ({order.products.length} items)
                                </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    order.orderStatus === "Delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.orderStatus === "Shipped"
                                      ? "bg-blue-100 text-blue-800"
                                      : order.orderStatus === "Processing"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {order.orderStatus}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </span>
                                <button
                                  onClick={() => handleViewOrder(order)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                  View Order
                                </button>
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                              Order ID: {order._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No orders yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm
                ? "No customers found matching your search."
                : "No customers found."}
            </div>
          </div>
        )}
      </div>
      <ViewOrderModal
        order={viewOrderModal.order}
        isOpen={viewOrderModal.isOpen}
        onClose={() => setViewOrderModal({ isOpen: false, order: null })}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
};

export default Customers;
