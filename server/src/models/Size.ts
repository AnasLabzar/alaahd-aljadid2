import mongoose, { Schema, Document } from 'mongoose';

interface ISize extends Document {
  size: string;
}

const SizeSchema: Schema = new Schema({
  size: { type: String, required: true },                  // Size name (e.g., S, M, L, XL)
  fetchedAt: { type: Date, default: Date.now },            // Record fetch date
});

export const Size = mongoose.model<ISize>('Size', SizeSchema);
