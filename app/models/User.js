import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile_no: { type: String },
    provider: { type: String, enum: ['GOOGLE', 'EMAIL'], default: 'EMAIL' },
    encrypted_password: String,
    avatar_url: String,
    recovery_sent_at: Date,
    recovery_token: String,
    last_sign_in_at: Date,
    confirmation_sent_at: Date,
    confirmation_token: String,
    confirmed_at: String,
    refresh_token: String,
  },
  { timestamps: true },
);

export default mongoose.model('User', UserSchema);
