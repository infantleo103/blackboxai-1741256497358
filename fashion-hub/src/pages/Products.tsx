import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setFilters, clearFilters } from '../store/slices/productSlice';
import type { Product } from '../store/slices/productSlice';

const Products: React.FC = () => {
  const dispatch = useDispatch();
  const { category, subcategory } = useParams();
  const { filteredItems, loading, error } = useSelector((state: RootState) => state.products);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

  useEffect(() => {
    // Apply filters based on URL parameters
    dispatch(setFilters({
      category: category || null,
      subcategory: subcategory || null,
    }));

    return () => {
      dispatch(clearFilters());
    };
  }, [category, subcategory, dispatch]);

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const applyPriceFilter = () => {
    dispatch(setFilters({ priceRange }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex space-x-2 text-gray-600">
          <li>
            <Link to="/" className="hover:text-blue-600">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/products" className="hover:text-blue-600">Products</Link>
          </li>
          {category && (
            <>
              <li>/</li>
              <li>
                <Link to={`/products/${category}`} className="hover:text-blue-600">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              </li>
            </>
          )}
          {subcategory && (
            <>
              <li>/</li>
              <li className="text-gray-900 font-medium">
                {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
              </li>
            </>
          )}
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Min Price</label>
                  <input
                    type="number"
                    name="min"
                    value={priceRange.min}
                    onChange={handlePriceRangeChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Max Price</label>
                  <input
                    type="number"
                    name="max"
                    value={priceRange.max}
                    onChange={handlePriceRangeChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={applyPriceFilter}
                  className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((product: Product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow overflow-hidden group"
              >
                <div className="relative aspect-w-3 aspect-h-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isCustomizable && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs">
                        Customizable
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
                  <div className="flex space-x-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                    {product.isCustomizable && (
                      <Link
                        to={`/customize/${product.id}`}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        <i className="fas fa-paint-brush"></i>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
