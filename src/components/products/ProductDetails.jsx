// src/components/products/ProductDetails.jsx
import React, { useState } from "react";
import Header from "../layout/Header"; 
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../context/ProductContext";
import { ArrowLeft, Pencil, Trash2, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

  const API_BASE = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim())|| "https://localhost:5000";
  const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductById, deleteProduct } = useProduct();

  const [product, setProduct] = React.useState(null);
  const [modalImage, setModalImage] = useState(null);

  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    const loadProduct = async () => {
      if (!isAuthenticated) return;
      const fetched = await fetchProductById(id);
      if (fetched) setProduct(fetched);
    };
    loadProduct();
  }, [id, isAuthenticated]);


  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      navigate("/products");
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-60 text-gray-600 text-lg">
        Product not found
      </div>
    );
  }

  return (
    <>
    <Header title="" />
    <div className="pl-64 pt-20 pr-4 py-8"> {/* Sidebar offset padding */}
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        <div className="bg-white shadow-xl rounded-xl p-6 relative">
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Section */}
            {product.images?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                      src={img.startsWith("http") ? img : `${API_BASE}${img}`}
                    alt={`Product ${index}`}
                    onClick={() => setModalImage(`${API_BASE}${img}`)}
                    className="w-full h-40 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No images available</div>
            )}

            {/* Product Info */}
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-gray-800">{product.name}</h2>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <span className="font-medium text-gray-700">Code:</span> {product.code}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Weight:</span> {product.weight}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Capacity:</span> {product.capacity}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Dimensions:</span> {product.dimensions}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Category:</span>{" "}
                  <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    {product.category}
                  </span>
                </div>
              </div>
              {/* Action buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => navigate(`/products/${product.id}/edit`)}
                  className="flex items-center px-3 py-1.5 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-sm"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-3 py-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200 text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {modalImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative max-w-3xl w-full">
              <button
                onClick={() => setModalImage(null)}
                className="absolute top-3 right-3 text-white hover:text-red-500"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={modalImage}
                alt="Expanded view"
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ProductDetails;
