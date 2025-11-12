//viviana-admin/src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import ProductList from "./components/products/ProductList";
import ProductForm from "./components/products/ProductForm";
import ProductDetails from "./components/products/ProductDetails";
import CategoryManager from "./components/categories/CategoryManager";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";
import Signup from "./pages/Signup";
import Login from "./pages/login";


const App = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/signup"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex">
       <Toaster position="top-right" />
      {!shouldHideSidebar && <Sidebar />}
      <div className="flex-grow p-4">

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* ✅ Protected routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
          <Route path="/products/new" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/products/:id/edit" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/products/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><CategoryManager /></PrivateRoute>} />

          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>


      </div>
    </div>
  );
};

export default App;
