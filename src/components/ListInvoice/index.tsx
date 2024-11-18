"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DetailInvoice from "../Showinvoice";
import Link from "next/link";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import { FaCalendarAlt } from "react-icons/fa"; // Import the calendar icon from react-icons
import InvoiceDetailModal from "../Modal/ModalInvoice";
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom';
import InvoiceTemplate from "@/components/Template/invoice.template";
import { log } from "util";




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
    role: string; // Add role to User type
};

const ListInvoice = () => {
    const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
    const [orders, setOrders] = useState<{ [key: string]: Order }>({});
    const [users, setUsers] = useState<{ [key: string]: User }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [startDate, setStartDate] = useState<Date | null>(null); // Start date for filtering
    const [endDate, setEndDate] = useState<Date | null>(null); // End date for filtering
    const [showModal, setShowModal] = useState(false);
    const [newRows, setNewRows] = useState<Set<string>>(new Set());



    // Open modal
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleReadMore = (invoiceId: string) => {
        console.log("dkhl l reead");

        const isDarkMode = document.documentElement.classList.contains('dark');  // Check if dark mode is enabled

        // Trigger Swal with dark mode conditionally applied
        Swal.fire({
            html: `<div><InvoiceTemplate invoiceId="${invoiceId}" /></div>`,  // The InvoiceTemplate will be rendered in the Swal modal
            showCloseButton: true,
            showConfirmButton: false,
            didOpen: () => {
                // Dynamically render the InvoiceTemplate inside Swal2
                const target = document.querySelector('.swal2-html-container');

                // Render the React component into the Swal container
                ReactDOM.render(<InvoiceTemplate invoiceId={invoiceId} />, target);

                // Apply the dark class to the Swal modal if dark mode is active
                if (isDarkMode) {
                    const swalContainer = document.querySelector('.swal2-popup');
                    swalContainer?.classList.add('dark');  // Adding the 'dark' class to Swal container
                }
            },
        });
    }


    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true); // Start loading
            try {
                const invoiceResponse = await axios.get("https://backendalaahd.onrender.com/api/invoices");
                const invoicesData = invoiceResponse.data;

                if (Array.isArray(invoicesData) && invoicesData.length > 0) {
                    setAllInvoices(invoicesData);
    
                    const newInvoiceIds = invoicesData
                        .filter((invoice) => isWithinLast10Minutes(invoice.fetchedAt))
                        .map((invoice) => invoice._id);
    
                    setNewRows(new Set(newInvoiceIds));
                }

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
                const customResponse = await axios.get("https://backendalaahd.onrender.com/api/users/role/custom");
                const fournResponse = await axios.get("https://backendalaahd.onrender.com/api/users/role/fourn");

                // Combine the 'custom' and 'fourn' users
                const customUsers = customResponse.data;
                const fournUsers = fournResponse.data;

                // Merge both user arrays into one
                const allUsers = [...customUsers, ...fournUsers];

                // Create a map of users by their _id
                const userMap = allUsers.reduce((acc: { [key: string]: User }, user: User) => {
                    acc[user._id] = user;
                    return acc;
                }, {});

                // Fetch the order data (this assumes you have orderPromises already)
                const orderResponses = await Promise.all(orderPromises);

                // Map the order data by _id
                const orderData = orderResponses.reduce((acc: { [key: string]: Order }, res) => {
                    acc[res.data._id] = res.data;
                    return acc;
                }, {});

                // Update the state with orders and users
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

    useEffect(() => {
        if (newRows.size > 0) {
            newRows.forEach((id) => {
                Swal.fire({
                    title: "Nouvelle facture",
                    text: `Facture with ID ${id} was added less than 10 minutes ago.`,
                    icon: "info",
                    timer: 10000, // Set the alert to auto-dismiss after 10 seconds
                    showConfirmButton: false,
                });
            });
        }
     }, [newRows]);

     useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setNewRows((prevNewRows) => {
                const updatedNewRows = new Set(
                    Array.from(prevNewRows).filter((id) => {
                        const invoice = allInvoices.find((inv) => inv._id === id);
                        return invoice && isWithinLast10Minutes(invoice.fetchedAt);
                    })
                );
                return updatedNewRows;
            });
        }, 60000); // Run every minute to clear expired rows
     
        return () => clearInterval(interval); // Cleanup on component unmount
     }, [allInvoices]);
     
     

    // Filter invoices by search term, status, and date range
    const filteredInvoices = allInvoices.filter((invoice) => {
        const customerUsername = users[invoice.customerId]?.username?.toLowerCase() || '';
        const invoiceRef = invoice.invoiceRef.toLowerCase();
        const statusMatch = selectedStatus === 'all' || orders[invoice.orderId[0]]?.status === selectedStatus;
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
    
        return dateB.getTime() - dateA.getTime(); // Descending order
    });

    // Pagination
    const totalRows = sortedInvoices.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const paginatedInvoices = sortedInvoices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);



    const formatFetchedAtDate = (fetchedAt: string) => {
        const date = new Date(fetchedAt);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
        });
    };

    const formatFetchedAtTime = (fetchedAt: string): string => {
        const date = new Date(fetchedAt);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Adds a leading 0 if minutes < 10
        
        // Optionally format to AM/PM format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format, with 12 for 0 hours
        
        return `${formattedHours}:${minutes} ${ampm}`; // Returns time in 12-hour format with AM/PM
        
        // Or, if you prefer 24-hour format:
        // return `${hours.toString().padStart(2, '0')}:${minutes}`;
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

    const isWithinLast10Minutes = (fetchedAt: string): boolean => {
        const now = new Date();
        const fetchedDate = new Date(fetchedAt);
        const timeDiff = (now.getTime() - fetchedDate.getTime()) / (1000 * 60); // Difference in minutes
        return timeDiff <= 10;
    };

    // Function to delete invoice and its associated orders
    const handleDeleteInvoice = async (invoiceId: string) => {
        try {
            // Then delete the invoice itself
            await axios.delete(`https://backendalaahd.onrender.com/api/invoices/${invoiceId}`);
            console.log(`Invoice ${invoiceId} deleted successfully.`);

            // Remove the invoice from the state
            setAllInvoices((prevInvoices) => prevInvoices.filter(invoice => invoice._id !== invoiceId));

        } catch (error) {
            console.error(`Failed to delete invoice ${invoiceId}:`, error);
        }
    };

    

    return (
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
            {/* Search Bar */}
            <div className="flex justify-between items-center gap-4 md:gap-[19rem] w-full">
                {/* Search Input */}
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

                {/* Filters: Status, Date Range */}
                <div className="w-full md:w-4/5 flex items-center float-end justify-end gap-4">
                    {/* Status Filter */}
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

                    {/* Start Date Filter */}
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

                    {/* End Date Filter */}
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
                    <span>Loading...</span> {/* Replace with a spinner if you have one */}
                </div>
            ) : (
                <div className="max-w-full overflow-x-auto">
                    <div className="relative overflow-x-auto">
    <table className="w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 text-left dark:bg-dark-2">
            <tr>
                {['Invoice Ref', 'Customer', 'Type', 'Order Status', 'Total', 'Date', 'Time', 'Actions'].map((header) => (
                    <th
                        key={header}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700"
                    >
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {paginatedInvoices.length === 0 ? (
                <tr>
                    <td
                        colSpan={8}
                        className="text-center px-4 py-4 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                        No invoices available
                    </td>
                </tr>
            ) : (
                paginatedInvoices.map((invoice) => {
                    const firstOrderId = invoice.orderId[0];
                    const fetchedAtTime = invoice.fetchedAt;
                    const orderStatus = firstOrderId ? orders[firstOrderId]?.status || "N/A" : "N/A";
                    const customerName = users[invoice.customerId]?.username || "N/A";
                    const { backgroundColor, textColor } = getStatusStyles(orderStatus);

                    return (
                        <tr key={invoice._id} className="hover:bg-gray-50 dark:hover:bg-dark-3">
                            <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">
                                {invoice.invoiceRef.replace("INV-", "")}
                            </td>
                            <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">
                                {customerName}
                            </td>
                            <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">
                                {users[invoice.customerId]?.role === "custom" ? "Client" : "Fournisseur"}
                            </td>
                            <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">
                                <span
                                    className={`rounded-full text-sm px-3 py-1 capitalize ${backgroundColor} ${textColor}`}
                                >
                                    {orderStatus}
                                </span>
                            </td>
                            <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">
                                <span
                                    className={`${
                                        invoice.type === "customer" ? "text-green-500" : "text-red-500"
                                    }`}
                                >
                                    {invoice.type === "customer" ? `+${invoice.total} dh` : `-${invoice.total} dh`}
                                </span>
                            </td>
                            <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">
                                {formatFetchedAtDate(fetchedAtTime)}
                            </td>
                            <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">
                                {formatFetchedAtTime(fetchedAtTime)}
                            </td>
                            <td className="px-4 py-2 border border-gray-200 dark:border-gray-700 flex gap-2 items-center">
                                <button
                                    onClick={() => handleReadMore(invoice._id)}
                                    className="w-8 h-8 rounded-full bg-blue-200 hover:bg-blue-400 flex items-center justify-center group"
                                >
                                    <svg
                                        className="w-5 h-5 fill-blue-700 group-hover:fill-white"
                                        viewBox="0 0 31.7 19.3"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M15.9 19.3c6.5 0 12.6-3.5 15.9-9.2v-1c-5.1-8.8-16.3-11.8-25-6.7-2.9 1.7-5.2 4-6.8 6.8v1c3.3 5.6 9.3 9.1 15.9 9.1zm0-17.3c5.6 0 10.8 2.9 13.8 7.7-4.8 7.6-14.8 10-22.5 5.2-2.1-1.4-3.9-3.1-5.2-5.2 3-4.8 8.2-7.7 13.9-7.7z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    );
                })
            )}
        </tbody>
    </table>
</div>

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
