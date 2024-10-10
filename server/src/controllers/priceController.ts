import { Request, Response } from 'express';
import { Price } from '../models/Price';

// Create a new price
export const createPrice = async (req: Request, res: Response) => {
  try {
    const price = new Price(req.body);
    const savedPrice = await price.save();
    res.status(201).json(savedPrice);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get a price by ID
export const getPriceById = async (req: Request, res: Response) => {
  try {
    const price = await Price.findById(req.params.id);
    if (!price) {
      return res.status(404).json({ message: 'Price not found' });
    }
    res.json(price);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get all prices
export const getAllPrices = async (_req: Request, res: Response) => {
  try {
    const prices = await Price.find();
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
