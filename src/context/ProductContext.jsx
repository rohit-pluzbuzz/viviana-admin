// src/context/ProductContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext"; // ⬅️ Import the auth context


const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const getProductById = (id) =>
    products.find((p) => parseInt(p.id) === parseInt(id));

  const parseProductImages = (product) => ({
    ...product,
    images: typeof product.images === "string"
      ? JSON.parse(product.images || "[]")
      : product.images || [],
  });

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get("/products");
      const parsed = res.data.map(parseProductImages);
      setProducts(parsed);
    } catch (err) {
      console.error("Failed to fetch all products:", err);
      if (err.response?.status !== 401) {
        toast.error("Failed to fetch products");
      }
    }
  };

  const addProduct = async (productData) => {
    try {
      const res = await axios.post("/products", productData);
      const newProduct = parseProductImages(res.data);
      setProducts((prev) => [...prev, newProduct]);
      toast.success("Product added!");
    } catch (err) {
      console.error(err);
      toast.error("Add failed");
    }
  };

  const editProduct = async (id, updatedData) => {
    try {
      const res = await axios.put(`/products/${id}`, updatedData);
      const updated = parseProductImages(res.data);
      setProducts((prev) =>
        prev.map((p) => (parseInt(p.id) === parseInt(id) ? updated : p))
      );
      toast.success("Product updated");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => parseInt(p.id) !== parseInt(id)));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const fetchProductById = async (id) => {
    try {
      const res = await axios.get(`/products/${id}`);
      const product = parseProductImages(res.data);

      setProducts((prev) => {
        const exists = prev.find((p) => parseInt(p.id) === parseInt(product.id));
        if (exists) {
          return prev.map((p) =>
            parseInt(p.id) === parseInt(product.id) ? product : p
          );
        } else {
          return [...prev, product];
        }
      });

      return product;
    } catch (err) {
      console.error("Fetch by ID failed:", err);
      toast.error("Failed to fetch product details");
      return null;
    }
  };

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllProducts();
    }
  }, [isAuthenticated]);


  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        editProduct,
        deleteProduct,
        getProductById,
        fetchProductById,
        fetchAllProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
