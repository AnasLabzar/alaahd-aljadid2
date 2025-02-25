"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import ReactDOM from "react-dom";
import InvoiceTemplate from "@/components/Template/invoice.template";

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
    ordred: string;
    dueDate: string;
};

type User = {
    _id: string;
    username: string;
    role: string;
};

const ListInvoice = () => {
    const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
    const [orders, setOrders] = useState<{ [key: string]: Order }>({});
    const [users, setUsers] = useState<{ [key: string]: User }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [newRows, setNewRows] = useState<Set<string>>(new Set());

    // Fetch invoices and related data
    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const invoiceResponse = await axios.get("https://backendalaahd.onrender.com/api/invoices");
            const invoicesData = invoiceResponse.data;

            if (Array.isArray(invoicesData)) {
                setAllInvoices(invoicesData);

                // Fetch orders and users
                const orderPromises = invoicesData.flatMap((invoice) =>
                    invoice.orderId.length > 0
                        ? axios.get(`https://backendalaahd.onrender.com/api/orders/${invoice.orderId[0]}`)
                        : []
                );

                const customResponse = await axios.get("https://backendalaahd.onrender.com/api/users/role/custom");
                const fournResponse = await axios.get("https://backendalaahd.onrender.com/api/users/role/fourn");

                const allUsers = [...customResponse.data, ...fournResponse.data];
                const userMap = allUsers.reduce((acc, user) => {
                    acc[user._id] = user;
                    return acc;
                }, {} as { [key: string]: User });

                const orderResponses = await Promise.all(orderPromises);
                const orderData = orderResponses.reduce((acc, res) => {
                    acc[res.data._id] = res.data;
                    return acc;
                }, {} as { [key: string]: Order });

                setOrders(orderData);
                setUsers(userMap);

                // Check for new invoices
                const newInvoiceIds = invoicesData
                    .filter((invoice) => isWithinLast10Minutes(invoice.fetchedAt))
                    .map((invoice) => invoice._id);

                setNewRows(new Set(newInvoiceIds));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // // Auto-refresh every 60 seconds
    // useEffect(() => {
    //     fetchInvoices(); // Initial fetch
    //     const interval = setInterval(fetchInvoices, 60000); // Refresh every 60 seconds
    //     return () => clearInterval(interval); // Cleanup on unmount
    // }, []);

    // Show alerts for new invoices
    useEffect(() => {
        if (newRows.size > 0) {
            newRows.forEach((id) => {
                Swal.fire({
                    title: "Nouvelle facture",
                    text: `Facture with ID ${id} was added less than 10 minutes ago.`,
                    icon: "info",
                    timer: 10000, // Auto-dismiss after 10 seconds
                    showConfirmButton: false,
                });
            });
        }
    }, [newRows]);

    // Filter invoices by search term, status, and date range
    const filteredInvoices = allInvoices.filter((invoice) => {
        const customerUsername = users[invoice.customerId]?.username?.toLowerCase() || "";
        const invoiceRef = invoice.invoiceRef.toLowerCase();
        const statusMatch = selectedStatus === "all" || orders[invoice.orderId[0]]?.status === selectedStatus;
        const searchMatch = customerUsername.includes(searchTerm.toLowerCase()) || invoiceRef.includes(searchTerm.toLowerCase());

        const fetchedAtDate = new Date(invoice.fetchedAt);
        const dateMatch = fetchedAtDate
            ? (!startDate || fetchedAtDate >= startDate) && (!endDate || fetchedAtDate <= endDate)
            : false;

        return searchMatch && statusMatch && dateMatch;
    });

    // Sort invoices by fetchedAt (most recent first)
    const sortedInvoices = filteredInvoices.sort((a, b) => {
        const dateA = new Date(a.fetchedAt);
        const dateB = new Date(b.fetchedAt);
        return dateB.getTime() - dateA.getTime();
    });

    // Pagination
    const totalRows = sortedInvoices.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const paginatedInvoices = sortedInvoices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Helper functions
    const formatFetchedAtDate = (fetchedAt: string) => {
        if (!fetchedAt) return "N/A"; // Handle missing date
        const date = new Date(fetchedAt);
        if (isNaN(date.getTime())) return "N/A"; // Handle invalid date
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    };

    const formatFetchedAtTime = (fetchedAt: string) => {
        const date = new Date(fetchedAt);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes} ${ampm}`;
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "pending":
                return { backgroundColor: "bg-yellow-200", textColor: "text-yellow-800" };
            case "paid":
                return { backgroundColor: "bg-green-200", textColor: "text-green-800" };
            case "retour":
                return { backgroundColor: "bg-red-200", textColor: "text-red-800" };
            case "credit":
                return { backgroundColor: "bg-orange-200", textColor: "text-orange-800" };
            default:
                return { backgroundColor: "bg-gray-200", textColor: "text-gray-800" };
        }
    };

    const isWithinLast10Minutes = (fetchedAt: string) => {
        const now = new Date();
        const fetchedDate = new Date(fetchedAt);
        const timeDiff = (now.getTime() - fetchedDate.getTime()) / (1000 * 60);
        return timeDiff <= 10;
    };

    const handleDeleteInvoice = async (invoiceId: string) => {
        try {
            await axios.delete(`https://backendalaahd.onrender.com/api/invoices/${invoiceId}`);
            setAllInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice._id !== invoiceId));
        } catch (error) {
            console.error("Failed to delete invoice:", error);
        }
    };

    const handleReadMore = (invoiceId: string) => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        Swal.fire({
            html: `<div><InvoiceTemplate invoiceId="${invoiceId}" /></div>`,
            showCloseButton: true,
            showConfirmButton: false,
            didOpen: () => {
                const target = document.querySelector(".swal2-html-container");
                ReactDOM.render(<InvoiceTemplate invoiceId={invoiceId} />, target);
                if (isDarkMode) {
                    const swalContainer = document.querySelector(".swal2-popup");
                    swalContainer?.classList.add("dark");
                }
            },
        });
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
            {/* Search Bar and Filters */}
