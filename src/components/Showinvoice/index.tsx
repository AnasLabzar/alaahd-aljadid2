"use client"; // Ensure this file is client-side

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Invoice {
    // Define your Invoice interface properties here
    invoiceNumber: string;
    createdAt: string;
    orderId: string;
    shipmentId: string;
    bankName: string;
    accountNumber: string;
    swiftCode: string;
    iban: string;
    country: string;
    customerId: string;
    orderIds: string[];
}

interface User {
    role: string;
    username: string;
    address?: string;
    email?: string;
    phone?: string;
}

interface Item {
    id: string;
    title: string;
    quantity: number;
    price: number;
}

// Add id prop to the component
const DetailInvoice: React.FC<{ id: string }> = ({ id }) => {
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [user, setUser] = useState<User>({ role: '', username: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchInvoiceData = async () => {
        if (!id) return; // Don't fetch if id is not set

        try {
            setLoading(true);
            const invoiceResponse = await axios.get(`https://backendalaahd.onrender.com/api/invoices/${id}`);
            setInvoice(invoiceResponse.data);

            const orderPromises = invoiceResponse.data.orderIds.map((orderId: string) =>
                axios.get(`https://backendalaahd.onrender.com/api/orders/${orderId}`)
            );
            const orderResponses = await Promise.all(orderPromises);
            const orderItems = orderResponses.map(res => res.data.products).flat();

            setItems(orderItems);

            const userResponse = await axios.get(`https://backendalaahd.onrender.com/api/users/${invoiceResponse.data.customerId}`);
            const userData = userResponse.data;

            // If adminId is not available, set it to 'N/A'
            if (!userData.adminId) {
                userData.adminId = 'N/A';
            }

            setUser(userData);
        } catch (error) {
            console.error("Error fetching invoice data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchInvoiceData();
}, [id]);

    if (loading) {
        return <div>Loading...</div>; // Add a loading indicator
    }

    if (!invoice) {
        return <div>No invoice data available. Please check the invoice ID.</div>; // Fallback if invoice data is not fetched
    }

    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.21; // Assuming a 21% tax rate, adjust as needed
    const discount = 10; // Example discount, replace with your logic
    const grandTotal = subtotal + tax - discount;

    return (
        <div>
            <div className="flex items-center lg:justify-end justify-center flex-wrap gap-4 mb-6">
                <button type="button" className="btn btn-info gap-2">
                    Send Invoice
                </button>
                <button type="button" className="btn btn-primary gap-2">
                    Print
                </button>
                <button type="button" className="btn btn-success gap-2">
                    Download
                </button>
                <Link href="/apps/invoice/add" className="btn btn-secondary gap-2">
                    Create
                </Link>
                <Link href="/apps/invoice/edit" className="btn btn-warning gap-2">
                    Edit
                </Link>
            </div>
            <div className="panel">
                <div className="flex justify-between flex-wrap gap-4 px-4">
                    <div className="text-2xl font-semibold uppercase">Invoice</div>
                    <div className="shrink-0">
                        <img src="/assets/images/logo.svg" alt="img" className="w-14 ltr:ml-auto rtl:mr-auto" />
                    </div>
                </div>
                <div className="ltr:text-right rtl:text-left px-4">
                    <div className="space-y-1 mt-6 text-white-dark">
                        <div>13 Tetrick Road, Cypress Gardens, Florida, 33884, US</div>
                        <div>vristo@gmail.com</div>
                        <div>+1 (070) 123-4567</div>
                    </div>
                </div>

                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                <div className="flex justify-between lg:flex-row flex-col gap-6 flex-wrap">
                    <div className="flex-1">
                        <div className="space-y-1 text-white-dark">
                            <div>Issue For:</div>
                            <div className="text-black dark:text-white font-semibold">
                                {user.role === 'custom' ? `Client: ${user.username}` : `Fournisseur: ${user.username}`}
                            </div>
                            <div>{user.address}</div>
                            <div>{user.email}</div>
                            <div>{user.phone}</div>
                        </div>
                    </div>
                    <div className="flex justify-between sm:flex-row flex-col gap-6 lg:w-2/3">
                        <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Invoice :</div>
                                <div>#{invoice.invoiceNumber}</div>
                            </div>
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Issue Date :</div>
                                <div>{new Date(invoice.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Order ID :</div>
                                <div>#{invoice.orderId}</div>
                            </div>
                            <div className="flex items-center w-full justify-between">
                                <div className="text-white-dark">Shipment ID :</div>
                                <div>#{invoice.shipmentId}</div>
                            </div>
                        </div>
                        <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Bank Name:</div>
                                <div className="whitespace-nowrap">{invoice.bankName}</div>
                            </div>
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Account Number:</div>
                                <div>{invoice.accountNumber}</div>
                            </div>
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">SWIFT Code:</div>
                                <div>{invoice.swiftCode}</div>
                            </div>
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">IBAN:</div>
                                <div>{invoice.iban}</div>
                            </div>
                            <div className="flex items-center w-full justify-between">
                                <div className="text-white-dark">Country:</div>
                                <div>{invoice.country}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <table className="w-full mt-6">
                    <thead>
                        {/* <tr>
                            {columns.map((column) => (
                                <th key={column.key} className={column.class || ''}>{column.label}</th>
                            ))}
                        </tr> */}
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.title}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price.toFixed(2)}</td>
                                <td>{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between mt-4">
                    <div className="font-semibold">Subtotal:</div>
                    <div>{subtotal.toFixed(2)}</div>
                </div>
                <div className="flex justify-between mt-2">
                    <div className="font-semibold">Tax (21%):</div>
                    <div>{tax.toFixed(2)}</div>
                </div>
                <div className="flex justify-between mt-2">
                    <div className="font-semibold">Discount:</div>
                    <div>{discount.toFixed(2)}</div>
                </div>
                <div className="flex justify-between mt-2">
                    <div className="font-semibold">Total:</div>
                    <div>{grandTotal.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
};

export default DetailInvoice;
