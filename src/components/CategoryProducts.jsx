import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

const CategoryProducts = () => {
  const { selectedCategory, setCurrentPage, setSelectedProduct } =
    useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryProducts();
    }
  }, [selectedCategory]);

  const fetchCategoryProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/by-category/${
          selectedCategory._id
        }`
      );
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching category products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage("editProduct");
  };

  const filteredProducts = products.filter(
    (product) =>
      product.shortTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDesc?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!selectedCategory) {
    return (
      <div className="p-6">
        <div className="text-center">No category selected</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage("categories")}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              ← Back to Categories
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl text-black font-bold">
                {selectedCategory.catname}
              </h1>
              <p className="text-sm text-gray-500">
                ({filteredProducts.length} products)
              </p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border placeholder-gray-400 text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm
                ? "No products found matching your search."
                : "No products in this category."}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Rating
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
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-3 sm:px-6 py-4">
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
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                        <div className="line-through text-gray-400">
                          ₹{product.price}
                        </div>
                        <div className="text-green-600 font-medium">
                          ₹{product.discountPrice}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-sm">
                        <div
                          className={`${
                            product.stockQty < 10
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {product.stockQty}
                        </div>
                        {product.is_oos && (
                          <div className="text-xs text-red-500">
                            Out of Stock
                          </div>
                        )}
                      </td>
                      <td className="hidden lg:table-cell px-3 sm:px-6 py-4 text-sm">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-gray-700">
                            {product.ratings}/5
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
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
                      <td className="px-3 sm:px-6 py-4 text-sm">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
