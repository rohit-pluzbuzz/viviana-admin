import React, { useState } from "react";
import Header from "../layout/Header"; 
import { useCategory } from "../../context/CategoryContext";

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategory();
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId !== null) {
      updateCategory(editId, form);
      setEditId(null);
    } else {
      addCategory({ ...form });
    }
    setForm({ name: "", description: "" });
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description });
    setEditId(cat.id);
  };

  return (
    <>
      <Header title="" />
      <div className="ml-64 pt-20 min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Manage Categories</h2>

          <form onSubmit={handleSubmit} className="space-y-5 mb-10">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                placeholder="Enter category name"
                className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Enter description (optional)"
                className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {editId !== null ? "Update Category" : "Add Category"}
              </button>
              {editId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: "", description: "" });
                    setEditId(null);
                  }}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <ul className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <li key={cat.id} className="py-4 flex justify-between items-start">
                <div>
                  <p className="text-lg font-medium text-gray-900">{cat.name}</p>
                  <p className="text-sm text-gray-500">{cat.description}</p>
                </div>
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(cat.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Delete confirmation modal */}
          {deleteId !== null && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
              <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md animate-fade-in">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this category?</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      deleteCategory(deleteId);
                      setDeleteId(null);
                    }}
                    className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryManager;
