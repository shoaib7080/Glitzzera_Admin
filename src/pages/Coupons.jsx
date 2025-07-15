import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

const Coupons = () => {
  const { setCurrentPage } = useContext(AppContext);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState({ isOpen: false, coupon: null });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/coupons`
      );
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (couponId) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/coupons/${couponId}`,
          {
            method: "DELETE",
          }
        );
        fetchCoupons();
      } catch (error) {
        console.error("Error deleting coupon:", error);
      }
    }
  };

  const handleUpdateStatus = async (couponId, newStatus) => {
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/coupons/${couponId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      fetchCoupons();
      setEditModal({ isOpen: false, coupon: null });
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  };

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.couponCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl text-black font-bold">
            Coupons ({filteredCoupons.length})
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border placeholder-gray-400 text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <button
              onClick={() => setCurrentPage("addCoupon")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
            >
              Add Coupon
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Coupon
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Code
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Usage
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded object-cover"
                          src={coupon.image}
                          alt={coupon.title}
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {coupon.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {coupon.desc}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm font-mono text-gray-900">
                      {coupon.couponCode}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                      ₹{coupon.amount}
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-sm text-gray-900">
                      {coupon.times_used}/{coupon.limit_of_use}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          coupon.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <div className="flex flex-col sm:flex-row gap-1">
                        <button
                          onClick={() => setEditModal({ isOpen: true, coupon })}
                          className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Edit Coupon
            </h2>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Title:</span>{" "}
                {editModal.coupon.title}
              </div>
              <div>
                <span className="font-semibold">Code:</span>{" "}
                {editModal.coupon.couponCode}
              </div>
              <div>
                <label className="block font-semibold mb-2">Status:</label>
                <select
                  value={editModal.coupon.status}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      coupon: { ...editModal.coupon, status: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setEditModal({ isOpen: false, coupon: null })}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      editModal.coupon._id,
                      editModal.coupon.status
                    )
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
