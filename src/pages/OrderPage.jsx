import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";

// // Utility function to format date
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Simple Message Box Component
const MessageBox = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor =
    type === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-red-100 border-red-400 text-red-700";

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg border ${bgColor} z-50`}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-lg font-bold text-gray-600 hover:text-gray-800"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const OrderPage = () => {
  const {
    products,
    loading,
    orders,
    orderLoading,
    createOrder,
    message,
    setMessage,
    fetchOrders,
  } = useContext(AppContext);

  // State for modals and UI
  const [deleteOrderModal, setDeleteOrderModal] = useState({
    open: false,
    order: null,
  });
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewOrderModal, setViewOrderModal] = useState({
    open: false,
    order: null,
  });
  const [updateStatusModal, setUpdateStatusModal] = useState({
    open: false,
    order: null,
  });
  const [addOrderModal, setAddOrderModal] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addProductInput, setAddProductInput] = useState("");
  const [newOrderLoading, setNewOrderLoading] = useState(false);
  const [newOrderProducts, setNewOrderProducts] = useState([]);
  const [newOrderPayment, setNewOrderPayment] = useState("COD");

  // State for creating a new order
  const [selectedProductsForOrder, setSelectedProductsForOrder] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Mock User and Address IDs
  const MOCK_USER_ID = "60c72b2f9b1e8b0015f8e1a0";
  const MOCK_ADDRESS_ID = "60c72b2f9b1e8b0015f8e1a1";

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.includes(searchTerm);

    const matchesStatus =
      filterStatus === "All" || order.orderStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate total amount for the new order
  const calculateTotalAmount = () => {
    return selectedProductsForOrder.reduce((total, item) => {
      const product = products.find((p) => p._id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  // Add product to the new order list
  const handleAddProductToOrder = (productId) => {
    const existingProduct = selectedProductsForOrder.find(
      (item) => item.productId === productId
    );
    if (existingProduct) {
      setSelectedProductsForOrder((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedProductsForOrder((prev) => [
        ...prev,
        { productId, quantity: 1, size: "" },
      ]);
    }
  };

  // Update quantity or size for a product in the new order list
  const handleUpdateProductInOrder = (productId, field, value) => {
    setSelectedProductsForOrder((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, [field]: value } : item
      )
    );
  };

  // Remove product from the new order list
  const handleRemoveProductFromOrder = (productId) => {
    setSelectedProductsForOrder((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  };

  // Handle placing a new order
  const handlePlaceOrder = async () => {
    if (selectedProductsForOrder.length === 0) {
      setMessage({ text: "Please add products to your order.", type: "error" });
      return;
    }

    setIsCreatingOrder(true);
    const orderData = {
      userId: MOCK_USER_ID,
      addressId: MOCK_ADDRESS_ID,
      products: selectedProductsForOrder.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size || undefined,
      })),
      paymentInfo: {
        method: paymentMethod,
        status: paymentMethod === "COD" ? "Pending" : "Pending",
      },
      totalAmount: calculateTotalAmount(),
      discount: 0,
      isPaid: paymentMethod !== "COD",
    };

    await createOrder(orderData);
    setSelectedProductsForOrder([]);
    setPaymentMethod("COD");
    setAddOrderModal(false);
    setIsCreatingOrder(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
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
        await fetchOrders();
        setMessage({
          text: "Order status updated successfully!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setMessage({ text: "Failed to update order status.", type: "error" });
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (orderLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-6">
      <MessageBox
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ text: "", type: "" })}
      />

      {/* Fixed Header */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 className="text-3xl text-gray-900 font-bold">
          Orders ({orders.length})
        </h1>
        <div className="flex items-center space-x-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setAddOrderModal(true)}
          >
            Add Order
          </button>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border placeholder-gray-400 text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white p-2 sm:p-4 lg:p-8 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
          Your Orders
        </h2>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No orders found. Try changing the filter!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.userId?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.userId?.email || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-green-600 whitespace-nowrap">
                      ₹
                      {order.totalAmount ? order.totalAmount.toFixed(2) : "N/A"}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.products.map((item, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">
                              {item.productId?.shortTitle || "Unknown Product"}
                            </span>
                            <span className="text-gray-500 ml-2">
                              ₹{item.productId?.price || 0} × {item.quantity}
                              {item.size && ` (${item.size})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() =>
                          setUpdateStatusModal({ open: true, order })
                        }
                      >
                        Update
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() =>
                          setDeleteOrderModal({ open: true, order })
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Order Modal */}
      {viewOrderModal.open && viewOrderModal.order && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
              onClick={() => setViewOrderModal({ open: false, order: null })}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-700">
              Order Details
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Order ID:</span>{" "}
                {viewOrderModal.order._id}
              </div>
              <div>
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(viewOrderModal.order.createdAt)}
              </div>
              <div>
                <span className="font-semibold">Amount:</span> ₹
                {viewOrderModal.order.totalAmount
                  ? viewOrderModal.order.totalAmount.toFixed(2)
                  : "N/A"}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {viewOrderModal.order.orderStatus}
              </div>
              <div>
                <span className="font-semibold">Items:</span>{" "}
                {viewOrderModal.order.products
                  .map((item) => {
                    const product = products.find(
                      (p) => p._id === item.productId
                    );
                    return product
                      ? `${product.name} (x${item.quantity})`
                      : `Unknown Product (x${item.quantity})`;
                  })
                  .join(", ")}
              </div>
              <div>
                <span className="font-semibold">Payment Method:</span>{" "}
                {viewOrderModal.order.paymentInfo?.method || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Paid:</span>{" "}
                {viewOrderModal.order.isPaid ? "Yes" : "No"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {updateStatusModal.open && updateStatusModal.order && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
              onClick={() => setUpdateStatusModal({ open: false, order: null })}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-green-700">
              Update Order Status
            </h3>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Order ID:</span>{" "}
                {updateStatusModal.order._id}
              </div>
              <div>
                <span className="font-semibold">Current Status:</span>{" "}
                {updateStatusModal.order.orderStatus}
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Change Status:
                </label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  value={updateStatusModal.order.orderStatus}
                  onChange={(e) =>
                    setUpdateStatusModal((modal) => ({
                      ...modal,
                      order: { ...modal.order, orderStatus: e.target.value },
                    }))
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <button
                className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg shadow font-semibold w-full"
                onClick={() => {
                  // Here you would call an updateOrderStatus API
                  setMessage({
                    text: "Order status updated (mock)",
                    type: "success",
                  });
                  setUpdateStatusModal({ open: false, order: null });
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Order Modal */}
      {addOrderModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
              onClick={() => setAddOrderModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-green-700">
              Add New Order
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Add Product:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                    placeholder="Type product name..."
                    value={addProductInput || ""}
                    onChange={(e) => setAddProductInput(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                    onClick={() => {
                      if (!addProductInput) return;
                      const match = products.find(
                        (p) =>
                          p.name.toLowerCase() ===
                          addProductInput.trim().toLowerCase()
                      );
                      if (
                        match &&
                        !newOrderProducts.some(
                          (item) => item.productId === match._id
                        )
                      ) {
                        setNewOrderProducts((prev) => [
                          ...prev,
                          { productId: match._id, quantity: 1 },
                        ]);
                        setAddProductInput("");
                      } else {
                        setMessage({
                          text: "Product not found or already added.",
                          type: "error",
                        });
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {newOrderProducts.map((item, idx) => {
                    const product = products.find(
                      (p) => p._id === item.productId
                    );
                    return (
                      <div
                        key={item.productId}
                        className="flex items-center gap-2"
                      >
                        <span className="font-semibold">
                          {product ? product.name : "Unknown"}
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          className="border rounded px-2 py-1 w-16"
                          onChange={(e) => {
                            const qty = parseInt(e.target.value) || 1;
                            setNewOrderProducts((prev) =>
                              prev.map((it, i) =>
                                i === idx ? { ...it, quantity: qty } : it
                              )
                            );
                          }}
                        />
                        <button
                          className="text-red-500 font-bold"
                          onClick={() =>
                            setNewOrderProducts((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Payment Method:
                </label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  value={newOrderPayment}
                  onChange={(e) => setNewOrderPayment(e.target.value)}
                >
                  <option value="COD">COD</option>
                  <option value="Online">Online</option>
                </select>
              </div>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow font-semibold w-full"
                disabled={newOrderLoading}
                onClick={async () => {
                  if (newOrderProducts.length === 0) {
                    setMessage({
                      text: "Please select products.",
                      type: "error",
                    });
                    return;
                  }
                  setNewOrderLoading(true);
                  // Mock order creation
                  await new Promise((res) => setTimeout(res, 1000));
                  setMessage({ text: "Order added (mock)", type: "success" });
                  setNewOrderProducts([]);
                  setAddOrderModal(false);
                  setNewOrderLoading(false);
                }}
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Order Modal */}
      {deleteOrderModal.open && deleteOrderModal.order && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
              onClick={() => setDeleteOrderModal({ open: false, order: null })}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-red-700">
              Delete Order
            </h3>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">
                  Are you sure you want to delete this order?
                </span>
              </div>
              <div>
                <span className="font-semibold">Order ID:</span>{" "}
                {deleteOrderModal.order._id}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold"
                  onClick={() =>
                    setDeleteOrderModal({ open: false, order: null })
                  }
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                  onClick={() => {
                    // Here you would call a deleteOrder API
                    setMessage({
                      text: "Order deleted (mock)",
                      type: "success",
                    });
                    setDeleteOrderModal({ open: false, order: null });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
