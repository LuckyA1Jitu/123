import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: String,
    required: true,
    enum: ['In Stock', 'Coming Soon', 'Out of Stock'],
    default: 'In Stock'
  },
  quantity: {
    type: Number,
    min: 0,
    default: 0
  },
  contactNumber: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  isNewProduct: {
    type: Boolean,
    default: true
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

// Automatically set isNewProduct to false after 7 days
productSchema.pre('save', function(next) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  if (this.createdAt < sevenDaysAgo) {
    this.isNewProduct = false;
  }
  
  next();
});

export default mongoose.model('Product', productSchema); 