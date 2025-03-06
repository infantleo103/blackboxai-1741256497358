import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    {
      name: 'Men',
      path: '/products/men',
      subcategories: [
        { name: 'T-shirts', path: '/products/men/tshirts' },
        { name: 'Pants', path: '/products/men/pants' },
        { name: 'Shirts', path: '/products/men/shirts' },
        { name: 'Shorts', path: '/products/men/shorts' },
      ],
    },
    {
      name: 'Women',
      path: '/products/women',
      subcategories: [
        { name: 'T-shirts', path: '/products/women/tshirts' },
        { name: 'Dresses', path: '/products/women/dresses' },
        { name: 'Pants', path: '/products/women/pants' },
        { name: 'Tops', path: '/products/women/tops' },
      ],
    },
    {
      name: 'Kids',
      path: '/products/kids',
      subcategories: [
        { name: 'T-shirts', path: '/products/kids/tshirts' },
        { name: 'Shorts', path: '/products/kids/shorts' },
        { name: 'Dresses', path: '/products/kids/dresses' },
        { name: 'Pants', path: '/products/kids/pants' },
      ],
    },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              FashionHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {categories.map((category) => (
              <div key={category.name} className="relative group">
                <Link
                  to={category.path}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  {category.name}
                </Link>
                <div className="absolute z-10 hidden group-hover:block w-48 bg-white shadow-lg py-2 mt-1">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.path}
                      to={subcategory.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Cart and Mobile Menu Button */}
          <div className="flex items-center">
            <Link
              to="/cart"
              className="p-2 text-gray-700 hover:text-blue-600 relative"
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden ml-4 p-2 text-gray-700 hover:text-blue-600"
            >
              <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          {categories.map((category) => (
            <div key={category.name} className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to={category.path}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                {category.name}
              </Link>
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.path}
                  to={subcategory.path}
                  className="block pl-6 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
