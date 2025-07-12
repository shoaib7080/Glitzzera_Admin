// src/pages/Customers.jsx
import { useState, useEffect } from "react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data
  const dummyCustomers = [
    {
      _id: "64a1b2c3d4e5f6789012345a",
      name: "Priya Sharma",
      email: "priya.sharma@gmail.com",
      phone: "+91 9876543210",
      status: true,
      orderCount: 5,
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      _id: "64a1b2c3d4e5f6789012345b",
      name: "Rahul Gupta",
      email: "rahul.gupta@yahoo.com",
      phone: "+91 8765432109",
      status: true,
      orderCount: 2,
      createdAt: "2024-02-20T14:45:00Z",
    },
    {
      _id: "64a1b2c3d4e5f6789012345c",
      name: "Anita Patel",
      email: "anita.patel@hotmail.com",
      phone: "+91 7654321098",
      status: false,
      orderCount: 0,
      createdAt: "2024-03-10T09:15:00Z",
    },
    {
      _id: "64a1b2c3d4e5f6789012345d",
      name: "Vikram Singh",
      email: "vikram.singh@gmail.com",
      phone: "+91 6543210987",
      status: true,
      orderCount: 8,
      createdAt: "2024-01-05T16:20:00Z",
    },
    {
      _id: "64a1b2c3d4e5f6789012345e",
      name: "Meera Joshi",
      email: "meera.joshi@outlook.com",
      phone: "+91 5432109876",
      status: true,
      orderCount: 3,
      createdAt: "2024-04-12T11:30:00Z",
    },
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // const response = await fetch(
      //   "https://glitzzera-backend.vercel.app/api/customers"
      // );
      // const data = await response.json();
      // setCustomers(data.customers || data || []);

      // SImulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCustomers(dummyCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (customerId, currentStatus) => {
    try {
      // const response = await fetch(
      //   `https://glitzzera-backend.vercel.app/api/customers/${customerId}`,
      //   {
      //     method: "PUT",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ status: !currentStatus }),
      //   }
      // );
      // if (response.ok) {
      //   await fetchCustomers();
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === customerId
            ? { ...customer, status: !currentStatus }
            : customer
        )
      );
    } catch (error) {
      console.error("Error updating customer status:", error);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {customer.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {customer._id?.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.phone || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.orderCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.status ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() =>
                        handleStatusToggle(customer._id, customer.status)
                      }
                      className={`mr-3 ${
                        customer.status
                          ? "text-red-600 hover:text-red-900"
                          : "text-green-600 hover:text-green-900"
                      }`}
                    >
                      {customer.status ? "Block" : "Unblock"}
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
    </div>
  );
};

export default Customers;
