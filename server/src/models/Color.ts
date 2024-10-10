import mongoose, { Schema, Document } from 'mongoose';

interface IColor extends Document {
  name: string;
  refColor: string;
  stock_color: string;
}

const ColorSchema: Schema = new Schema({
  name: { type: String, required: true },                   // Color name (e.g., Red)
  refColor: { type: String, required: true },                // Color code (e.g., #FF0000)
  qte: { type: String, required: true },   
  fetchedAt: { type: Date, default: Date.now },   
            // Date of record fetch
});

export const Color = mongoose.model<IColor>('Color', ColorSchema);
