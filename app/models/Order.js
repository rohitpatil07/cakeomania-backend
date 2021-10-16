import mongoose from 'mongoose';

const _cakeSchema = new mongoose.Schema({
  cake: { type: mongoose.Schema.Types.ObjectId, ref: 'Cake' },
  quantity: { type: Number, required: true },
  message: { type: String },
});

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    address: { type: String, required: true },
    cart: { type: mongoose.Types.ObjectId, ref: 'Cart' },
    delivery_date: { type: Date, required: true },
    items: [_cakeSchema],
    total_price: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Order', OrderSchema);
