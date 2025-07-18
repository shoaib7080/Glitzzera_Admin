// src/components/Products.jsx
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const Products = () => {
  const {
    products,
    loading,
    setCurrentPage,
    setSelectedProduct,
    fetchProducts,
  } = useContext(AppContext);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle product selection for editing
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage("editProduct");
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeleting(product._id);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${product._id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          await fetchProducts();
        } else {
          console.error("Delete failed");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setDeleting(null);
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.shortTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.catname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-6 ">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h1 className="text-2xl sm:text-3xl text-black font-bold">
          Products ({filteredProducts.length})
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border placeholder-gray-400 text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              setCurrentPage("addProduct");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-2 sm:p-4 lg:p-8 overflow-auto">
        <div className="overflow-x-auto relative">
          <table className="w-full relative">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sizes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky right-0 bg-gray-50 shadow-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded object-cover"
                        src={product.images?.[0]}
                        alt={product.shortTitle}
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.shortTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.shortDesc}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.category?.catname}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="line-through text-gray-400">
                      ₹{product.price}
                    </div>
                    <div className="text-green-600 font-medium">
                      ₹{product.discountPrice}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div
                      className={`${
                        product.stockQty < 10 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      Total: {product.stockQty}
                    </div>
                    {product.is_oos && (
                      <div className="text-xs text-red-500">Out of Stock</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {product.sizes?.map((size) => (
                        <span
                          key={size._id}
                          className={`px-2 py-1 text-xs rounded ${
                            size.is_oos
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {size.sizeName}: {size.stockQty}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-700">
                        {product.ratings}/5
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm sticky right-0 bg-white shadow-lg">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      disabled={deleting === product._id}
                      className="text-red-600 hover:text-red-900"
                    >
                      {deleting === product._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
