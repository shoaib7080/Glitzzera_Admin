// src/components/EditProduct.jsx
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const EditProduct = () => {
  const { selectedProduct, setCurrentPage, fetchProducts } =
    useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(0);
  // Sizes Form Data
  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState({
    sizeName: "",
    stockQty: 0,
    is_oos: false,
  });
  // Media Form Data
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState("");
  const [basicInfo, setBasicInfo] = useState({
    shortTitle: "",
    longTitle: "",
    shortDesc: "",
    longDesc: "",
    price: "",
    discountPrice: "",
    stockQty: "",
    status: false,
  });

  useEffect(() => {
    if (selectedProduct) {
      setBasicInfo({
        shortTitle: selectedProduct.shortTitle || "",
        longTitle: selectedProduct.longTitle || "",
        shortDesc: selectedProduct.shortDesc || "",
        longDesc: selectedProduct.longDesc || "",
        price: selectedProduct.price || "",
        discountPrice: selectedProduct.discountPrice || "",
        stockQty: selectedProduct.stockQty || "",
        status: selectedProduct.status || false,
      });
      setSizes([...(selectedProduct.sizes || [])]);
      setImages([...(selectedProduct.images || [])]);
      setVideo(selectedProduct.video || "");
    }
  }, [selectedProduct]);

  const handleBasicInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBasicInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSize = () => {
    if (newSize.sizeName) {
      setSizes([...sizes, { ...newSize, _id: Date.now().toString() }]);
      setNewSize({ sizeName: "", stockQty: 0, is_oos: false });
    }
  };

  const handleUpdateSize = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setSizes(updatedSizes);
  };

  const handleDeleteSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setImages([...images, url]);
    }
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updateData = {
        ...basicInfo,
        sizes,
        images,
        video,
      };

      const response = await fetch(
        `https://glitzzera-backend.vercel.app/api/products/${selectedProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        await fetchProducts();
        setCurrentPage("products");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedProduct) {
    return <div className="p-6">No product selected</div>;
  }

  return (
    <div className="min-h-screen bg-jewelry-gradient p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => setCurrentPage("products")}
            className="flex items-center text-amber-700 hover:text-amber-800 mr-6 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Products
          </button>
          <h1 className="text-4xl font-light text-gray-800">Edit Product</h1>
        </div>

        {/* Accordion Container */}
        <div className="glass-effect rounded-3xl shadow-jewelry overflow-hidden">
          {/* Accordion 1: Basic Information */}
          <div className="border-b border-amber-100">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 0 ? -1 : 0)}
              className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-amber-50/50 transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gold-gradient mr-4"></div>
                <span className="text-xl font-light text-gray-800">
                  Basic Information
                </span>
              </div>
              <div
                className={`transform transition-transform duration-300 ${
                  activeAccordion === 0 ? "rotate-45" : ""
                }`}
              >
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </button>
            {activeAccordion === 0 && (
              <div className="px-8 pb-8 bg-gradient-to-br from-white/80 to-amber-50/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Short Title
                    </label>
                    <input
                      type="text"
                      name="shortTitle"
                      value={basicInfo.shortTitle}
                      onChange={handleBasicInfoChange}
                      className="w-full px-4 py-3 bg-white/70 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Long Title
                    </label>
                    <input
                      type="text"
                      name="longTitle"
                      value={basicInfo.longTitle}
                      onChange={handleBasicInfoChange}
                      className="w-full px-4 py-3 bg-white/70 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={basicInfo.price}
                      onChange={handleBasicInfoChange}
                      className="w-full px-4 py-3 bg-white/70 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Discount Price (₹)
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={basicInfo.discountPrice}
                      onChange={handleBasicInfoChange}
                      className="w-full px-4 py-3 bg-white/70 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stockQty"
                      value={basicInfo.stockQty}
                      onChange={handleBasicInfoChange}
                      className="w-full px-4 py-3 bg-white/70 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white transition-all duration-300"
                    />
                  </div>
                  <div className="flex items-center space-x-3 pt-8">
                    <input
                      type="checkbox"
                      name="status"
                      checked={basicInfo.status}
                      onChange={handleBasicInfoChange}
                      className="w-5 h-5 text-amber-600 bg-white/70 rounded-lg focus:ring-amber-300"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Active Status
                    </label>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Short Description
                    </label>
                    <textarea
                      name="shortDesc"
                      value={basicInfo.shortDesc}
                      onChange={handleBasicInfoChange}
                      rows="2"
                      className="w-full px-4 py-3 bg-white/70 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white transition-all duration-300 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Long Description
                    </label>
                    <textarea
                      name="longDesc"
                      value={basicInfo.longDesc}
                      onChange={handleBasicInfoChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-white/70 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setActiveAccordion(1)}
                  className="px-8 py-3 bg-gold-gradient text-white rounded-2xl shadow-soft hover:shadow-jewelry transition-all duration-300 font-medium"
                >
                  Next: Sizes →
                </button>
              </div>
            )}
          </div>

          {/* Accordion 2: Sizes */}
          <div className="border-b border-amber-100">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 1 ? -1 : 1)}
              className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-amber-50/50 transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-rose-gold-gradient mr-4"></div>
                <span className="text-xl font-light text-gray-800">
                  Sizes Management
                </span>
              </div>
              <div
                className={`transform transition-transform duration-300 ${
                  activeAccordion === 1 ? "rotate-45" : ""
                }`}
              >
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </button>
            {activeAccordion === 1 && (
              <div className="px-8 pb-8 bg-gradient-to-br from-white/80 to-rose-100/30">
                <div className="space-y-4 mb-6">
                  {sizes.map((size, index) => (
                    <div
                      key={size._id}
                      className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl shadow-soft"
                    >
                      <input
                        type="text"
                        value={size.sizeName}
                        onChange={(e) =>
                          handleUpdateSize(index, "sizeName", e.target.value)
                        }
                        className="w-20 px-3 py-2 bg-white/80 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-rose-300"
                        placeholder="Size"
                      />
                      <input
                        type="number"
                        value={size.stockQty}
                        onChange={(e) =>
                          handleUpdateSize(
                            index,
                            "stockQty",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-24 px-3 py-2 bg-white/80 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-rose-300"
                        placeholder="Qty"
                      />
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={size.is_oos}
                          onChange={(e) =>
                            handleUpdateSize(index, "is_oos", e.target.checked)
                          }
                          className="w-4 h-4 text-rose-600 bg-white/80 rounded focus:ring-rose-300"
                        />
                        <span className="text-sm text-gray-700">
                          Out of Stock
                        </span>
                      </label>
                      <button
                        onClick={() => handleDeleteSize(index)}
                        className="ml-auto px-3 py-1 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white/40 rounded-2xl shadow-soft mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Add New Size
                  </h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newSize.sizeName}
                      onChange={(e) =>
                        setNewSize({ ...newSize, sizeName: e.target.value })
                      }
                      className="w-20 px-3 py-2 bg-white/80 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-rose-300"
                      placeholder="Size"
                    />
                    <input
                      type="number"
                      value={newSize.stockQty}
                      onChange={(e) =>
                        setNewSize({
                          ...newSize,
                          stockQty: parseInt(e.target.value),
                        })
                      }
                      className="w-24 px-3 py-2 bg-white/80 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-rose-300"
                      placeholder="Qty"
                    />
                    <button
                      onClick={handleAddSize}
                      className="px-4 py-2 bg-rose-gold-gradient text-white rounded-xl shadow-soft hover:shadow-jewelry transition-all duration-300"
                    >
                      Add Size
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setActiveAccordion(2)}
                  className="px-8 py-3 bg-rose-gold-gradient text-white rounded-2xl shadow-soft hover:shadow-jewelry transition-all duration-300 font-medium"
                >
                  Next: Media →
                </button>
              </div>
            )}
          </div>

          {/* Accordion 3: Images & Video */}
          <div>
            <button
              onClick={() => setActiveAccordion(activeAccordion === 2 ? -1 : 2)}
              className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-amber-50/50 transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 mr-4"></div>
                <span className="text-xl font-light text-gray-800">
                  Images & Video
                </span>
              </div>
              <div
                className={`transform transition-transform duration-300 ${
                  activeAccordion === 2 ? "rotate-45" : ""
                }`}
              >
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </button>
            {activeAccordion === 2 && (
              <div className="px-8 pb-8 bg-gradient-to-br from-white/80 to-amber-50/30">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      Product Images
                    </h3>
                    <button
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-gold-gradient text-white rounded-xl shadow-soft hover:shadow-jewelry transition-all duration-300"
                    >
                      Add Image
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-2xl shadow-soft group-hover:shadow-jewelry transition-all duration-300"
                        />
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full shadow-soft hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Product Video URL
                  </label>
                  <input
                    type="url"
                    value={video}
                    onChange={(e) => setVideo(e.target.value)}
                    className="w-full px-4 py-3 bg-white/70 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white transition-all duration-300"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-2xl shadow-jewelry hover:shadow-2xl transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Product ✨"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
