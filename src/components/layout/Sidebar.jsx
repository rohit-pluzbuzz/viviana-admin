import { NavLink } from "react-router-dom";
import { FaBoxOpen, FaThList } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import logo from '../../assets/logo.png';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0 z-10">
      {/* Logo + Branding */}
      <div className="px-6 py-4 flex items-center gap-3 ">
        <img src={logo} alt="Viviana Logo" className="h-10 w-10 rounded-full object-contain" />
        <h1 className="text-xl font-semibold tracking-wide">VIVIANA CMS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4 text-sm font-medium mt-4 flex-1">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded transition-all duration-200 ${
              isActive
                ? "bg-yellow-500 text-black font-semibold"
                : "hover:bg-gray-700"
            }`
          }
        >
          <MdDashboardCustomize /> Dashboard
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded transition-all duration-200 ${
              isActive
                ? "bg-yellow-500 text-black font-semibold"
                : "hover:bg-gray-700"
            }`
          }
        >
          <FaBoxOpen /> Products
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded transition-all duration-200 ${
              isActive
                ? "bg-yellow-500 text-black font-semibold"
                : "hover:bg-gray-700"
            }`
          }
        >
          <FaThList /> Categories
        </NavLink>

        

        
      </nav>

      {/* Footer */}
      <div className="p-4 mt-auto text-xs text-gray-400">
        © {new Date().getFullYear()} Viviana. All rights reserved.
      </div>
    </aside>
  );
};

export default Sidebar;
