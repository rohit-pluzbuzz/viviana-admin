import React, { useEffect, useState } from "react";
import Header from "../layout/Header"; 
import { useNavigate, useParams } from "react-router-dom";
import { useCategory } from "../../context/CategoryContext";
import { useProduct } from "../../context/ProductContext";
import { toast } from "react-hot-toast";
import { uploadImage } from "../../utils/uploadImage";
import { useAuth } from "../../context/AuthContext";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories } = useCategory();
  const { addProduct, editProduct, fetchProductById } = useProduct();

  const editing = id && id !== "new";
  const [existingProduct, setExistingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    weight: "",
    capacity: "",
    dimensions: "",
    category: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (editing) {
      const loadProduct = async () => {
        if (!isAuthenticated) return;
        const fetched = await fetchProductById(id);
        if (fetched) {
          setExistingProduct(fetched);
          setForm({ ...fetched, images: fetched.images || [] });
          setImagePreviews(fetched.images || []);
        }
      };
      loadProduct();
    }
  }, [id, editing, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (indexToRemove) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadedImageUrls = await Promise.all(
        form.images.map(async (file) => {
          if (typeof file === "string") return file;
          return await uploadImage(file);
        })
      );

      const productData = {
        ...form,
        id: editing ? existingProduct.id : undefined,
        images: uploadedImageUrls,
      };

      if (editing) {
        await editProduct(productData.id, productData);
        toast.success("Product updated successfully!");
      } else {
        await addProduct(productData);
        toast.success("Product added successfully!");
      }

      navigate("/products");
    } catch (err) {
      toast.error("Error uploading product");
      console.error(err);
    }
  };

  if (editing && !existingProduct) {
    return (
      <div className="pl-[260px] max-w-3xl mx-auto p-6">
        <p className="text-red-600 font-semibold">Product not found.</p>
      </div>
    );
  }

  return (
    <>
    <Header title="" />
    <div className="ml-[260px] pt-20 max-w-4xl mx-auto bg-white p-8 mt-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        {editing ? "Edit Product" : "Add Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Product Code
            </label>
            <input
              type="text"
              name="code"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.code}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Weight
            </label>
            <input
              type="text"
              name="weight"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.weight}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Capacity
            </label>
            <input
              type="text"
              name="capacity"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.capacity}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Dimensions
            </label>
            <input
              type="text"
              name="dimensions"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.dimensions}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Category
            </label>
            <select required
              name="category"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-semibold">
            Upload Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full file:border file:border-gray-300 file:px-3 file:py-2 file:rounded-lg file:bg-gray-100 file:text-sm"
          />
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {imagePreviews.map((img, index) => (
              <div key={index} className="relative group overflow-hidden">
                <img
                    key={index}
                    src={`${API_BASE}${img}`}
                    alt={`Product ${index}`}
                    onClick={() => setModalImage(`${API_BASE}${img}`)}
                    className="w-full h-40 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-6 flex flex-wrap gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            {editing ? "Update Product" : "Save Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Preview"
            className="max-w-4xl max-h-[80vh] rounded-lg shadow-xl"
          />
        </div>
      )}
    </div>
    </>
  );
};

export default ProductForm;
