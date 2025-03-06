import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { removeItem, updateQuantity } from '../store/slices/cartSlice';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const handleQuantityChange = (
    id: string,
    size: string,
    newQuantity: number
  ) => {
    dispatch(updateQuantity({ id, size, quantity: newQuantity }));
  };

  const handleRemoveItem = (id: string, size: string) => {
    dispatch(removeItem({ id, size }));
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-400 mb-4">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="p-6 border-b last:border-b-0"
                >
                  <div className="flex space-x-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 mb-2">Size: {item.size}</p>
                          {item.customization && (
                            <p className="text-sm text-blue-600 mb-2">
                              Customized Design
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.size,
                                Math.max(0, item.quantity - 1)
                              )
                            }
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="text-lg font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id, item.size)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {total >= 50 ? 'Free' : '$5.00'}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">
                      ${(total + (total >= 50 ? 0 : 5)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block w-full mt-4 text-center text-blue-600 hover:text-blue-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
