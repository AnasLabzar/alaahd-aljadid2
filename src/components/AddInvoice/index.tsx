"use client"; // Add this line to indicate that this is a Client Component

// pages/add-invoice.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SelectChangeEvent } from '@mui/material';
import { ChangeEvent } from 'react';
import Image from "next/image";
import CustomerSelect from '../CustomerSelect';
import Link from 'next/link'; // Import Link from next/link
import { FormControl, TextField, InputLabel, Select, MenuItem } from '@mui/material'; // Import FormControl and other components here
import AddProduct from '../Modal/ModalAddProduct';


interface ProductType {
    _id: string;
    title: string;
    colorsId: string[];
    priceId: string; // Changed from string[] to string
}

type Item = {
    quantity: number;
    price: number;
};



interface ColorType {
    _id: string;
    refColor: string; // The hex code for color
    colorName: string;
    stock_color: number;
}

interface InvoiceItem {
    _id: number;
    title: string;
    description: string;
    rate: number;
    quantity: number;
    price: number;
    productId: string;
    Refcolor: string;
    colors: ColorType[]; // Change this from never[] to ColorType[]
    searchTerm: string;
    profit: number; // Ensure this is included
}



const AddInvoice = () => {

    const [items, setItems] = useState<InvoiceItem[]>([
        {
            _id: 1,
            title: '',
            description: '',
            rate: 0,
            quantity: 0,
            price: 0,
            productId: '',
            Refcolor: '',
            colors: [],
            searchTerm: '', // Initialize search term
            profit: 0,
        },
    ]);

    const [products, setProducts] = useState<ProductType[]>([]);
    const [colors, setColors] = useState<ColorType[]>([]);
    const [invoiceRef, setInvoiceRef] = useState<string>('');
    const [customerId, setCustomerId] = useState<string>(''); // or whatever type is appropriate
    const [typeFacturation, setTypeFacturation] = useState('customer');
    const [showModal, setShowModal] = useState(false);
    const [tax, setTax] = useState<number>(0); // State for tax percentage
    const [promotion, setPromotion] = useState<number>(0); // State for promotion percentage
    const [transportPrice, setTransportPrice] = useState<number>(0); // State for transport price
    const [ordredDate, setOrdredDate] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [adminId, setAdminId] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [status, setStatus] = useState<string>('pending');


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://backendalaahd.onrender.com/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchColors = async () => {
            try {
                const response = await axios.get('https://backendalaahd.onrender.com/api/colors');
                setColors(response.data);
            } catch (error) {
                console.error("Error fetching Colors:", error);
            }
        };

        fetchProducts();
        fetchColors();
        setInvoiceRef(generateInvoiceRef());
    }, []);

    const handleProductChange = (event: SelectChangeEvent<any>, itemId: number) => {
        const selectedProductId = event.target.value as string;
        const selectedProduct = products.find(product => product._id === selectedProductId);

        if (selectedProduct) {
            const productColors = selectedProduct.colorsId.map(colorId => {
                const color = colors.find(color => color._id === colorId);
                return color ? { _id: color._id, refColor: color.refColor, colorName: color.colorName } : null;
            }).filter(Boolean) as ColorType[];

            const refColor = productColors.length > 0 ? productColors[0].refColor : '';
            const productPriceId = selectedProduct.priceId;

            if (productPriceId.length > 0) {
                const firstProductPriceId = productPriceId;

                fetchProductPrice(firstProductPriceId).then(({ price, profit }) => {
                    setItems(prevItems =>
                        prevItems.map(item =>
                            item._id === itemId
                                ? {
                                    ...item,
                                    productId: selectedProductId,
                                    title: selectedProduct.title,
                                    Refcolor: refColor,
                                    colors: productColors, // This should now match the ColorType[]
                                    price: price,
                                    profit: profit,
                                }
                                : item
                        )
                    );
                });
            } else {
                console.error("productPriceId is empty");
            }
        }

    };


    const getProductPrice = async (productId: string): Promise<number> => {
        const response = await axios.get(`https://backendalaahd.onrender.com/api/products/${productId}`);
        return response.data.priceId; // Assuming the price is returned in the response
    };


    const fetchProductPrice = async (productPriceId: string): Promise<{ price: number; profit: number }> => {
        try {
            const response = await fetch(`https://backendalaahd.onrender.com/api/prices/${productPriceId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch price details');
            }

            const productData = await response.json();
            console.log("Full Product Data: ", productData); // Log the entire response

            if (productData.price !== undefined && productData.profit !== undefined) { // Assuming profit is returned
                console.log("Fetched Price: ", productData.price);
                console.log("Fetched Profit: ", productData.profit);
                return { price: productData.price, profit: productData.profit }; // Return price and profit
            } else {
                console.error("Price or profit not found in the response");
                return { price: 0, profit: 0 }; // Default values
            }

        } catch (error) {
            console.error('Error fetching product price:', error);
            return { price: 0, profit: 0 }; // Return default values
        }
    };


    const generateInvoiceRef = (): string => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const timestamp = String(Date.now()).slice(0, 9);
        const random4 = Math.floor(1000 + Math.random() * 9000);
        return `INV-${day}${month}${timestamp}${random4}`;
    };

    const addItem = () => {
        setItems(prevItems => [
            ...prevItems,
            {
                _id: prevItems.length ? Math.max(...prevItems.map(item => item._id)) + 1 : 1,
                title: '',
                description: '',
                rate: 0,
                quantity: 0,
                price: 0,      // Ensure price is set
                total: 0,      // Initialize total field
                discount: 0,   // Initialize discount field
                productId: '',
                Refcolor: '',
                colors: [],
                searchTerm: '', // Initialize search term for new item
                profit: 0,     // Initialize profit field (if required)
                ordred: new Date().toISOString().split('T')[0], // Initialize with today's date
                dueDate: '',   // Set an appropriate due date if needed
                status: 'pending',  // Set default status
                note: '',      // Initialize note field
            },
        ]);
    };


    const removeItem = (id: number) => {
        setItems(prevItems => prevItems.filter(item => item._id !== id));
    };

    const handleSearchChange = (itemId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setItems(prevItems =>
            prevItems.map(item =>
                item._id === itemId ? { ...item, searchTerm: value } : item
            )
        );
    };

    // Open modal
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        setTypeFacturation(event.target.value);
    };

    const changeQuantityPrice = (type: 'quantity' | 'price', value: number, id: number) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item._id === id
                    ? {
                        ...item,
                        quantity: type === 'quantity' ? Math.max(0, value) : item.quantity,
                        price: type === 'price' ? Math.max(0, value) : item.price,
                    }
                    : item
            )
        );
    };

    // Capture Tax and Promotion Changes
    const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setTax(isNaN(value) ? 0 : value); // Ensure tax is a number
    };

    const handlePromotionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setPromotion(isNaN(value) ? 0 : value); // Ensure promotion is a number
    };

    const handleTransportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setTransportPrice(isNaN(value) ? 0 : value); // Ensure transport is a number
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(event.target.value);
    };

    // Calculate subtotal, tax, promotion, transport dynamically
    const calculateTotal = (items: Item[]) => {
        const subtotal = items.reduce((total: number, item: Item) => total + item.quantity * item.price, 0);
        const taxAmount = (tax / 100) * subtotal;
        const promotionAmount = (promotion / 100) * subtotal;
        const total = (subtotal + taxAmount - promotionAmount) + transportPrice;

        return {
            subtotal: subtotal.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            promotionAmount: promotionAmount.toFixed(2),
            total: total.toFixed(2),
            transportPrice: transportPrice.toFixed(2),
        };
    };

    const totals = calculateTotal(items); // Get all totals (subtotal, tax, promotion, final total)

const insertOrders = async (items: InvoiceItem[]): Promise<string[]> => {
    try {
        const orders = items.map((item) => ({
            refOrder: generateOrderRef(),
            totalProfit: calculateTotalProfit(item.profit, item.quantity),
            ordred: new Date(ordredDate).toISOString(),
            dueDate: new Date(dueDate).toISOString(),
            quantity: item.quantity,
            total: item.price * item.quantity,
            discount: promotion,
            status,
            note: item.description,
        }));

        const response = await axios.post('https://backendalaahd.onrender.com/api/orders', { orders });
        return response.data.orderIds; // Backend should return order IDs for all inserted orders
    } catch (error) {
        console.error("Error inserting orders:", error);
        return [];
    }
};



    // Handle input change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'inv-date') {
            setOrdredDate(value); // Date de creation
        } else if (name === 'due-date') {
            setDueDate(value); // Date de fin
        }
    }

    const generateOrderRef = (): string => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        const randomNum = Math.floor(10 + Math.random() * 90); // Generates a 2-digit random number

        // Construct the order reference
        return `ORD-BL${randomNum}-${day}${month}${year}-${randomNum}`;
    };

    const calculateTotalProfit = (profit: number, quantity: number) => {
        return profit * quantity; // Total profit is profit per item multiplied by quantity
    };

    console.log(calculateTotalProfit);

    useEffect(() => {
        // Function to get a cookie by name
        const getCookie = (name: string): string | null => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
          return null;
        };
    
        // Get the `user-info` cookie value
        const userInfoCookie = getCookie('user-info');
    
        // Parse it as JSON to access `username`
        if (userInfoCookie) {
          try {
            const userInfo = JSON.parse(userInfoCookie);
            setAdminId(userInfo._id);
            setUsername(userInfo.username);
          } catch (error) {
            console.error("Failed to parse user-info cookie:", error);
          }
        } else {
          console.log("user-info cookie not found");
        }
      }, []);



    const updateStockQuantity = async (items: InvoiceItem[]) => {
    try {
        const stockUpdates = items.map(async (item) => {
            // Fetch the color details for the item based on Refcolor
            const color = colors.find(color => color.refColor === item.Refcolor);

            if (color && typeof color.stock_color === 'number' && typeof item.quantity === 'number') {
                const updatedStock = typeFacturation === 'customer'
                    ? Math.max(0, color.stock_color - item.quantity) // Subtract for customer
                    : color.stock_color + item.quantity; // Add for supplier
            
                // Update the stock in the database
                const response = await axios.put(`https://backendalaahd.onrender.com/api/colors/${color._id}`, {
                    stock_color: updatedStock,
                });
            }
        });

        await Promise.all(stockUpdates); // Wait for all stock updates to complete
        console.log("Stock updated successfully!");
    } catch (error) {
        console.error("Error updating stock:", error);
        throw new Error("Failed to update stock");
    }
};

