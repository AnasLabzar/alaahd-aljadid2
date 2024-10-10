import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  title: string;
  description?: string;
  priceId: string;
  categoryId: string[];
  colorsId: string[];
  sizeId: string[];
  skuId: string[];
  qteStock: string[];
  images: string[];
  active: boolean;
}

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true },                  // Product title
  description: { type: String },                             // Optional description
  priceId: { type: String, required: true },                 // Reference to Price model
  categoryId: [{ type: String, required: true }],            // Reference to Categories
  colorsId: [{ type: String, required: true }],              // Reference to Colors
  sizeId: [{ type: String, required: true }],                // Reference to Sizes
  skuId: [{ type: String, required: true }],   
  qteStock: [{ type: String, required: true }],   
  images: [{ type: String }],                                // Array of image URLs
  active: { type: Boolean, default: false },                 // Active/inactive status
  fetchedAt: { type: Date, default: Date.now },              // Date of record fetch
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
