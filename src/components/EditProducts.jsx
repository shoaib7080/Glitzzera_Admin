import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import accordionIcon from "../assets/icons/accordion.svg";

const EditProduct = () => {
  const { selectedProduct, setCurrentPage, fetchProducts } =
    useContext(AppContext);
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState({
    sizeName: "",
    stockQty: 0,
    is_oos: false,
  });
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState("");

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the actual file object for FormData
      setImages([...images, file]);
    }
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Add basic info fields
      Object.keys(basicInfo).forEach((key) => {
        formData.append(key, basicInfo[key]);
      });

      // Add sizes as JSON string
      formData.append("sizes", JSON.stringify(sizes));

      // Add video URL
      formData.append("video", video);

      // Add image files
      images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      const response = await fetch(
        `https://glitzzera-backend.vercel.app/api/products/${selectedProduct._id}`,
        {
          method: "PUT",
          body: formData, // Don't set Content-Type header for FormData
        }
      );

      if (response.ok) {
        await fetchProducts();
        setCurrentPage("products");
      } else {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => setCurrentPage("products")}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            ← Back to Products
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
        </div>

        {/* Accordion Container */}
        <div className="bg-neutral-200 rounded-lg shadow-sm overflow-hidden">
          {/* Accordion 1: Basic Information */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 0 ? -1 : 0)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-neutral-200 transition-colors"
            >
              <span className="text-lg font-medium text-gray-900">
                Basic Information
              </span>
              <img
                src={accordionIcon}
                alt="accordion"
                className={`w-5 h-5 transform transition-transform filter brightness-0 ${
                  activeAccordion === 0 ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeAccordion === 0 && (
              <div className="px-6 pb-6 bg-neutral-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Title
                    </label>
                    <input
                      type="text"
                      name="shortTitle"
                      value={basicInfo.shortTitle}
                      onChange={handleBasicInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Long Title
                    </label>
                    <input
                      type="text"
                      name="longTitle"
                      value={basicInfo.longTitle}
                      onChange={handleBasicInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={basicInfo.price}
                      onChange={handleBasicInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Price (₹)
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={basicInfo.discountPrice}
                      onChange={handleBasicInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stockQty"
                      value={basicInfo.stockQty}
                      onChange={handleBasicInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      name="status"
                      checked={basicInfo.status}
                      onChange={handleBasicInfoChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500  border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Active Status
                    </label>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description
                    </label>
                    <textarea
                      name="shortDesc"
                      value={basicInfo.shortDesc}
                      onChange={handleBasicInfoChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Long Description
                    </label>
                    <textarea
                      name="longDesc"
                      value={basicInfo.longDesc}
                      onChange={handleBasicInfoChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setActiveAccordion(1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next: Sizes →
                </button>
              </div>
            )}
          </div>

          {/* Accordion 2: Sizes */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 1 ? -1 : 1)}
              className="w-full px-6 py-4 text-left flex justify-between items-center transition-colors"
            >
              <span className="text-lg font-medium text-gray-900">
                Sizes Management
              </span>
              <img
                src={accordionIcon}
                alt="accordion"
                className={`w-5 h-5 transform transition-transform filter brightness-0 ${
                  activeAccordion === 1 ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeAccordion === 1 && (
              <div className="px-6 pb-6 bg-neutral-200">
                <div className="space-y-3 mb-4">
                  {sizes.map((size, index) => (
                    <div
                      key={size._id}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-md"
                    >
                      <input
                        type="text"
                        value={size.sizeName}
                        onChange={(e) =>
                          handleUpdateSize(index, "sizeName", e.target.value)
                        }
                        className="w-20 px-2 py-1 border text-gray-700 border-gray-300 rounded bg-white"
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
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-gray-700 bg-white"
                        placeholder="Qty"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={size.is_oos}
                          onChange={(e) =>
                            handleUpdateSize(index, "is_oos", e.target.checked)
                          }
                          className="mr-1"
                        />
                        Out of Stock
                      </label>
                      <button
                        onClick={() => handleDeleteSize(index)}
                        className="text-red-600 hover:text-red-800 px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-white border  border-gray-300 rounded-md mb-6">
                  <h3 className="font-medium mb-2">Add New Size</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSize.sizeName}
                      onChange={(e) =>
                        setNewSize({ ...newSize, sizeName: e.target.value })
                      }
                      className="w-20 px-2 py-1 border text-gray-700 border-gray-300 rounded"
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
                      className="w-24 px-2 py-1 border text-gray-700 border-gray-300 rounded"
                      placeholder="Qty"
                    />
                    <button
                      onClick={handleAddSize}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Add Size
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setActiveAccordion(2)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
              className="w-full px-6 py-4 text-left flex justify-between items-center transition-colors"
            >
              <span className="text-lg font-medium text-gray-900">
                Images & Video
              </span>
              <img
                src={accordionIcon}
                alt="accordion"
                className={`w-5 h-5 transform transition-transform filter brightness-0 ${
                  activeAccordion === 2 ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeAccordion === 2 && (
              <div className="px-6 pb-6">
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Product Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={
                            image instanceof File
                              ? URL.createObjectURL(image)
                              : image
                          }
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {/* Add Image Div - Only show if less than 4 images */}
                    {images.length < 4 && (
                      <div
                        onClick={() =>
                          document.getElementById("imageInput").click()
                        }
                        className="w-full h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-center">
                          <div className="text-2xl text-gray-400 mb-1">+</div>
                          <div className="text-xs text-gray-500">Add Image</div>
                        </div>
                      </div>
                    )}

                    {/* Hidden File Input */}
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Video URL
                  </label>
                  <input
                    type="url"
                    value={video}
                    onChange={(e) => setVideo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Product"}
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
