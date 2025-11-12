// viviana-admin/src/pages/Dashboard.jsx
import React from "react";
import Header from "../components/layout/Header"; 
import { useCategory } from "../context/CategoryContext";
import { useProduct } from "../context/ProductContext";
import {
  FaBoxOpen,
  FaTags,
  FaClock,
  FaChevronRight,
  FaArrowRight,
  FaInfoCircle,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { categories } = useCategory();
  const { products } = useProduct();

  const isLoading = !products || !categories;

  const latestProducts = products.slice(0, 5);

  const chartData = [
    {
      name: "Products",
      count: products.length,
    },
    {
      name: "Categories",
      count: categories.length,
    },
  ];

  return (
     <>
    <Header title="" />
    <div className="ml-64 pt-20 min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">📊 Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl shadow p-6 h-32" />
          ))
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:scale-[1.02] transition">
              <FaBoxOpen className="text-4xl" />
              <div>
                <h2 className="text-sm opacity-80 flex items-center gap-1">
                  Total Products <FaInfoCircle data-tooltip-id="productsTip" className="text-xs" />
                </h2>
                <p className="text-3xl font-semibold">{products.length}</p>
              </div>
              <Tooltip id="productsTip" content="All products in the system" place="top" />
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:scale-[1.02] transition">
              <FaTags className="text-4xl" />
              <div>
                <h2 className="text-sm opacity-80 flex items-center gap-1">
                  Total Categories <FaInfoCircle data-tooltip-id="categoriesTip" className="text-xs" />
                </h2>
                <p className="text-3xl font-semibold">{categories.length}</p>
              </div>
              <Tooltip id="categoriesTip" content="All product categories" place="top" />
            </div>

            <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:scale-[1.02] transition">
              <FaClock className="text-4xl" />
              <div>
                <h2 className="text-sm opacity-80">Last Updated</h2>
                <p className="text-lg font-medium">
                  {products.length ? new Date().toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mini Chart */}
      {!isLoading && (
        <div className="bg-white rounded-2xl shadow p-6 mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 Summary Chart</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Latest Products */}
      {!isLoading && products.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              🆕 Latest Products
            </h3>
            <Link
              to="/products"
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              View All <FaArrowRight className="ml-1" />
            </Link>
          </div>
          <ul className="divide-y divide-gray-200">
            {latestProducts.map((p) => (
              <li
                key={p.id}
                className="py-4 flex justify-between items-center group hover:bg-gray-50 transition rounded-lg px-2"
              >
                <div>
                  <p className="text-lg font-medium text-gray-800">{p.name}</p>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {p.category}
                  </span>
                </div>
                <FaChevronRight className="text-gray-400 group-hover:text-gray-600 transition" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </>
  );
};

export default Dashboard;
