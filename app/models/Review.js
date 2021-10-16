import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    stars: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Review', ReviewSchema);
