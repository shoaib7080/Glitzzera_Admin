// src/pages/Categories.jsx
import { useContext, useState, useCallback, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import EditCategoryModal from "../components/EditCategoryModal";

const Categories = () => {
  const { categories, products, loading, fetchCategories, setCurrentPage } =
    useContext(AppContext);
  const [deleting, setDeleting] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleEdit = useCallback((category) => {
    setEditingCategory(category);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingCategory(null);
  }, []);

  const handleDelete = useCallback(
    async (category) => {
      if (
        window.confirm(`Are you sure you want to delete "${category.catname}"?`)
      ) {
        setDeleting(category._id);
        try {
          const response = await fetch(
            `https://glitzzera-backend.vercel.app/api/categories/${category._id}`,
            { method: "DELETE" }
          );
          if (response.ok) {
            await fetchCategories();
          }
        } catch (error) {
          console.error("Error deleting category:", error);
        } finally {
          setDeleting(null);
        }
      }
    },
    [fetchCategories]
  );

  const productCounts = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category._id] = products.filter(
        (product) => product.category?._id === category._id
      ).length;
      return acc;
    }, {});
  }, [categories, products]);

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
        <h1 className="text-3xl text-black font-bold">
          Categories ({categories.length})
        </h1>
        <button
          onClick={() => setCurrentPage("addCategory")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center mb-4">
              <img
                src={category.image}
                alt={category.catname}
                className="w-16 h-16 rounded-lg object-cover mr-4"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.catname}
                </h3>
                <p className="text-sm text-gray-500">
                  {productCounts[category._id] || 0} products
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  category.status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {category.status ? "Active" : "Inactive"}
              </span>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  disabled={deleting === category._id}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  {deleting === category._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EditCategoryModal
        category={editingCategory}
        isOpen={!!editingCategory}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Categories;