<div className="flex justify-between items-center gap-4 md:gap-[19rem] w-full">
    <div className="w-full md:w-2/5 flex items-center mb-4">
        <input
            type="text"
            placeholder="Search by customer or invoice reference"
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-blue-300 transition duration-200"
        />
    </div>
    <div className="w-full md:w-4/5 flex items-center float-end justify-end gap-4">
        {/* Add the refresh button here */}
        <button
            onClick={fetchInvoices} // Call fetchInvoices on click
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Refresh
        </button>

        {/* Existing filters */}
        <div className="w-full md:w-1/3 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded">
            <svg
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                className="text-gray-500"
            >
                <g transform="matrix(1,0,0,1,0,0)">
                    <g id="Layer_64" data-name="Layer 64">
                        <path
                            d="m61.44 13.57-3-10a1.5 1.5 0 0 0 -1.44-1.07h-50a1.5 1.5 0 0 0 -1.44 1.07l-3 10a1.52 1.52 0 0 0 .24 1.33 1.49 1.49 0 0 0 1.2.6h56a1.49 1.49 0 0 0 1.2-.6 1.52 1.52 0 0 0 .24-1.33z"
                            fill="#b3b3b3"
                            fill-opacity="1"
                        />
                        <path
                            d="m61.35 13.34a1.51 1.51 0 0 0 -1.35-.84h-56a1.51 1.51 0 0 0 -1.35.84 1.49 1.49 0 0 0 .17 1.58l17.25 22.16v22.92a1.51 1.51 0 0 0 1.5 1.5 1.52 1.52 0 0 0 .66-.15l20.86-10.29a1.51 1.51 0 0 0 .84-1.35v-12.63l17.25-22.16a1.49 1.49 0 0 0 .17-1.58z"
                            fill="#ffac32"
                            fill-opacity="1"
                        />
                    </g>
                </g>
            </svg>
            <span className="w-full text-sm text-gray-700">Filter avec:</span>
            <select
                id="statusFilter"
                value={selectedStatus}
                aria-placeholder="Status"
                onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-300"
            >
                <option value="all" defaultChecked>
                    Tous
                </option>
                <option value="pending">Pending</option>
                <option value="paid">Payée</option>
                <option value="retour">Retour</option>
                <option value="credit">Credit</option>
            </select>
        </div>
        <div className="w-full md:w-1/3 relative flex items-center">
            <FaCalendarAlt className="absolute left-3 text-white-dark" />
            <DatePicker
                selected={startDate ?? undefined}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate ?? undefined}
                endDate={endDate ?? undefined}
                placeholderText="Start Date"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
        </div>
        <div className="w-full md:w-1/3 relative flex items-center">
            <FaCalendarAlt className="absolute left-3 text-white-dark" />
            <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate ?? undefined}
                endDate={endDate ?? undefined}
                minDate={startDate ?? undefined}
                placeholderText="End Date"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
        </div>
    </div>
