const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true
    },
    customization: {
      color: String,
      size: {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      },
      printLocation: {
        type: String,
        enum: ['front', 'back', 'left-sleeve', 'right-sleeve']
      },
      customText: String,
      designUrl: String
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'paypal']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

// Virtual for order tracking
orderSchema.virtual('trackingInfo').get(function() {
  const statusMap = {
    pending: 'Order received',
    processing: 'Order is being processed',
    shipped: 'Order has been shipped',
    delivered: 'Order has been delivered',
    cancelled: 'Order was cancelled'
  };
  
  return {
    currentStatus: statusMap[this.status],
    orderDate: this.createdAt,
    lastUpdate: this.updatedAt
  };
});

// Method to calculate order total
orderSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Populate items with product details when querying
orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'items.product',
    select: 'name imageUrl'
  }).populate({
    path: 'user',
    select: 'name email'
  });
  
  next();
});

module.exports = mongoose.model('Order', orderSchema);
