import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setFilters, clearFilters } from '../store/slices/productSlice';
import type { Product } from '../store/slices/productSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
    <div className="h-64 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const Products: React.FC = () => {
  const dispatch = useDispatch();
  const { category, subcategory } = useParams();
  const { filteredItems, loading, error, filters } = useSelector((state: RootState) => state.products);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
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
    const newValue = Number(value);
    
    setPriceRange(prev => {
      const newRange = {
        ...prev,
        [name]: newValue
      };
      
      // Ensure min doesn't exceed max and max doesn't go below min
      if (name === 'min' && newValue > prev.max) {
        newRange.min = prev.max;
      } else if (name === 'max' && newValue < prev.min) {
        newRange.max = prev.min;
      }
      
      // Apply filters with debounce
      const timeoutId = setTimeout(() => {
        dispatch(setFilters({ ...filters, priceRange: newRange }));
      }, 500);
      
      return newRange;
    });
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size];
      
      // Apply filters immediately when size is toggled
      dispatch(setFilters({ 
        ...filters,
        sizes: newSizes.length > 0 ? newSizes : null
      }));
      
      return newSizes;
    });
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    dispatch(setFilters({ 
      ...filters,
      sortBy: value === 'default' ? null : value
    }));
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Products</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex flex-wrap space-x-2 text-gray-600">
          <li>
            <Link to="/" className="hover:text-blue-600 transition-colors">
              <i className="fas fa-home mr-1"></i>
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          </li>
          {category && (
            <>
              <li>/</li>
              <li>
                <Link to={`/products/${category}`} className="hover:text-blue-600 transition-colors">
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
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => {
                  setPriceRange({ min: 0, max: 1000 });
                  setSelectedSizes([]);
                  setSortBy('default');
                  dispatch(clearFilters());
                }}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Clear All
              </button>
            </div>
            
            {/* Sort By */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={handleSort}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              >
                <option value="default">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Sizes</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all
                      ${selectedSizes.includes(size)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium">Price Range</h3>
                <span className="text-sm text-gray-600">
                  ${priceRange.min} - ${priceRange.max}
                </span>
              </div>
              <div className="space-y-4">
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange.min}
                    name="min"
                    onChange={handlePriceRangeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange.max}
                    name="max"
                    onChange={handlePriceRangeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="min"
                    value={priceRange.min}
                    onChange={handlePriceRangeChange}
                    className="w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    name="max"
                    value={priceRange.max}
                    onChange={handlePriceRangeChange}
                    className="w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {filteredItems.length} {filteredItems.length === 1 ? 'product' : 'products'} found
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((product: Product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="relative aspect-w-3 aspect-h-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isCustomizable && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs shadow-lg">
                            Customizable
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
                      <div className="flex space-x-2">
                        <Link
                          to={`/product/${product.id}`}
                          className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all hover:shadow-lg"
                        >
                          View Details
                        </Link>
                        {product.isCustomizable && (
                          <Link
                            to={`/customize/${product.id}`}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all hover:shadow-lg"
                            title="Customize Product"
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
                  <div className="text-gray-400 text-6xl mb-4">
                    <i className="fas fa-search"></i>
                  </div>
                  <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
                  <button
                    onClick={() => dispatch(clearFilters())}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
