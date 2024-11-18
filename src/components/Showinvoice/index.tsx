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
@@ -39,7 +38,7 @@ interface Item {
const DetailInvoice: React.FC<{ id: string }> = ({ id }) => {
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [user, setUser] = useState<User>({ role: '', username: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
@@ -55,7 +54,7 @@ const DetailInvoice: React.FC<{ id: string }> = ({ id }) => {
                    axios.get(`https://backendalaahd.onrender.com/api/orders/${orderId}`)
                );
                const orderResponses = await Promise.all(orderPromises);
                const orderItems = orderResponses.map(res => res.data.products).flat();

                setItems(orderItems);

@@ -79,11 +78,26 @@ const DetailInvoice: React.FC<{ id: string }> = ({ id }) => {
        return <div>No invoice data available. Please check the invoice ID.</div>; // Fallback if invoice data is not fetched
    }

    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.21; // Assuming a 21% tax rate, adjust as needed
    const discount = 10; // Example discount, replace with your logic
    const grandTotal = subtotal + tax - discount;

    return (
        <div>
            <div className="flex items-center lg:justify-end justify-center flex-wrap gap-4 mb-6">
@@ -124,14 +138,15 @@ const DetailInvoice: React.FC<{ id: string }> = ({ id }) => {
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
@@ -150,6 +165,7 @@ const DetailInvoice: React.FC<{ id: string }> = ({ id }) => {
                                <div>#{invoice.shipmentId}</div>
                            </div>
                        </div>
                        <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Bank Name:</div>
@@ -175,47 +191,47 @@ const DetailInvoice: React.FC<{ id: string }> = ({ id }) => {
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
