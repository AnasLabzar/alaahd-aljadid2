import { Request, Response } from 'express';
import { Invoice } from '../models/Invoice';

// Create an Invoice
export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = new Invoice(req.body);
    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get all Invoices
export const getAllInvoices = async (_req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get filtered and counted invoices (week/month/year)
export const getFilteredInvoices = async (req: Request, res: Response) => {
  const { filter } = req.query;

  const currentDate = new Date();
  let startDate: Date | undefined;

  // Determine start date based on filter type
  if (filter === 'weekly') {
    startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the week (Sunday)
    startDate.setHours(0, 0, 0, 0); // Set to the start of the day
  } else if (filter === 'monthly') {
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of the month
  } else if (filter === 'yearly') {
    startDate = new Date(currentDate.getFullYear(), 0, 1); // Start of the year
  } else {
    return res.status(400).json({ error: 'Invalid filter type' });
  }

  try {
    // Fetch the count of invoices after the startDate
    const invoiceCount = await Invoice.countDocuments({
      fetchedAt: { $gte: startDate }
    });

    res.json({ count: invoiceCount });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

