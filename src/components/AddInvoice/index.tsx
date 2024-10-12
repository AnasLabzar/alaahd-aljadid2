"use client"; // Add this line to indicate that this is a Client Component

// pages/add-invoice.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SelectChangeEvent } from '@mui/material';
import { ChangeEvent } from 'react';

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



interface ColorType {
    _id: string;
    refColor: string; // The hex code for color
    colorName: string;
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
    colors: ColorType[];
    searchTerm: string; // New field for individual search term
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

                // Add console log to check the priceId
                console.log("Selected Price ID: ", firstProductPriceId);

                fetchProductPrice(firstProductPriceId).then(price => {
                    setItems(prevItems =>
                        prevItems.map(item =>
                            item._id === itemId
                                ? {
                                    ...item,
                                    productId: selectedProductId,
                                    title: selectedProduct.title,
                                    Refcolor: refColor,
                                    colors: productColors,
                                    price: price, // Set the fetched price here
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

    const fetchProductPrice = async (productPriceId: string): Promise<number> => {
        try {
            const response = await fetch(`https://backendalaahd.onrender.com/api/prices/${productPriceId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch price details');
            }

            const productData = await response.json();
            console.log("Full Product Data: ", productData); // Log the entire response

            // Check if 'price' exists in the response and log it
            if (productData.price !== undefined) {
                console.log("Fetched Price: ", productData.price);
                return productData.price;
            } else {
                console.error("Price not found in the response");
                return 0; // Return a default value if price is missing
            }

        } catch (error) {
            console.error('Error fetching product price:', error);
            return 0; // Return a default value in case of error
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
                price: 0,
                productId: '',
                Refcolor: '',
                colors: [],
                searchTerm: '', // Initialize search term for new item
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

    // Calculate subtotal, tax, promotion, transport dynamically
    const calculateTotal = () => {
        const subtotal = items.reduce((total, item) => total + item.quantity * item.price, 0);

        // Apply tax and promotion
        const taxAmount = (tax / 100) * subtotal;
        const promotionAmount = (promotion / 100) * subtotal;

        // Final total with tax, promotion, and transport
        const total = (subtotal + taxAmount - promotionAmount) + transportPrice;

        return {
            subtotal: subtotal.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            promotionAmount: promotionAmount.toFixed(2),
            total: total.toFixed(2),
            transportPrice: transportPrice.toFixed(2),
        };
    };

    const totals = calculateTotal(); // Get all totals (subtotal, tax, promotion, final total)


    return (
        <div className="flex xl:flex-row flex-col gap-2.5">
            <div className="bg-white p-5 shadow dark:bg-black px-4 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                <div className="flex justify-between flex-wrap px-4">
                    <div className="mb-6 lg:w-1/2 w-full">
                        <div className="flex items-center text-black dark:text-white shrink-0">
                            <img src="/images/logo/logo.png" alt="img" className="w-20" />
                        </div>
                        <div className="space-y-1 mt-6 text-gray-500 dark:text-gray-400">
                            <div>El Gouassem, Route de l'ourika, Marrakech-safi</div>
                            <div>alaahd-aljadid@gmail.com</div>
                            <div>+212 689-063963</div>
                        </div>
                        <div className="space-y-1 mt-4 text-black font-bold">
                            <div>Agent de facturation:</div>
                            <div className='font-normal'>M. <span>Mehdi El kouadni</span></div>
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
                            <input id="startDate" type="date" name="inv-date" className="form-input lg:w-[250px] w-2/3" />
                        </div>
                        <div className="flex gap-2 flex-col items-center sm:flex-row mt-4">
                            <label htmlFor="dueDate" className="text-left flex-1 ltr:mr-2 rtl:ml-2 mb-0">
                                Date de fin
                            </label>
                            <input id="dueDate" type="date" name="due-date" className="form-input lg:w-[250px] w-2/3" />
                        </div>
                    </div>
                </div>
                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                <div className="mt-8 px-[14px]">
                    <div className="table-responsive overflow-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 text-left">ID</th>
                                    <th className="p-2 text-left">Order</th>
                                    <th className="p-2 text-left">Prix</th>
                                    <th className="p-2 text-left">Quantité</th>
                                    <th className="p-2 text-left">Totale</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item._id}>
                                        <td className="p-2">{index + 1}</td>
                                        <td className="p-2">
                                            <FormControl fullWidth style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder="Rechercher produit"
                                                    value={item.searchTerm}
                                                    onChange={handleSearchChange(item._id)}
                                                    style={{ display: 'flex', alignSelf: 'center' }}
                                                />

                                                <Select
                                                    value={item.productId}
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
                                                                        <span style={{ marginLeft: '10px', color: '#666' }}>
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
                                                className="w-auto"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <TextField
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => changeQuantityPrice('quantity', Number(e.target.value), item._id)}
                                                className="w-auto"
                                            />
                                        </td>
                                        <td className="p-2">{(item.price * item.quantity).toFixed(2)}</td>
                                        <td className="p-2">
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
                                <label htmlFor="tax">Tax(%)</label>
                                <input
                                    id="tax"
                                    type="number"
                                    name="tax"
                                    className="form-input"
                                    value={tax}
                                    onChange={handleTaxChange} // Update tax on input change
                                    placeholder="Tax"
                                />
                            </div>
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
                    <div className="mt-4">
                        <label htmlFor="payment-method">Status Facturation</label>
                        <select id="payment-method" name="payment-method" className="form-select">
                            <option id='payment-method' value="pending" defaultChecked>En cours</option>
                            <option id='payment-method' value="paid">Payée</option>
                            <option id='payment-method' value="credit">Credit</option>
                            <option id='payment-method' value="cancel">Eliminer</option>
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


                        <button type="button" className="btn btn-success w-full gap-2">
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
