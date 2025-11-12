import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, LogIn, User, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; 
import { useState } from "react";


const Header = ({ title = "Dashboard" }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  return (
    <>
    <header className="fixed top-0 left-64 right-0 z-40 bg-white dark:bg-gray-900 shadow px-6 py-4 flex justify-between items-center border-b dark:border-gray-700">
      {/* Left - Page Title */}
      <h1 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
         {title}
      </h1>

      {/* Right - Actions */}
      <div className="flex items-center gap-4">
        

        <button className="relative text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <button onClick={() => navigate("/settings")} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
          <Settings size={20} />
        </button>

        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <User size={18} /> {user?.name || "User"}
            </div>
            <button onClick={() => setShowLogoutModal(true)} className="text-red-600 hover:underline text-sm">
              <LogOut size={20} />
            </button>

          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                <LogIn size={20} />
                Login
            </button>
            <button onClick={() => navigate("/signup")} className="text-green-600 hover:underline text-sm ml-2">
                Sign Up
            </button>
            </>

        )}
      </div>
    </header>

    {showLogoutModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h2>
          <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                logout();
                setShowLogoutModal(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Header;
