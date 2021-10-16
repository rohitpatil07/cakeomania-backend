import mongoose from 'mongoose';

const _cakeSchema = new mongoose.Schema({
  cake: { type: mongoose.Schema.Types.ObjectId, ref: 'Cake' },
  quantity: { type: Number, required: false, default: 1 },
  message: { type: String },
});

const CartSchema = new mongoose.Schema(
  {
    items: [_cakeSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    total_price: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Cart', CartSchema);
