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
import { exit } from 'process';
import { log } from 'console';

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
    adminId: string;
    productId: string[];
    fetchedAt: string;
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

interface AdminData {
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

function ccyFormat(num: number) {
    return `${num.toFixed(2)}`;
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
    const [adminData, setAdminData] = useState<Partial<AdminData> | null>(null);
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

                if (invoiceData.adminId === 'adminId_here') {
                    setAdminData({
                        username: 'Not Available',
                    });
                    console.log('Admin ID matches, skipping admin data fetch.');
                } else {
                    try {
                        const adminResponse = await axios.get<AdminData>(
                            `https://backendalaahd.onrender.com/api/users/${invoiceData.adminId}`
                        );
                        const adminData = adminResponse.data;
                        setAdminData(adminData);
                    } catch (error) {
                        console.log('Error fetching admin data:', error);
                    }
                }

                const productResponses = await Promise.all(
                    invoiceData.productId.map(productId => axios.get<ProductData>(`https://backendalaahd.onrender.com/api/products/${productId}`))
                );
                const productData = productResponses.map(response => response.data);

                const colorResponses = await Promise.all(
                    productData.map(product =>
                        axios
                            .get<ColorData>(`https://backendalaahd.onrender.com/api/colors/${product.colorsId}`)
                            .then(response => response.data)
                            .catch(error => {
                                console.error(`Failed to fetch color for ID ${product.colorsId}:`, error);
                                return null; // Return null for failed requests
                            })
                    )
                );

                // Filter null values with type assertion
                const colorsData = colorResponses.filter((color): color is ColorData => color !== null);

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
                    />
                </Grid>
                <Grid item xs={6} style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                    <Stack style={{ flexDirection: 'row', gap: '6px' }}>
                        <Typography className="text-gray-700 text-[12px] font-bold dark:text-gray-500" gutterBottom>
                            Imprimé Le
                        </Typography>
                        <Typography className="text-gray-700 text-[12px] dark:text-gray-600" variant="body1" gutterBottom>
                            {formatDate(orderData[0].ordred)}
                        </Typography>
                    </Stack>
                    <Stack style={{ flexDirection: 'row', gap: '6px' }}>
                        <Typography className="text-gray-700 dark:text-gray-500" gutterBottom>
                            Date d'échéance:
                        </Typography>
                        <Typography className="font-bold text-gray-700 dark:text-gray-600" variant="body1" gutterBottom>
                            {formatDate(orderData[0].dueDate)}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Table>
                <TableBody>
                    <Grid container xs={12} spacing={2} style={{ marginTop: '10px' }}>
                        <Grid item xs={6}>
                            <TableRow style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '10px' }}>
                                <Typography className="text-gray-700 dark:text-gray-500" style={{ fontSize: '12px' }}>
                                    El Gouassem, Route d'ourika
                                </Typography>
                            </TableRow>
                            <TableRow style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '10px' }}>
                                <Typography className="text-gray-700 dark:text-gray-500" style={{ fontSize: '12px' }}>
                                    Marrakech, 40160
                                </Typography>
                            </TableRow>
                            <TableRow style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '10px' }}>
                                <Typography className="text-gray-700 dark:text-gray-500" style={{ fontSize: '12px' }}>
                                    +212 689-063963
                                </Typography>
                            </TableRow>
                            <TableRow style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '10px', margin: '1em 0' }}>
                                <Typography className="text-gray-700 dark:text-gray-500" style={{ padding: '8px 0px', fontSize: '12px' }}>
                                    #{invoiceData.invoiceRef}
                                </Typography>
                                <StatusChip status={statusInvoice} />
                            </TableRow>
                        </Grid>
                        <Grid item xs={6} style={{ paddingLeft: '1em' }}>
                            <Typography className="text-gray-900 dark:text-gray-700" style={{ fontSize: '15px', margin: '0', fontWeight: '700', opacity: '.7', display: 'flex', justifyContent: 'end' }} gutterBottom>
                                Client info
                            </Typography>
                            <Typography className="text-gray-700 dark:text-gray-600" style={{ fontSize: '13px', margin: '0', fontWeight: '500', opacity: '.7', display: 'flex', justifyContent: 'end', marginTop: '2px' }} variant="body1" gutterBottom>
                                {customerData.username}
                            </Typography>
                            <Typography className="text-gray-700 dark:text-gray-600" style={{ fontSize: '13px', margin: '0', fontWeight: '500', opacity: '.7', display: 'flex', justifyContent: 'end' }} variant="body1" gutterBottom>
                                {customerData.phone}
                            </Typography>
                        </Grid>
                    </Grid>
                </TableBody>
            </Table>

            <Grid container spacing={2}>
                <Grid item xs={6} style={{ paddingLeft: '1em' }}>
                    <Typography className="text-gray-900 dark:text-gray-700" style={{ fontSize: '15px', margin: '0', fontWeight: '700', opacity: '.7', display: 'flex', justifyContent: 'start' }} gutterBottom>
                        Crée par monsieur:
                    </Typography>
                    <Typography
                        className="text-gray-700 dark:text-gray-600"
                        style={{
                            fontSize: '13px',
                            margin: '0',
                            fontWeight: '500',
                            opacity: '.7',
                            display: 'flex',
                            justifyContent: 'start',
                            marginTop: '2px'
                        }}
                        variant="body1"
                        gutterBottom
                    >
                        {adminData?.username || ''}  {/* ✅ Will render username if exists, otherwise empty string */}
                    </Typography>

                    <Typography
                        className="text-gray-700 dark:text-gray-600"
                        style={{ fontSize: '13px', margin: '0', fontWeight: '500', opacity: '.7', display: 'flex', justifyContent: 'start', marginTop: '2px' }}
                        variant="body1"
                        gutterBottom
                    >
                        a {new Date(invoiceData.fetchedAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })} le {new Date(invoiceData.fetchedAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                        })}
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
                    <TableRow>
                        <TableCell colSpan={2}>Subtotal</TableCell>
                        <TableCell align="right">{ccyFormat(subtotal)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Discount</TableCell>
                        <TableCell align="right">{ccyFormat(subtotal * (discount / 100))}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{ fontWeight: `bold` }} colSpan={2}>Total</TableCell>
                        <TableCell style={{ fontWeight: `bold` }} align="right">{ccyFormat(grandTotal)} DH</TableCell>
                    </TableRow>
                </Stack>
            </Grid>
        </Grid >
    );

};

export default InvoiceTemplate;