const insertInvoice = async (orderIds: string[], items: InvoiceItem[]) => {
    try {
        // Call the calculateTotal function to get the total value
        const totals = calculateTotal(items); // Ensure calculateTotal accepts and processes the items

        const invoiceData = {
            invoiceRef: generateInvoiceRef(), // Function to generate your invoice ref
            orderId: orderIds, // Insert orderId array
            customerId: customerId, // Assuming customerId is already set
            adminId: 'adminId_here', // Replace with the correct admin ID
            productId: items.map(item => item.productId), // Insert productId array
            total: parseFloat(totals.total), // Ensure the total is a number
            type: typeFacturation, // Example type
        };

        const response = await axios.post('https://backendalaahd.onrender.com/api/invoices', invoiceData); // Adjust your endpoint
        console.log("Invoice inserted successfully:", response.data);
    } catch (error) {
        console.error("Error inserting invoice:", error);
        throw new Error("Failed to insert invoice");
    }
};

const handleSubmit = async () => {
    try {
        const orderIds = await insertOrders(items); // Insert orders and get IDs
        await insertInvoice(orderIds, items); // Insert the invoice
        await updateStockQuantity(items); // Update stock based on the invoice type
        alert("Facture, commandes créées, et stock mis à jour avec succès");
    } catch (error) {
        console.error("Error during submission:", error);
        alert("There was an error processing the invoice. Please try again.");
    }
};





    return (
        <div className="flex xl:flex-row flex-col gap-2.5">
            <div className="bg-white p-5 shadow dark:bg-black px-4 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                <div className="flex justify-between flex-wrap px-4">
                    <div className="mb-6 lg:w-1/2 w-full">
                        <div className="flex items-center text-black dark:text-white shrink-0">
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
                        </div>
                        <div className="space-y-1 mt-6 text-gray-500 dark:text-gray-400">
                            <div>El Gouassem, Route de l'ourika, Marrakech-safi</div>
                            <div>alaahd-aljadid@gmail.com</div>
                            <div>+212 689-063963</div>
                        </div>
                        <div className="space-y-1 mt-4 text-black dark:text-gray-400 font-bold">
                            <div>Agent de facturation:</div>
                            <div className='font-medium text-gray-400 dark:text-gray-500'>M. <span>{username}</span></div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full lg:max-w-fit">
                        <div className="flex gap-2 flex-col items-center sm:flex-row mt-4">
                            <label htmlFor="invoiceRef" className="text-left flex-1 ltr:mr-2 rtl:ml-2 mb-0">
                                Facture numéro
                            </label>
                            <input
                                id="invoiceRef"
                                value={invoiceRef}
                                type="text"
                                className="form-input lg:w-[250px] w-2/3"
                                placeholder="#8801"
                                readOnly
                            />
                        </div>
                        <div className="flex gap-2 flex-col items-center sm:flex-row mt-4">
                            <label htmlFor="customerSelect" className="text-left flex-1 ltr:mr-2 rtl:ml-2 mb-0">
                                Nom de client
                            </label>
                            {/* Replace input with the CustomerSelect component */}
                            <CustomerSelect
                                id="customerSelect"
                                onCustomerChange={(selectedCustomer) => setCustomerId(selectedCustomer)}
                            // className="lg:w-[250px] w-2/3"
                            />

                        </div>

                        <div className="flex gap-2 flex-col items-center sm:flex-row mt-4">
                            <label htmlFor="startDate" className="text-left flex-1 ltr:mr-2 rtl:ml-2 mb-0">
                                Date de creation
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                name="inv-date"
                                value={ordredDate}
                                onChange={handleDateChange}
                                className="form-input lg:w-[250px] w-2/3"
                            />
                        </div>
                        <div className="flex gap-2 flex-col items-center sm:flex-row mt-4">
                            <label htmlFor="dueDate" className="text-left flex-1 ltr:mr-2 rtl:ml-2 mb-0">
                                Date de fin
                            </label>
                            <input
                                id="dueDate"
                                type="date"
                                name="due-date"
                                value={dueDate}
                                onChange={handleDateChange}
                                className="form-input lg:w-[250px] w-2/3"
                            />
                        </div>
                    </div>
                </div>
                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                <div className="mt-8 px-[14px]">
                    <div className="table-responsive overflow-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-gray-500">
                                    <th className="p-2 text-left dark:text-white">ID</th>
                                    <th className="p-2 text-left dark:text-white">Order</th>
                                    <th className="p-2 text-left dark:text-white">Prix</th>
                                    <th className="p-2 text-left dark:text-white">Quantité</th>
                                    <th className="p-2 text-left dark:text-white">Totale</th>
                                    <th className="p-2 dark:text-white"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item._id}>
                                        <td className="p-2">{index + 1}</td>
                                        <td className="p-2">
                                            <FormControl fullWidth style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                                <TextField
                                                    placeholder="Rechercher produit"
                                                    value={item.searchTerm}
                                                    onChange={handleSearchChange(item._id)}
                                                    style={{ display: 'flex', alignSelf: 'center' }}
                                                    className='dark:text-white'
                                                />

                                                <Select
                                                    value={item.productId}
                                                    className='dark:text-white'
                                                    onChange={(event) => handleProductChange(event, item._id)}
                                                    style={{ display: 'flex', alignSelf: 'center' }}
                                                >
                                                    {products
                                                        .filter(product => product.title.toLowerCase().includes(item.searchTerm.toLowerCase())) // Filter by item-specific search term
                                                        .map((product) => {
                                                            const productColors = product.colorsId.map(colorId => {
                                                                const color = colors.find(color => color._id === colorId);
                                                                return color ? { _id: color._id, refColor: color.refColor, colorName: color.colorName } : null;
                                                            }).filter(Boolean) as ColorType[];

                                                            return (
                                                                <MenuItem key={product._id} value={product._id}>
                                                                    <div className="flex items-center">
                                                                        <span style={{
                                                                            backgroundColor: productColors.length > 0 ? productColors[0].refColor : '#ffffff', // Default color
                                                                            width: '20px',
                                                                            height: '20px',
                                                                            borderRadius: '50%',
                                                                            marginRight: '5px'
                                                                        }} />
                                                                        {product.title}
                                                                        <span className='dark:text-white' style={{ marginLeft: '10px', color: '#666' }}>
                                                                            {productColors.map(color => color.colorName).join(', ')}
                                                                        </span>
                                                                    </div>
                                                                </MenuItem>
                                                            );
                                                        })}
                                                </Select>
                                            </FormControl>
                                        </td>


                                        <td className="p-2">
                                            <TextField
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => changeQuantityPrice('price', Number(e.target.value), item._id)}
                                                className="w-auto dark:text-white text-gray-5"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <TextField
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => changeQuantityPrice('quantity', Number(e.target.value), item._id)}
                                                className="w-auto dark:text-white"
                                            />
                                        </td>
                                        <td className="p-2 dark:text-white">{(item.price * item.quantity).toFixed(2)}</td>
                                        <td className="p-2 dark:text-white">
                                            <button onClick={() => removeItem(item._id)} className="fill-red-600">
                                                <svg width="12" id="Layer_1" enable-background="new 0 0 25.9 32" viewBox="0 0 25.9 32" xmlns="http://www.w3.org/2000/svg"><path d="m8 10h2v16h-2z" /><path d="m12 10h2v16h-2z" /><path d="m16 10h2v16h-2z" /><path d="m18 4v-4h-10v4h-8v2h2l1 23c0 1.7 1.3 3 3 3h14c1.6 0 3-1.3 3-3l1-23h1.9v-2zm-8-2h6v2h-6zm11 27c0 .6-.4 1-1 1h-14c-.6 0-1-.5-1-1l-1-23h18z" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                    <div className="flex justify-between sm:flex-row flex-col mt-6 px-4">
                        <div className="sm:mb-0 mb-6">
                            <button type="button" className="btn btn-primary" onClick={addItem}>
                                Ajoutez produit
                            </button>
                        </div>
                        <div className="sm:w-2/5">
                            <div className="flex items-center justify-between">
                                <div>Subtotal</div>
                                <div>DH{totals.subtotal}</div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div>Tax(%)</div>
                                <div>DH{totals.taxAmount}</div> {/* Display tax amount */}
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div>Transport(DH)</div>
                                <div>DH{totals.transportPrice}</div> {/* Assuming static transport for now */}
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div>Promotion(%)</div>
                                <div>DH{totals.promotionAmount}</div> {/* Display promotion amount */}
                            </div>
                            <div className="flex items-center justify-between mt-4 font-semibold">
                                <div>Total</div>
                                <div>DH{totals.total}</div> {/* Display final total */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 px-4">
                    <label htmlFor="notes">Commentaire</label>
                    <textarea id="notes" name="notes" className="form-textarea min-h-[130px]" placeholder="Noté ici...."></textarea>
                </div>
            </div>
            <div className="xl:w-80 w-full xl:mt-0 mt-6">
                <div className="bg-white p-5 shadow dark:bg-black px-4 flex-1 py-6 mb-5">
                    <FormControl fullWidth>
                        <Select
                            labelId="type-label"
                            id="type"
                            name="type"
                            value={typeFacturation}
                            onChange={handleTypeChange}
                            className="form-select"
                        >
                            <MenuItem value="" disabled defaultChecked>Type Facturation</MenuItem>

                            <MenuItem value="customer">Client</MenuItem>
                            <MenuItem value="fournisseur">Fournisseur</MenuItem>
                        </Select>
                    </FormControl>
                    <div className="mt-4">
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="discount">Promotion(%)</label>
                                <input
                                    id="discount"
                                    type="number"
                                    name="discount"
                                    className="form-input"
                                    value={promotion}
                                    onChange={handlePromotionChange} // Update promotion on input change
                                    placeholder="Promotion"
                                />
                            </div>
                            <div>
                                <label htmlFor="transport">Transport Price(DH)</label>
                                <input
                                    id="transport"
                                    type="number"
                                    name="transport"
                                    className="form-input"
                                    value={transportPrice}
                                    onChange={handleTransportChange} // Update transport on input change
                                    placeholder="Transport Price"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="payment-method">Status Facturation</label>
                        <select
                            id="payment-method"
                            name="payment-method"
                            className="form-select"
                            value={status} // Set the selected value
                            onChange={handleStatusChange} // Capture the selected value
                        >
                            <option value="pending">En cours</option>
                            <option value="paid">Payée</option>
                            <option value="credit">Credit</option>
                            <option value="cancel">Eliminer</option>
                        </select>
                    </div>

                </div>
                <div className="panel">
                    <div className="grid xl:grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
                        {/* Conditionally render the button for "fournisseur" */}
                        {/* Conditionally render the button for "fournisseur" */}
                        {typeFacturation === 'fournisseur' && (
                            <button color="primary" onClick={handleOpenModal}>
                                + Add Product
                            </button>
                        )}


                        <button type="button" onClick={handleSubmit} className="btn btn-success w-full gap-2">
                            {/* <IconSave className="ltr:mr-2 rtl:ml-2 shrink-0" /> */}
                            Enregistre
                        </button>

                        <Link href="/apps/invoice/preview" className="btn btn-primary w-full gap-2">
                            {/* <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" /> */}
                            Voir
                        </Link>

                        <button type="button" className="btn btn-secondary w-full gap-2">
                            {/* <IconDownload className="ltr:mr-2 rtl:ml-2 shrink-0" /> */}
                            Telecharger
                        </button>
                    </div>
                </div>
            </div>
            {/* Modal for adding product */}
            <AddProduct open={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default AddInvoice;
