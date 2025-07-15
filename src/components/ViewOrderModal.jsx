// src/components/ViewOrderModal.jsx
import { useState } from "react";

const ViewOrderModal = ({ order, isOpen, onClose, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState(order?.orderStatus || "");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const handleUpdateStatus = async (status) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(order._id, status);
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
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

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-spring"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Order Information
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-gray-500">Order ID:</span>{" "}
                  <span className="font-mono">{order._id}</span>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="text-gray-500">Total Amount:</span> ₹
                  {order.totalAmount}
                </div>
                <div>
                  <span className="text-gray-500">Discount:</span> ₹
                  {order.discount}
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Customer Information
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>{" "}
                  {order.userId?.name || "N/A"}
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>{" "}
                  {order.userId?.email || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Payment Information
            </h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-gray-500">Method:</span>{" "}
                {order.paymentInfo.method}
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    order.paymentInfo.status === "Success"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.paymentInfo.status}
                </span>
              </div>
              {order.paymentInfo.transactionId && (
                <div>
                  <span className="text-gray-500">Transaction ID:</span>{" "}
                  <span className="font-mono">
                    {order.paymentInfo.transactionId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {order.addressId ? (
                <>
                  <p>
                    {order.addressId.houseNo}, {order.addressId.address1}
                  </p>
                  {order.addressId.address2 && (
                    <p>{order.addressId.address2}</p>
                  )}
                  <p>{order.addressId.landmark}</p>
                  <p>
                    {order.addressId.city}, {order.addressId.state} -{" "}
                    {order.addressId.pincode}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ({order.addressId.type})
                  </p>
                </>
              ) : (
                <p className="text-gray-500">
                  Address information not available
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
            <div className="space-y-3">
              {order.products.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded"
                >
                  {item.productId?.images &&
                  item.productId.images.length > 0 ? (
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId?.shortTitle || "Product"}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {item.productId?.shortTitle || "Unknown Product"}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Qty: {item.quantity}</span>
                      {item.size && <span>Size: {item.size}</span>}
                      <span>₹{item.productId?.price}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ₹{(item.productId?.price || 0) * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update Section */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-3">
              Update Order Status
            </h3>
            <div className="flex items-center space-x-4 mb-4">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button
                onClick={() => handleUpdateStatus(newStatus)}
                disabled={isUpdating || newStatus === order.orderStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </button>
            </div>

            {/* Cancel Order Button */}
            {order.orderStatus !== "Cancelled" &&
              order.orderStatus !== "Delivered" && (
                <button
                  onClick={() => handleUpdateStatus("Cancelled")}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {isUpdating ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderModal;
