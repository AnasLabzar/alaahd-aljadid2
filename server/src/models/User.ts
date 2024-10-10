import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'moderator', 'customer', 'supplier'], 
    default: 'customer'  // Default role is customer
  },
  score: { type: String }

});

export const User = mongoose.model<IUser>('User', UserSchema);
