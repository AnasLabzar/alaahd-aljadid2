import mongoose, { Schema, Document } from 'mongoose';

interface ISKU extends Document {
  skuCode: string;
  productId: string;
}

const SKUSchema: Schema = new Schema({
  skuCode: { type: String, required: true },               // SKU code for product
  productId: { type: String, required: true },             // Reference to product ID
  fetchedAt: { type: Date, default: Date.now },            // Record fetch date
});

export const SKU = mongoose.model<ISKU>('SKU', SKUSchema);
