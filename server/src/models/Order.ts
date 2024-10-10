import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
  refOrder: string;
  totalProfit: number;
  status: string;
  quantity: string;
  total: string;
  ordred: Date;
  dueDate?: Date;
  discount?: number;
  note?: string;
}

const OrderSchema: Schema = new Schema({
  refOrder: { type: String, required: true, unique: true },
  total: { type: Number, required: true },
  totalProfit: { type: Number, required: true },
  status: { type: String, required: true },
  quantity: { type: String, required: true },
  ordred: { type: Date, default: Date.now },
  dueDate: { type: Date },
  discount: { type: Number },
  note: { type: String },
  fetchedAt: { type: Date, default: Date.now, required: true } // Add a 'fetchedAt' field of type Date
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
