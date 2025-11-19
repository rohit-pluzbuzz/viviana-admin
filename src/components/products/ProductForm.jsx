// src/components/products/ProductForm.jsx

import React, { useEffect, useState } from "react";
import Header from "../layout/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useCategory } from "../../context/CategoryContext";
import { useProduct } from "../../context/ProductContext";
import { toast } from "react-hot-toast";
import { uploadImage } from "../../utils/uploadImage";
import { useAuth } from "../../context/AuthContext";

const ProductForm = () => {
  const API_BASE =
    (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) || "";

  const navigate = useNavigate();
  const { id } = useParams();
  const { categories } = useCategory();
  const { addProduct, editProduct, fetchProductById } = useProduct();
  const { isAuthenticated } = useAuth();

  const editing = id && id !== "new";

  const [existingProduct, setExistingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    weight: "",
    capacity: "",
    dimensions: "",
    category: "",
    images: [], // actual real files OR stored URLs
  });

  const [imagePreviews, setImagePreviews] = useState([]); // blob URLs & stored URLs
  const [modalImage, setModalImage] = useState(null);

  // -------------------------
  // Load existing product
  // -------------------------
  useEffect(() => {
    if (editing) {
      const load = async () => {
        if (!isAuthenticated) return;
        const fetched = await fetchProductById(id);

        if (fetched) {
          setExistingProduct(fetched);

          // fetched.images = ["/uploads/xxx.png"]
          setForm({
            ...fetched,
            images: fetched.images || [],
          });

          // previews must match
          setImagePreviews(fetched.images || []);
        }
      };
      load();
    }
  }, [id, editing, isAuthenticated]);

  // -------------------------
  // Input handlers
  // -------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------
  // Image Selection (New Files)
  // -------------------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // store real files in form.images
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));

    // store previews separately
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  // -------------------------
  // Remove Image
  // -------------------------
  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // -------------------------
  // Submit
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload only real File objects
      const uploadedImageUrls = await Promise.all(
        form.images.map(async (file) => {
          // Case 1 — already saved in DB ("/uploads/xxx")
          if (typeof file === "string" && file.startsWith("/uploads/"))
            return file;

          // Case 2 — preview blob URLs → ignore
          if (typeof file === "string" && file.startsWith("blob:"))
            return null;

          // Case 3 — real file upload
          return await uploadImage(file);
        })
      );

      const finalImages = uploadedImageUrls.filter(Boolean);

      const productData = {
        ...form,
        id: editing ? existingProduct.id : undefined,
        images: finalImages,
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
      console.error(err);
      toast.error("Error uploading product");
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
          {/* FORM FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NAME */}
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>

            {/* CODE */}
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Product Code
              </label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* WEIGHT */}
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Weight
              </label>
              <input
                type="text"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* CAPACITY */}
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Capacity
              </label>
              <input
                type="text"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* DIMENSIONS */}
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={form.dimensions}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
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

          {/* FILE INPUT */}
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Upload Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full file:border file:px-3 file:py-2 file:rounded-lg"
            />
          </div>

          {/* PREVIEWS */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
              {imagePreviews.map((img, index) => {
                const previewSrc =
                  img.startsWith("blob:")
                    ? img
                    : img.startsWith("http")
                    ? img
                    : `${API_BASE}${img}`;

                return (
                  <div key={index} className="relative group overflow-hidden">
                    <img
                      src={previewSrc}
                      alt=""
                      onClick={() => setModalImage(previewSrc)}
                      className="w-full h-40 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              {editing ? "Update Product" : "Save Product"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="bg-gray-200 px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* MODAL */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setModalImage(null)}
          >
            <img
              src={modalImage}
              alt=""
              className="max-w-4xl max-h-[80vh] rounded-lg shadow-xl"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductForm;
