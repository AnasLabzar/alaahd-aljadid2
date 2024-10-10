import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  title: string;
  description: string;
}

const CategorySchema: Schema = new Schema({
  title: { type: String, required: true },      // Category name
  description: { type: String },      // Category name
  fetchedAt: { type: Date, default: Date.now },              // Date of record fetch
});

export const Category = mongoose.model<ICategory>('product_categories', CategorySchema);
