import express from 'express';
import { createInvoice, getAllInvoices, getFilteredInvoices } from '../controllers/invoiceController';

const router = express.Router();

// Create an invoice
router.post('/invoices', createInvoice);

// Get all invoices
router.get('/invoices', getAllInvoices);

// Get filtered invoices (week, month, year)
router.get('/invoices/count', getFilteredInvoices);

export default router;
