import React, { useEffect, useState } from "react";
import Header from "../layout/Header"; 
import { Link } from "react-router-dom";
import { useProduct } from "../../context/ProductContext";
import { useCategory } from "../../context/CategoryContext";
import { toast } from "react-hot-toast";
import { FaEye, FaEdit, FaTrash, FaFileCsv, FaPlus, FaCheck } from "react-icons/fa";
// import { ClipLoader } from "react-spinners";
import { CSVLink } from "react-csv";
import { useAuth } from "../../context/AuthContext";


const ProductList = () => {
  const API_BASE = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) || "";
  const { products, deleteProduct, fetchAllProducts } = useProduct();
  const { categories, fetchAllCategories } = useCategory();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const productsPerPage = 10;

  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (!isAuthenticated) return;
    const loadData = async () => {
      setLoading(true);
      await fetchAllProducts();
      await fetchAllCategories();
      setLoading(false);
    };
    loadData();
  }, [isAuthenticated]);

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await deleteProduct(deleteId);
    toast.success("Product deleted successfully");
    setShowModal(false);
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    for (let id of selectedProducts) {
      await deleteProduct(id);
    }
    toast.success("Selected products deleted");
    setSelectedProducts([]);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const headers = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Code", key: "code" },
    { label: "Weight", key: "weight" },
    { label: "Capacity", key: "capacity" },
    { label: "Dimensions", key: "dimensions" },
    { label: "Category", key: "category" },
  ];

  return (
    <>
    <Header title="" />
    <div className="ml-64 pt-20 min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📦 Product Management</h1>
        <div className="flex space-x-2">
          <Link
            to="/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> Add Product
          </Link>
          <CSVLink
            data={products}
            headers={headers}
            filename="products_export.csv"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
          >
            <FaFileCsv /> Export All
          </CSVLink>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or code..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        {selectedProducts.length > 0 && (
          <>
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Selected
            </button>
            <CSVLink
              data={products.filter((p) => selectedProducts.includes(p.id))}
              headers={headers}
              filename="selected_products.csv"
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Export Selected
            </CSVLink>
          </>
        )}
      </div>

      {/* Table */}
      { currentProducts.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 text-gray-700 uppercase">
              <tr>
                <th className="p-3 text-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedProducts(
                        e.target.checked ? currentProducts.map((p) => p.id) : []
                      )
                    }
                    checked={
                      selectedProducts.length === currentProducts.length &&
                      currentProducts.length > 0
                    }
                  />
                </th>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Code</th>
                <th className="p-3">Weight</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Dimensions</th>
                <th className="p-3">Category</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </td>
                  <td className="p-3">
                    {product.images?.[0] ? (
                      <img
                        src={
                          product.images?.length > 0
                            ? (product.images[0].startsWith("http")
                                ? product.images[0]
                                : `${API_BASE}${product.images[0]}`)
                            : "https://via.placeholder.com/300x300?text=No+Image"
                        }
                        alt={product.name}
                          className="w-full h-auto md:h-96 object-cover"
                      />

                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3">{product.code}</td>
                  <td className="p-3">{product.weight}</td>
                  <td className="p-3">{product.capacity}</td>
                  <td className="p-3">{product.dimensions}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-10 flex gap-2 text-lg">
                    <Link to={`/products/${product.id}`} className="text-blue-600 hover:text-blue-800">
                      <FaEye />
                    </Link>
                    <Link to={`/products/${product.id}/edit`} className="text-green-600 hover:text-green-800">
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => openDeleteModal(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h2 className="text-lg mb-4">Are you sure you want to delete this product?</h2>
            <div className="space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ProductList;
