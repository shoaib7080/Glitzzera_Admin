// src/components/EditCategoryModal.jsx
import { useState, useContext, memo, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const EditCategoryModal = memo(({ category, isOpen, onClose }) => {
  const { fetchCategories } = useContext(AppContext);
  const [formData, setFormData] = useState({
    catname: category?.catname || "",
    status: category?.status ?? true,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setFormData({
        catname: category?.catname || "",
        status: category?.status ?? true,
      });
      setImage(category?.image || null);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, category]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("catname", formData.catname);
      formDataToSend.append("status", formData.status);

      if (image instanceof File) {
        formDataToSend.append("image", image);
      } else if (image) {
        formDataToSend.append("imageUrl", image);
      }

      const response = await fetch(
        `https://glitzzera-backend.vercel.app/api/categories/${category._id}`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      );
      if (response.ok) {
        await fetchCategories();
        onClose();
      }
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50 transition-all duration-200 ease-out ${
        isOpen ? "bg-opacity-50 backdrop-blur-sm" : "bg-opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg p-6 w-96 max-w-md mx-4 transition-all duration-200 ease-out transform ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        style={{
          animation: isOpen
            ? "modalSpring 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Edit Category</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            {image ? (
              <div className="relative group">
                <img
                  src={
                    image instanceof File ? URL.createObjectURL(image) : image
                  }
                  alt="Category"
                  className="w-full h-32 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
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
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl text-gray-400 mb-1">+</div>
                  <div className="text-xs text-gray-500">Add Image</div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={formData.catname}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, catname: e.target.value }))
              }
              className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value === "true",
                }))
              }
              className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

EditCategoryModal.displayName = "EditCategoryModal";

export default EditCategoryModal;
