import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import LoadingSpinner from '../../components/common/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard: React.FC = () => {
  const { items: products, loading, error } = useSelector((state: RootState) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'price' | 'category'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  // Memoized calculations for performance
  const {
    totalProducts,
    totalCustomizable,
    categoryCounts,
    averagePrice,
    filteredProducts,
    totalPages,
  } = useMemo(() => {
    const total = products.length;
    const customizable = products.filter(p => p.isCustomizable).length;
    const categories = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const avgPrice = total > 0
      ? products.reduce((sum, product) => sum + product.price, 0) / total
      : 0;

    // Filter and sort products
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      return ((aValue as number) - (bValue as number)) * modifier;
    });

    return {
      totalProducts: total,
      totalCustomizable: customizable,
      categoryCounts: categories,
      averagePrice: avgPrice,
      filteredProducts: filtered,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    };
  }, [products, searchTerm, sortField, sortDirection]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Chart data
  const categoryChartData = {
    labels: Object.keys(categoryCounts).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [
      {
        label: 'Products by Category',
        data: Object.values(categoryCounts),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
      },
    ],
  };

  const customizableChartData = {
    labels: ['Customizable', 'Standard'],
    datasets: [
      {
        data: [totalCustomizable, totalProducts - totalCustomizable],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(209, 213, 219, 0.8)'],
      },
    ],
  };

  // Handle errors
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Dashboard</h2>
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

  // Calculate pagination
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Total Products</h3>
              <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Customizable Products</h3>
              <p className="text-3xl font-bold text-green-600">{totalCustomizable}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Categories</h3>
              <p className="text-3xl font-bold text-orange-600">{Object.keys(categoryCounts).length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Average Price</h3>
              <p className="text-3xl font-bold text-purple-600">${averagePrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Products by Category</h3>
              <div className="h-64">
                <Bar
                  data={categoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const value = context.parsed.y;
                            const total = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${value} products (${percentage}%)`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customizable vs Standard Products</h3>
              <div className="h-64">
                <Pie
                  data={customizableChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const value = context.parsed;
                            const total = totalProducts;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${value} products (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <h3 className="text-lg font-medium text-gray-900">Products List</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  />
                  <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      Name
                      {sortField === 'name' && (
                        <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`}></i>
                      )}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('category')}
                    >
                      Category
                      {sortField === 'category' && (
                        <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`}></i>
                      )}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('price')}
                    >
                      Price
                      {sortField === 'price' && (
                        <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} ml-1`}></i>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customizable
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.isCustomizable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.isCustomizable ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
                    {filteredProducts.length} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } border border-gray-300 transition-colors`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } border border-gray-300 transition-colors`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
