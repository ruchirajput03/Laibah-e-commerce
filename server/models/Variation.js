import mongoose from 'mongoose';

const variationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['size', 'color', 'material']
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Variation', variationSchema);