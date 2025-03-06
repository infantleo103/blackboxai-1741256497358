import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const featuredCategories = [
    {
      id: 'men',
      title: 'Men\'s Collection',
      image: '/images/categories/mens.jpg',
      path: '/products/men',
    },
    {
      id: 'women',
      title: 'Women\'s Collection',
      image: '/images/categories/womens.jpg',
      path: '/products/women',
    },
    {
      id: 'kids',
      title: 'Kids\' Collection',
      image: '/images/categories/kids.jpg',
      path: '/products/kids',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-75"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Design Your Style
            </h1>
            <p className="text-xl mb-8">
              Create unique, custom-designed apparel that reflects your personality.
            </p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className="group relative overflow-hidden rounded-lg shadow-lg aspect-w-3 aspect-h-4"
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity"></div>
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Design Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Create Your Custom Design</h2>
              <p className="text-gray-600 mb-8">
                Express yourself with our easy-to-use design tool. Upload your artwork,
                add text, and create unique pieces that stand out.
              </p>
              <Link
                to="/customize"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Designing
              </Link>
            </div>
            <div className="relative">
              <img
                src="/images/custom-design.jpg"
                alt="Custom Design Tool"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                <p className="text-lg font-semibold">Easy to Use</p>
                <p className="text-sm">Drag & Drop Interface</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl text-blue-600 mb-4">
                <i className="fas fa-tshirt"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Materials</h3>
              <p className="text-gray-600">
                Premium fabrics and materials for lasting comfort and durability.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl text-blue-600 mb-4">
                <i className="fas fa-paint-brush"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Custom Designs</h3>
              <p className="text-gray-600">
                Create unique pieces with our easy-to-use design tools.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl text-blue-600 mb-4">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Fast Shipping</h3>
              <p className="text-gray-600">
                Quick and reliable delivery to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