</div>

            {/* Loading Indicator */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span>Loading...</span>
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
                                    const fetchedAtTime = invoice.fetchedAt;
                                    const orderStatus = firstOrderId ? orders[firstOrderId]?.status || "N/A" : "N/A";
                                    const ordredDate = firstOrderId ? orders[firstOrderId]?.dueDate || "N/A" : "N/A";
                                    const customerName = users[invoice.customerId]?.username || "N/A";
                                    const { backgroundColor, textColor } = getStatusStyles(orderStatus);

                                    return (
                                        <tr key={invoice._id}>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                                                {invoice.invoiceRef.replace("INV-", "")}
                                            </td>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">{customerName}</td>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                                                {users[invoice.customerId]?.role === "fournisseur" ? `Fournisseur` : `Client`}
                                            </td>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                                                <span className={`rounded-full text-[14px] px-5 py-2 capitalize ${backgroundColor} ${textColor}`}>
                                                    {orderStatus}
                                                </span>
                                            </td>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                                                <span className={invoice.type === "fournisseur" ? "text-red-500" : "text-green-500"}>
                                                    {invoice.type === "fournisseur" ? `-${invoice.total} dh` : `+${invoice.total} dh`}
                                                </span>
                                            </td>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                                                {formatFetchedAtDate(ordredDate)}
                                            </td>
                                            <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                                                {formatFetchedAtTime(fetchedAtTime)}
                                            </td>
                                            <td className="border-[#eee] flex gap-2 px-4 py-4 dark:border-dark-3">
                                                <button
                                                    onClick={() => handleReadMore(invoice._id)}
                                                    className="group bg-blue-200 cursor-pointer hover:bg-blue-400 text-white w-8 h-8 flex items-center justify-center rounded-full"
                                                >
                                                    <svg id="Layer_5" width="17" className="fill-blue-700 group-hover:fill-white" enable-background="new 0 0 31.7 19.3" viewBox="0 0 31.7 19.3" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="m15.9 19.3c6.5 0 12.6-3.5 15.9-9.2v-1c-5.1-8.8-16.3-11.8-25-6.7-2.9 1.7-5.2 4-6.8 6.8v1c3.3 5.6 9.3 9.1 15.9 9.1zm0-17.3c5.6 0 10.8 2.9 13.8 7.7-4.8 7.6-14.8 10-22.5 5.2-2.1-1.4-3.9-3.1-5.2-5.2 3-4.8 8.2-7.7 13.9-7.7z" />
                                                        <path d="m15.9 15.7c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6zm0-10c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleDeleteInvoice(invoice._id)} className="group bg-red-200 cursor-pointer hover:bg-blue-400 text-white w-8 h-8 flex items-center justify-center rounded-full">
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
