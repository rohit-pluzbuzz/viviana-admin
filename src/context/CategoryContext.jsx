// src/context/CategoryContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext"; // ⬅️ Import the auth context


const CategoryContext = createContext();
export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  const fetchAllCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  const addCategory = async ({ name, description }) => {
    try {
      const res = await axios.post("/categories", { name, description });
      setCategories((prev) => [...prev, res.data]);
      toast.success("Category added!");
    } catch (err) {
      console.error(err);
      toast.error("Add category failed");
    }
    if (err.response?.status === 409) {
      toast.error(err.response.data.error); // Shows "Category name already exists"
    } else {
      toast.error("Add/Update category failed");
    }

  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error("Delete category failed");
    }
  };
  
  const updateCategory = async (id, { name, description }) => {
  try {
    await axios.put(`/categories/${id}`, { name, description });
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, name, description } : cat
      )
    );
    toast.success("Category updated!");
  } catch (err) {
    console.error(err);
    toast.error("Update category failed");
  }
  if (err.response?.status === 409) {
    toast.error(err.response.data.error); // Shows "Category name already exists"
  } else {
    toast.error("Add/Update category failed");
  }

};

  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated){
      fetchAllCategories();
    }
  }, [isAuthenticated]);

  return (
    <CategoryContext.Provider
      value={{ categories, addCategory, deleteCategory, updateCategory, fetchAllCategories }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
