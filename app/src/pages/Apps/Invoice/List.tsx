import { Link } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Pagination, Modal } from '@mantine/core';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconEye from '../../../components/Icon/IconEye';
import axios from 'axios';


interface Invoice {
    _id: string;
    invoiceRef: string;
    customerId: string;
    total: number;
    orderId: string;
    fetchedAt: string;
    dueDate?: string;
}

interface User {
    username: string;
    userType: string; 
}

const List = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Invoice List'));
    }, [dispatch]);

    const [items, setItems] = useState<Invoice[]>([]);
    const [users, setUsers] = useState<{ [key: string]: User }>({});
    const [page, setPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [totalPages, setTotalPages] = useState(1);
    const [records, setRecords] = useState<Invoice[]>([]);
    const [search, setSearch] = useState('');
    const [orderStatuses, setOrderStatuses] = useState<{ [key: string]: { status: string; dueDate: string } }>({});
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'invoiceRef',
        direction: 'asc',
    });
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [modalOpened, setModalOpened] = useState(false);
    const [filteredInvoiceCount, setFilteredInvoiceCount] = useState(0);
    const [filteredTotalAmount, setFilteredTotalAmount] = useState(0);

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        const filteredItems = items.filter((item) => {
            const matchesInvoiceRef = item.invoiceRef.toLowerCase().includes(search.toLowerCase());
            const matchesUsername = users[item.customerId]?.username.toLowerCase().includes(search.toLowerCase());
            return matchesInvoiceRef || matchesUsername;
        });

        setFilteredInvoiceCount(filteredItems.length);
        const totalAmount = filteredItems.reduce((sum, invoice) => sum + invoice.total, 0);
        setFilteredTotalAmount(totalAmount);

        setTotalPages(Math.ceil(filteredItems.length / recordsPerPage));
        const from = (page - 1) * recordsPerPage;
        const to = from + recordsPerPage;
        setRecords(filteredItems.slice(from, to));
    }, [page, items, search, recordsPerPage, users]);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('https://backendalaahd.onrender.com/api/invoices');
            const fetchedItems = response.data;

            setItems(fetchedItems);
            setTotalPages(Math.ceil(fetchedItems.length / recordsPerPage));
            setRecords(fetchedItems.slice(0, recordsPerPage));
            fetchUsernamesForInvoices(fetchedItems);

            const orderIds = fetchedItems.map((invoice) => invoice.orderId).filter(Boolean);
            await fetchOrderStatuses(orderIds, fetchedItems);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    const fetchUsernamesForInvoices = async (invoices: Invoice[]) => {
        const customerIds = [...new Set(invoices.map((invoice) => invoice.customerId))];
        try {
            const userRequests = customerIds.map(async (customerId) => {
                const response = await axios.get(`https://backendalaahd.onrender.com/api/users/${customerId}`);
                return { customerId, username: response.data.username, userType: response.data.userType };
            });
            const usersData = await Promise.all(userRequests);
            const usersMap = usersData.reduce((acc: any, user: any) => {
                acc[user.customerId] = { username: user.username, userType: user.userType };
                return acc;
            }, {});
            setUsers(usersMap);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchOrderStatuses = async (orderIds: string[], fetchedInvoices: Invoice[]) => {
        // Your logic for fetching order statuses goes here
    };

    const deleteRow = async (id: string) => {
        try {
            await axios.delete(`https://backendalaahd.onrender.com/api/invoices/${id}`);
            fetchInvoices(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting invoice:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleInvoiceClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setModalOpened(true);
    };

    const formatPrice = (amount: number) => {
        return amount.toLocaleString('de-DE', { minimumFractionDigits: 2 });
    };

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4 px-5 flex md:items-center md:flex-row flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <button type="button" className="btn btn-danger gap-2" onClick={() => items[0]?._id && deleteRow(items[0]._id)}>
                            <IconTrashLines />
                            Delete
                        </button>
                        <Link to="/apps/invoice/add" className="btn btn-primary gap-2">
                            <IconPlus />
                            Add New
                        </Link>
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input
                            type="text"
                            className="form-input w-auto"
                            placeholder="Search by invoice or customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="px-5 mb-4">
                    <h3 className="text-lg font-semibold">
                        {filteredInvoiceCount} invoice(s) found. Total Amount: {formatPrice(filteredTotalAmount)} DH
                    </h3>
                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        records={records}
                        columns={[
                            {
                                accessor: 'invoiceRef',
                                title: 'Invoice',
                                render: (invoice: Invoice) => invoice.invoiceRef.replace('INV-', ''),
                            },
                            {
                                accessor: 'customerId',
                                title: 'Customer',
                                render: (invoice: Invoice) => users[invoice.customerId]?.username || 'Unknown',
                            },
                            {
                                accessor: 'userType',
                                title: 'User Type',
                                render: (invoice: Invoice) => users[invoice.customerId]?.userType || 'Unknown',
                            },
                            {
                                accessor: 'total',
                                title: 'Total Amount',
                                render: (invoice: Invoice) => formatPrice(invoice.total),
                            },
                            {
                                accessor: 'dueDate',
                                title: 'Due Date',
                                render: (invoice: Invoice) => formatDate(invoice.dueDate || ''),
                            },
                            {
                                accessor: 'fetchedAt',
                                title: 'Fetched At',
                                render: (invoice: Invoice) => formatDate(invoice.fetchedAt),
                            },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                render: (invoice: Invoice) => (
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleInvoiceClick(invoice)}>
                                            <IconEye />
                                        </button>
                                        <Link to={`/apps/invoice/edit/${invoice._id}`}>
                                            <IconEdit />
                                        </Link>
                                    </div>
                                ),
                            },
                        ]}
                        totalRecords={items.length}
                        page={page}
                        onPageChange={setPage}
                        recordsPerPage={recordsPerPage}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                    />
                </div>
            </div>

            {selectedInvoice && (
                <Modal
                    opened={modalOpened}
                    onClose={() => setModalOpened(false)}
                    title={`Invoice Details: ${selectedInvoice.invoiceRef}`}
                >
                    {/* Your invoice detail content goes here */}
                </Modal>
            )}
        </div>
    );
};

export default List;
