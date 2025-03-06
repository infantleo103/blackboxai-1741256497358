const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: ['t-shirts', 'hoodies', 'jackets', 'pants', 'accessories'],
    lowercase: true
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  isCustomizable: {
    type: Boolean,
    default: false
  },
  customizationOptions: {
    colors: [{
      type: String,
      trim: true
    }],
    sizes: [{
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    }],
    printLocations: [{
      type: String,
      enum: ['front', 'back', 'left-sleeve', 'right-sleeve']
    }]
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

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isCustomizable: 1 });

module.exports = mongoose.model('Product', productSchema);
