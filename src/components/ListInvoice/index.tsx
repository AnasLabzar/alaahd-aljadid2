"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DetailInvoice from "../Showinvoice";
import Link from "next/link";


type Invoice = {
    _id: string;
    invoiceRef: string;
    orderId: string[];
    customerId: string;
    total: string;
    type: string;
    fetchedAt: string;
};

type Order = {
    _id: string;
    status: string;
};

type User = {
    _id: string;
    username: string;
    role: string; // Add role to User type
};

const ListInvoice = () => {
    const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
    const [orders, setOrders] = useState<{ [key: string]: Order }>({});
    const [users, setUsers] = useState<{ [key: string]: User }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true); // Start loading
            try {
                const invoiceResponse = await axios.get("https://backendalaahd.onrender.com/api/invoices");
                const invoicesData = invoiceResponse.data;

                if (!Array.isArray(invoicesData) || invoicesData.length === 0) {
                    console.warn("No invoices found.");
                    setAllInvoices([]);
                    return;
                }

                setAllInvoices(invoicesData);

                // Fetch orders for the first orderId in each invoice
                const orderPromises = invoicesData.flatMap((invoice: Invoice) =>
                    invoice.orderId.length > 0 ? axios.get(`https://backendalaahd.onrender.com/api/orders/${invoice.orderId[0]}`) : []
                );

                // Fetch users with roles 'custom' or 'fourn'
                const userResponse = await axios.get("https://backendalaahd.onrender.com/api/users?role=custom,fourn");
                const usersData = userResponse.data;
                const userMap = usersData.reduce((acc: { [key: string]: User }, user: User) => {
                    acc[user._id] = user;
                    return acc;
                }, {});

                const orderResponses = await Promise.all(orderPromises);
                const orderData = orderResponses.reduce((acc: { [key: string]: Order }, res) => {
                    acc[res.data._id] = res.data;
                    return acc;
                }, {});

                setOrders(orderData);
                setUsers(userMap);
            } catch (error) {
                console.error("Error fetching invoices or users:", error);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchInvoices();
    }, []);

    // Sort invoices by fetchedAt date (descending)
    const sortedInvoices = [...allInvoices].sort((a, b) => new Date(b.fetchedAt).getTime() - new Date(a.fetchedAt).getTime());

    // Filter invoices based on search term (invoiceRef or customer username)
    const filteredInvoices = sortedInvoices.filter((invoice) => {
        const customerUsername = users[invoice.customerId]?.username?.toLowerCase() || '';
        const invoiceRef = invoice.invoiceRef.toLowerCase();
        return customerUsername.includes(searchTerm.toLowerCase()) || invoiceRef.includes(searchTerm.toLowerCase());
    });

    // Calculate pagination
    const totalRows = filteredInvoices.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const formatFetchedAtDate = (fetchedAt: string) => {
        const date = new Date(fetchedAt);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
        });
    };

    const formatFetchedAtTime = (fetchedAt: string) => {
        const date = new Date(fetchedAt);
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Status style function
    const getStatusStyles = (status: string) => {
        let backgroundColor = "bg-gray-200"; // default color
        let textColor = "text-gray-800";

        switch (status) {
            case "pending":
                backgroundColor = "bg-yellow-200";
                textColor = "text-yellow-800";
                break;
            case "paid":
                backgroundColor = "bg-green-200";
                textColor = "text-green-800";
                break;
            case "retour":
                backgroundColor = "bg-red-200";
                textColor = "text-red-800";
                break;
            case "credit":
                backgroundColor = "bg-orange-200";
                textColor = "text-orange-800";
                break;
            // Add more statuses as needed
            default:
                break;
        }

        return { backgroundColor, textColor };
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
            {/* Search Bar */}
            <div className="mb-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search by customer or invoice reference"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="px-4 py-2 border rounded w-2/5"
                />
            </div>

            {/* Loading Indicator */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span>Loading...</span> {/* Replace with a spinner if you have one */}
                </div>
            ) : (
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
                                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">Invoice Ref</th>
                                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">Customer</th>
                                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">Type</th>
                                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">Order Status</th>
                                <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Total</th>
                                <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Date</th>
                                <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Time</th>
                                <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="border-[#eee] px-4 py-4 dark:border-dark-3 text-center">
                                        No invoices available
                                    </td>
                                </tr>
                            ) : (
                                paginatedInvoices.map((invoice) => {
                                    const firstOrderId = invoice.orderId[0];
                                    const orderStatus = firstOrderId ? orders[firstOrderId]?.status || "N/A" : "N/A";
                                    const customerName = users[invoice.customerId]?.username || "N/A";
                                    const { backgroundColor, textColor } = getStatusStyles(orderStatus);

                                    return (
                                        <tr key={invoice._id}>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                                                {invoice.invoiceRef.replace('INV-', '')}
                                            </td>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">{customerName}</td>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                                                {users[invoice.customerId]?.role === 'custom'
                                                    ? `Client`
                                                    : `Fournisseur`}
                                            </td>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                                                <span className={`rounded-full text-[14px] px-5 py-2 capitalize ${backgroundColor} ${textColor}`}>
                                                    {orderStatus}
                                                </span>
                                            </td>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                                                <span className={invoice.type === "customer" ? "text-green-500" : "text-red-500"}>
                                                    {invoice.type === "customer" ? `+${invoice.total} dh` : `-${invoice.total} dh`}
                                                </span>
                                            </td>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                                                {formatFetchedAtDate(invoice.fetchedAt)}
                                            </td>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                                                {formatFetchedAtTime(invoice.fetchedAt)}
                                            </td>
                                            <td className="border-[#eee] flex gap-2 px-4 py-4 dark:border-dark-3">
                                                <Link href={`/invoice/detailinvoice/${invoice._id}`}>
                                                    <button className="group bg-blue-200 cursor-pointer hover:bg-blue-400 text-white w-8 h-8 flex items-center justify-center rounded-full">
                                                        <svg id="Layer_5" width="17" className="fill-blue-700 group-hover:fill-white" enable-background="new 0 0 31.7 19.3" viewBox="0 0 31.7 19.3" xmlns="http://www.w3.org/2000/svg"><path d="m15.9 19.3c6.5 0 12.6-3.5 15.9-9.2v-1c-5.1-8.8-16.3-11.8-25-6.7-2.9 1.7-5.2 4-6.8 6.8v1c3.3 5.6 9.3 9.1 15.9 9.1zm0-17.3c5.6 0 10.8 2.9 13.8 7.7-4.8 7.6-14.8 10-22.5 5.2-2.1-1.4-3.9-3.1-5.2-5.2 3-4.8 8.2-7.7 13.9-7.7z" /><path d="m15.9 15.7c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6zm0-10c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z" /></svg>
                                                    </button>
                                                </Link>
                                                <button className="group bg-gray-200 cursor-pointer hover:bg-blue-400 text-white w-8 h-8 flex items-center justify-center rounded-full">
                                                    <svg id="Layer_2" width="19" className="fill-gray-700 group-hover:fill-white" enable-background="new 0 0 64 64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="m50.3594 23.6494c-.0498-.1191-.1094-.2393-.1797-.3398-.0801-.1094-.1602-.21-.25-.3096-.75-.7402-2.0898-.7402-2.8301 0-.0898.0996-.1797.2002-.25.3096-.0693.1006-.1299.2207-.1797.3398-.0498.1201-.0898.25-.1201.3809-.0195.1191-.04.2598-.04.3896 0 .2598.0498.5195.1504.7598.0996.2402.25.46.4395.6504.3799.3799.8799.5898 1.4102.5898.1396 0 .2705-.0205.4004-.04.1201-.0303.25-.0703.3701-.1104.1191-.0498.2295-.1201.3398-.1895.1094-.0703.21-.1602.3096-.25.3799-.3799.5801-.8799.5801-1.4102 0-.1299-.0098-.2705-.04-.3896-.0197-.1308-.0597-.2607-.1105-.3808zm2.6406-8.4922h-5.3926v-5.5c0-1.9297-1.5703-3.5-3.5-3.5h-22.6201c-1.9297 0-3.5 1.5703-3.5 3.5v5.5h-6.9873c-3.0322 0-5.5 2.4678-5.5 5.5v19c0 3.0322 2.4678 5.5 5.5 5.5h6.9873v9.1855c0 1.9297 1.5703 3.5 3.5 3.5h22.6201c1.9297 0 3.5-1.5703 3.5-3.5v-9.1855h5.3926c3.0322 0 5.5-2.4678 5.5-5.5v-19c0-3.0322-2.4678-5.5-5.5-5.5zm-32.0127-5.5c0-.2754.2246-.5.5-.5h22.6201c.2754 0 .5.2246.5.5v5.5h-23.6201zm23.6201 44.6856c0 .2754-.2246.5-.5.5h-22.6201c-.2754 0-.5-.2246-.5-.5v-19.4121h23.6201zm10.8926-14.6856c0 1.3789-1.1211 2.5-2.5 2.5h-5.3926v-7.2266h3.3115c.8281 0 1.5-.6719 1.5-1.5s-.6719-1.5-1.5-1.5h-36.2431c-.8281 0-1.5.6719-1.5 1.5s.6719 1.5 1.5 1.5h3.3115v7.2266h-6.9873c-1.3789 0-2.5-1.1211-2.5-2.5v-19c0-1.3789 1.1211-2.5 2.5-2.5h42c1.3789 0 2.5 1.1211 2.5 2.5zm-31.2422 11.9756h12.249c.8281 0 1.5-.6719 1.5-1.5s-.6719-1.5-1.5-1.5h-12.249c-.8281 0-1.5.6719-1.5 1.5s.6719 1.5 1.5 1.5zm0-5.2461h8.5391c.8281 0 1.5-.6719 1.5-1.5s-.6719-1.5-1.5-1.5h-8.5391c-.8281 0-1.5.6719-1.5 1.5s.6719 1.5 1.5 1.5z" /></svg>
                                                </button>
                                                <button className="group bg-yellow-200 cursor-pointer hover:bg-blue-400 text-white w-8 h-8 flex items-center justify-center rounded-full">
                                                    <svg width="19" className="fill-yellow-700 group-hover:fill-white" viewBox="-18 0 401 401.46316" xmlns="http://www.w3.org/2000/svg"><path d="m16.25 334.8125c.714844 0 1.429688-.078125 2.128906-.230469l110.179688-23.976562c1.867187-.40625 3.582031-1.339844 4.9375-2.691407l186.625-186.164062c20.421875-20.371094 26.554687-51.046875 15.53125-77.703125-11.023438-26.660156-37.023438-44.046875-65.871094-44.046875h-.046875c-18.929687-.0390625-37.089844 7.5-50.421875 20.941406l-186.164062 186.625c-1.351563 1.355469-2.285157 3.070313-2.691407 4.9375l-23.976562 110.183594c-.644531 2.953125.085937 6.042969 1.984375 8.398438 1.898437 2.355468 4.761718 3.726562 7.785156 3.726562zm38.113281-120.191406 128.820313-129.140625 72.398437 72.398437-129.140625 128.820313zm179.105469-179.554688c9.589844-9.667968 22.65625-15.09375 36.273438-15.066406h.035156c20.75 0 39.460937 12.507812 47.390625 31.6875 7.929687 19.179688 3.519531 41.246094-11.175781 55.902344l-36.253907 36.164062-72.429687-72.433594zm-187.363281 199.585938 60.308593 60.304687-77.082031 16.773438zm0 0" /><path d="m354.503906 381.464844h-344.273437c-5.523438 0-10 4.476562-10 10 0 5.519531 4.476562 10 10 10h344.273437c5.523438 0 10-4.480469 10-10 0-5.523438-4.476562-10-10-10zm0 0" /></svg>
                                                </button>
                                                <button className="group bg-red-200 cursor-pointer hover:bg-blue-400 text-white w-8 h-8 flex items-center justify-center rounded-full">
                                                    <svg width="17" className="fill-red-700 group-hover:fill-white" id="Layer_1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m456.806 82.685h-113.933v-25.343a57.408 57.408 0 0 0 -57.342-57.342h-61.209a57.408 57.408 0 0 0 -57.342 57.342v25.343h-111.786a16 16 0 0 0 0 32h4.4v308.294a89.121 89.121 0 0 0 89.024 89.021h214.764a89.122 89.122 0 0 0 89.018-89.021v-308.294h4.4a16 16 0 0 0 0-32zm-257.826-25.343a25.371 25.371 0 0 1 25.342-25.342h61.209a25.371 25.371 0 0 1 25.342 25.342v25.343h-111.893zm221.42 365.637a57.085 57.085 0 0 1 -57.018 57.021h-214.764a57.085 57.085 0 0 1 -57.018-57.021v-308.294h328.8zm-237.313-26.844v-197.585a16 16 0 0 1 32 0v197.585a16 16 0 0 1 -32 0zm113.826 0v-197.585a16 16 0 0 1 32 0v197.585a16 16 0 0 1 -32 0z" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>{`Page ${currentPage} of ${totalPages}`}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListInvoice;
