import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Grid,
    Typography,
    Button,
    Stack,
    Box,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
} from '@mui/material';
import Image from "next/image";
import StatusBadge from '../Badge/BadgeStatus';
import { EditOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import StatusChip, { StatusType } from '../Badge/BadgeStatus';

interface InvoiceTemplateProps {
    invoiceId: string;
}

interface Column {
    id: 'id' | 'product' | 'qte' | 'colors' | 'amount';
    label: string;
    minWidth: number;
}

interface InvoiceData {
    invoiceRef: string;
    orderId: string[];
    customerId: string;
    productId: string[];
}

interface OrderData {
    total: string;
    discount: string;
    ordred: string;
    dueDate: string;
    quantity: number;
    status: string;
}

interface CustomerData {
    username: string;
    phone: string;
    fetchedAt: string;
}

interface ProductData {
    title: string;
    colorsId: string;
}

interface ColorData {
    name: string;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoiceId }) => {
    const columns: Column[] = [
        { id: 'id', label: 'ID', minWidth: 8 },
        { id: 'product', label: 'Product', minWidth: 30 },
        { id: 'qte', label: 'Qte', minWidth: 10 },
        { id: 'colors', label: 'Colors', minWidth: 10 },
        { id: 'amount', label: 'Amount', minWidth: 10 },
    ];

    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [orderData, setOrderData] = useState<OrderData[]>([]);
    const [customerData, setCustomerData] = useState<CustomerData | null>(null);
    const [productData, setProductData] = useState<ProductData[]>([]);
    const [colorsData, setColorsData] = useState<ColorData[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [printSize, setPrintSize] = useState("A4");

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                const responseInvoice = await axios.get<InvoiceData>(`https://backendalaahd.onrender.com/api/invoices/${invoiceId}`);
                const invoiceData = responseInvoice.data;

                const orderResponses = await Promise.all(
                    invoiceData.orderId.map(orderId => axios.get<OrderData>(`https://backendalaahd.onrender.com/api/orders/${orderId}`))
                );
                const orderData = orderResponses.map(response => response.data);

                const customerResponse = await axios.get<CustomerData>(`https://backendalaahd.onrender.com/api/users/${invoiceData.customerId}`);
                const customerData = customerResponse.data;

                const productResponses = await Promise.all(
                    invoiceData.productId.map(productId => axios.get<ProductData>(`https://backendalaahd.onrender.com/api/products/${productId}`))
                );
                const productData = productResponses.map(response => response.data);

                const colorResponses = await Promise.all(
                    productData.map(product => axios.get<ColorData>(`https://backendalaahd.onrender.com/api/colors/${product.colorsId}`))
                );
                const colorsData = colorResponses.map(response => response.data);

                const totalAmounts = orderData.map(order => parseFloat(order.total));
                const subtotal = totalAmounts.reduce((acc, curr) => acc + curr, 0);

                const firstOrderDiscount = orderData.length > 0 ? parseFloat(orderData[0].discount) : 0;

                setInvoiceData(invoiceData);
                setOrderData(orderData);
                setCustomerData(customerData);
                setProductData(productData);
                setColorsData(colorsData);
                setSubtotal(subtotal);
                setDiscount(firstOrderDiscount);

            } catch (error) {
                console.error('Error fetching invoice data:', error);
            }
        };

        fetchInvoiceData();
    }, [invoiceId]);

    const grandTotal = subtotal - (subtotal * (discount / 100));

    if (!invoiceData || !orderData || !customerData || !productData || !colorsData) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const handlePrint = () => {
        window.print();
    };

    const togglePrintSize = () => {
        setPrintSize((prevSize) => (prevSize === "A4" ? "A5" : "A4"));
    };

    const isStatusType = (status: string): status is StatusType => {
        return ['paid', 'pending', 'cancelled', 'credit', 'retour', 'default'].includes(status);
    };

    const statusInvoice = isStatusType(orderData[0].status) ? orderData[0].status : 'default';

    return (
        <Grid container>
            {/* Skip this section in print */}
            <Grid item xs={12} className="print-hidden">
                <Box className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg rounded-lg p-6">
                    <Grid container xs={12}>
                        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Stack style={{ flexDirection: 'row-reverse' }}>
                                <Button className="dark:text-white">
                                    <EditOutlined style={{ fontSize: '17px' }} />
                                </Button>
                                <Button className="dark:text-white">
                                    <DownloadOutlined style={{ fontSize: '17px' }} />
                                </Button>
                                <Button className="dark:text-white" onClick={handlePrint}>
                                    <PrinterOutlined style={{ fontSize: '17px' }} />
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>

            {/* Rest of the Invoice Content */}
            <Grid container alignItems="center" justifyContent="space-between" mt={2}>
                <Grid item xs={6} style={{ display: 'flex' }}>
                    <Image
                        width={86}
                        height={86}
                        src={"/images/logo/logo-horizontal.png"}
                        alt="Logo"
                        priority
                        className="dark:hidden"
                    />
                    <Image
                        width={86}
                        height={86}
                        src={"/images/logo/logo-horizontal-light.png"}
                        alt="Logo"
                        priority
                        className="hidden dark:block"
                    />
                </Grid>
                <Grid item xs={6} style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                    <Stack style={{ flexDirection: 'row', gap: '6px' }}>
                        <Typography className="text-gray-700 dark:text-gray-500" gutterBottom>
                            Date
                        </Typography>
                        <Typography className="text-gray-700 dark:text-gray-600" variant="body1" gutterBottom>
                            {formatDate(orderData[0].ordred)}
                        </Typography>
                    </Stack>
                    <Stack style={{ flexDirection: 'row', gap: '6px' }}>
                        <Typography className="text-gray-700 dark:text-gray-500" gutterBottom>
                            Due Date
                        </Typography>
                        <Typography className="font-bold text-gray-700 dark:text-gray-600" variant="body1" gutterBottom>
                            {formatDate(orderData[0].dueDate)}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Table>
                <TableBody>
                    <Grid container xs={12}>
                        <Grid item xs={6} md={12}>
                            <TableRow style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '10px' }}>
                                <Typography className="text-gray-700 dark:text-gray-500" style={{ padding: '8px 0px', fontSize: '12px' }}>
                                    #{invoiceData.invoiceRef}
                                </Typography>
                                <StatusChip status={statusInvoice} />
                            </TableRow>
                        </Grid>
                    </Grid>
                </TableBody>
            </Table>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                </Grid>
                <Grid item xs={6} style={{ paddingLeft: '1em' }}>
                    <Typography className="text-gray-700 dark:text-gray-500" style={{ fontSize: '15px', margin: '0', fontWeight: '700', opacity: '.7', display: 'flex', justifyContent: 'end' }} gutterBottom>
                        Customer info
                    </Typography>
                    <Typography className="text-gray-700 dark:text-gray-600" style={{ fontSize: '13px', margin: '0', fontWeight: '500', opacity: '.7', display: 'flex', justifyContent: 'end', marginTop: '8px' }} variant="body1" gutterBottom>
                        {customerData.username}
                    </Typography>
                </Grid>
            </Grid>

            {/* Table of Products */}
            <TableContainer style={{ overflowX: 'auto', marginTop: '1em', marginBottom: '2em' }}>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align="left"
                                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productData.map((product, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ borderRight: `1px solid rgba(224, 224, 224, 1);` }}>{index + 1}</TableCell>
                                <TableCell style={{ borderRight: `1px solid rgba(224, 224, 224, 1);` }}>{product.title}</TableCell>
                                <TableCell style={{ borderRight: `1px solid rgba(224, 224, 224, 1);` }}>{orderData[index]?.quantity || '-'}</TableCell>
                                <TableCell style={{ borderRight: `1px solid rgba(224, 224, 224, 1);` }}>{colorsData[index]?.name || '-'}</TableCell>
                                <TableCell style={{ borderRight: `1px solid rgba(224, 224, 224, 1);` }}>{orderData[index]?.total || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Invoice Totals */}
            <Grid item mt={3} xs={12}>
                <Stack>
                    <Grid container xs={12}>
                        <Typography variant="body1" className="text-gray-700 dark:text-gray-500" gutterBottom>
                            Sub Total:
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {subtotal.toFixed(2)}
                        </Typography>
                    </Grid>
                    <Grid container xs={12}>
                        <Typography variant="body1" className="text-gray-700 dark:text-gray-500" gutterBottom>
                            Discount:
                        </Typography>
                        <Typography variant="body1" style={{ color: 'green' }} gutterBottom>
                            {(subtotal * (discount / 100)).toFixed(2)}
                        </Typography>
                    </Grid>
                    <Grid container xs={12}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }} className="text-gray-700 dark:text-gray-500" gutterBottom>
                            Grand Total:
                        </Typography>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }} gutterBottom>
                            {grandTotal.toFixed(2)}
                        </Typography>
                    </Grid>
                </Stack>
            </Grid>
        </Grid>
    );

};

export default InvoiceTemplate;