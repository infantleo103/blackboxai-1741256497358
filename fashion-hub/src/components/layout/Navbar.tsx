import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Navbar: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAdmin = useSelector((state: RootState) => state.auth.user?.isAdmin);
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <i className="fas fa-tshirt text-blue-600 text-2xl mr-2"></i>
              <span className="text-xl font-bold text-gray-900">FashionHub</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                Products
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <i className="fas fa-chart-line mr-2"></i>
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Link
              to="/cart"
              className="group inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors relative"
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  {totalItems}
                </span>
              )}
            </Link>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                className="p-1 rounded-full text-gray-900 hover:text-blue-600 transition-colors focus:outline-none"
              >
                <i className="fas fa-user text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
          >
            Products
          </Link>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="block pl-3 pr-4 py-2 text-base font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <i className="fas fa-chart-line mr-2"></i>
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
