import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@mui/material';

interface ColorType {
    _id: string;
    refColor: string; // The hex code for color
    colorName: string;
}

interface ProductType {
    _id: string;
    title: string;
    colorsId: string[];
    priceId: string; // Single price ID
}

interface InvoiceItem {
    _id: number; // Invoice item ID
    total: number; // Total for the invoice item
    type: string; // Product type
    invoiceRef: string; // Reference for the invoice
}

interface Invoice {
    _id: string;
    orders: InvoiceItem[]; // Array of invoice items
}

interface InvoiceDetailModalProps {
    open: boolean;
    handleClose: () => void;
    invoiceId: string;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
    open,
    handleClose,
    invoiceId,
}) => {
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            const fetchInvoiceDetails = async () => {
                try {
                    setLoading(true);

                    // Fetch invoice details by invoiceId
                    const response = await fetch(`https://backendalaahd.onrender.com/api/invoices/${invoiceId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch invoice details');
                    }

                    const invoiceData: Invoice = await response.json(); // Parse the JSON response
                    
                    // Log the entire response for debugging
                    console.log('Fetched Invoice Data:', invoiceData);

                    // Check if orders exist and is an array before setting state
                    if (Array.isArray(invoiceData.orders)) {
                        setInvoiceItems(invoiceData.orders); // Set the invoice items correctly
                    } else {
                        throw new Error('Invoice does not contain valid orders');
                    }
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchInvoiceDetails();
        }
    }, [open, invoiceId]);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    width: 600,
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: '8px',
                    boxShadow: 24,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    Invoice Detail - {invoiceId}
                </Typography>

                <img src="/path/to/logo.png" alt="Logo" style={{ width: '100%', maxWidth: '150px', marginBottom: '16px' }} />

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoiceItems.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>{item.total}</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button variant="contained" color="primary" onClick={handleClose} sx={{ marginTop: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default InvoiceDetailModal;
