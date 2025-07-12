// src/components/AddCategory.jsx
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const AddCategory = () => {
  const { setCurrentPage, fetchCategories } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    catname: "",
    status: true,
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("catname", formData.catname);
      formDataToSend.append("status", formData.status);

      if (image) {
        formDataToSend.append("image", image);
      }

      const response = await fetch(
        "https://glitzzera-backend.vercel.app/api/categories",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        await fetchCategories();
        setCurrentPage("categories");
      } else {
        const errorData = await response.json();
        console.error("Create failed:", errorData);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => setCurrentPage("categories")}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            ← Back to Categories
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Add New Category
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image
              </label>
              {image ? (
                <div className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Category"
                    className="w-full h-48 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  onClick={() =>
                    document.getElementById("categoryImageInput").click()
                  }
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-3xl text-gray-400 mb-2">📷</div>
                    <div className="text-sm text-gray-500">
                      Click to add category image
                    </div>
                  </div>
                </div>
              )}
              <input
                id="categoryImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                name="catname"
                value={formData.catname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
                required
              />
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Active Status
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setCurrentPage("categories")}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
