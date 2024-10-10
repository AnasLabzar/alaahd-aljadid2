import mongoose, { Schema, Document } from 'mongoose';

interface IPrice extends Document {
  currency: string;
  price: number;
  cost_per_item: string;
  tax?: number;
  profit: number;
  margin: number;
}

const PriceSchema: Schema = new Schema({
  currency: { type: String, required: true },                // Currency (e.g., USD)
  price: { type: Number, required: true },                // Cost per item
  costPerItem: { type: Number, required: true },             // Cost per item
  tax: { type: Number },                                     // Tax (optional)
  profit: { type: Number, required: true },                  // Profit (calculated)
  margin: { type: Number, required: true },                  // Profit margin (calculated)
  fetchedAt: { type: Date, default: Date.now },              // Date of record fetch
});

export const Price = mongoose.model<IPrice>('Price', PriceSchema);
