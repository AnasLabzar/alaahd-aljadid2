import { Request, Response } from 'express';
import { Color } from '../models/Color';

// Create a new color
export const createColor = async (req: Request, res: Response) => {
  try {
    const color = new Color(req.body);
    const savedColor = await color.save();
    res.status(201).json(savedColor);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get all colors
export const getColors = async (_req: Request, res: Response) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get a Colors by ID
export const getColorsById = async (req: Request, res: Response) => {
  try {
    const Colors = await Color.findById(req.params.id);
    if (!Colors) {
      return res.status(404).json({ message: 'Colors not found' });
    }
    res.json(Colors);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

