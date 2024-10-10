import { Request, Response } from 'express';
import { Size } from '../models/Size';

// Create a new size
export const createSize = async (req: Request, res: Response) => {
  try {
    const size = new Size(req.body);
    const savedSize = await size.save();
    res.status(201).json(savedSize);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get all sizes
export const getAllSizes = async (_req: Request, res: Response) => {
  try {
    const sizes = await Size.find();
    res.json(sizes);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
