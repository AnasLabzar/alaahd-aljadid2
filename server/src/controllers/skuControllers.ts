import { Request, Response } from 'express';
import { SKU } from '../models/Sku';

// Create a new SKU
export const createSKU = async (req: Request, res: Response) => {
  try {
    const sku = new SKU(req.body);
    const savedSKU = await sku.save();
    res.status(201).json(savedSKU);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get all SKUs
export const getAllSKUs = async (_req: Request, res: Response) => {
  try {
    const skus = await SKU.find();
    res.json(skus);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
