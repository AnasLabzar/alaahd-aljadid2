import mongoose, { Schema, Document } from 'mongoose';

// Define the Invoice interface with orderId and productId as arrays of strings
interface IInvoice extends Document {
  invoiceRef: string;
  orderId: string[];   // Array of order IDs
  customerId: string;
  total: number;
  productId: string[];  // Array of product IDs
  adminId: string;      // ID of the admin who handles this invoice
  fetchedAt: Date;
}

// Define the schema
const InvoiceSchema: Schema = new Schema({
  invoiceRef: { type: String, required: true },   // Unique reference for the invoice
  orderId: { type: [String], required: true },    // Array to handle multiple orders
  total: { type: Number, required: true },        // Total amount
  customerId: { type: String, required: true },   // ID of the customer
  productId: { type: [String], required: true },  // Array to handle multiple products
  adminId: { type: String, required: true },      // Admin responsible for the invoice
  fetchedAt: { type: Date, default: Date.now }    // Date when the invoice was created or fetched
});

// Create and export the Invoice model
export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
