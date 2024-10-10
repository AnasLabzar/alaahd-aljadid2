import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconX from '../../../components/Icon/IconX';
import IconDownload from '../../../components/Icon/IconDownload';
import IconEye from '../../../components/Icon/IconEye';
import IconSend from '../../../components/Icon/IconSend';
import IconSave from '../../../components/Icon/IconSave';
import IconTrash from '../../../components/Icon/IconTrash';
import CustomerSelect from '../../Components/CustomerSelect';
import axios from 'axios';
import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import IconPlus from '../../../components/Icon/IconPlus';
import AddProduct from '../../Components/ModalAddProduct';

interface ProductType {
    _id: string;
    title: string;
    colorsId: string[];
    priceId: string[];
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

const Add = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Invoice Add'));
    }, [dispatch]);

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
            searchTerm: '' // Initialize search term
        },
    ]);

    const [products, setProducts] = useState<ProductType[]>([]);
    const [colors, setColors] = useState<ColorType[]>([]);
    const [invoiceRef, setInvoiceRef] = useState<string>('');
    const [customerId, setCustomerId] = useState<string>(''); // Assuming you have customerId from context or state
    const [typeFacturation, setTypeFacturation] = useState('customer');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchColors = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/colors');
                setColors(response.data);
            } catch (error) {
                console.error("Error fetching Colors:", error);
            }
        };

        fetchProducts();
        fetchColors();
        setInvoiceRef(generateInvoiceRef());
    }, []);

    const handleProductChange = (event: SelectChangeEvent<string>, itemId: number) => {
        const selectedProductId = event.target.value as string;
        const selectedProduct = products.find(product => product._id === selectedProductId);

        if (selectedProduct) {
            const productColors = selectedProduct.colorsId.map(colorId => {
                const color = colors.find(color => color._id === colorId);
                return color ? { _id: color._id, refColor: color.refColor, colorName: color.colorName } : null;
            }).filter(Boolean) as ColorType[];

            const refColor = productColors.length > 0 ? productColors[0].refColor : '';
            const productPriceId = selectedProduct.priceId;

            fetchProductPrice(productPriceId).then(price => {
                setItems(prevItems =>
                    prevItems.map(item =>
                        item._id === itemId
                            ? {
                                ...item,
                                productId: selectedProductId,
                                title: selectedProduct.title,
                                Refcolor: refColor,
                                colors: productColors,
                                price: price
                            }
                            : item
                    )
                );
            });
        }
    };

    const fetchProductPrice = async (productPriceId: string): Promise<number> => {
        try {
            const response = await fetch(`http://localhost:3000/api/prices/${productPriceId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch price details');
            }
            const productData = await response.json();
            return productData.price; // Return the price
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
                searchTerm: '' // Initialize search term for new item
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

    const handleAddProduct = () => {
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

    const calculateTotal = () => {
        const subtotal = items.reduce((total, item) => total + item.quantity * item.price, 0);
        return subtotal.toFixed(2);
    };

    return (
        <div className="flex xl:flex-row flex-col gap-2.5">
            <div className="panel px-0 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                <div className="flex justify-between flex-wrap px-4">
                    <div className="mb-6 lg:w-1/2 w-full">
                        <div className="flex items-center text-black dark:text-white shrink-0">
                            <img src="/assets/images/logo.svg" alt="img" className="w-14" />
                        </div>
                        <div className="space-y-1 mt-6 text-gray-500 dark:text-gray-400">
                            <div>13 Tetrick Road, Cypress Gardens, Florida, 33884, US</div>
                            <div>vristo@gmail.com</div>
                            <div>+1 (070) 123-4567</div>
                        </div>
                        <div className="space-y-1 mt-4 text-black font-bold">
                            <div>Agent de facturation:</div>
                            <div className='font-normal'>M. <span>Admin here</span></div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full lg:max-w-fit">
                        <div className="flex items-center mt-4">
                            <label htmlFor="invoiceRef" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">
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
                        <div className="flex items-center mt-4">
                            <label htmlFor="customerSelect" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">
                                Nom de client
                            </label>
                            {/* Replace input with the CustomerSelect component */}
                            <CustomerSelect
                                id="customerSelect"
                                onChange={(selectedCustomer) => setCustomerId(selectedCustomer)}  // setCustomerId should be a state or a function to handle customer selection
                                className="lg:w-[250px] w-2/3"
                            />
                        </div>

                        <div className="flex items-center mt-4">
                            <label htmlFor="startDate" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">
                                Date de creation
                            </label>
                            <input id="startDate" type="date" name="inv-date" className="form-input lg:w-[250px] w-2/3" />
                        </div>
                        <div className="flex items-center mt-4">
                            <label htmlFor="dueDate" className="flex-1 ltr:mr-2 rtl:ml-2 mb-0">
                                Date de fin
                            </label>
                            <input id="dueDate" type="date" name="due-date" className="form-input lg:w-[250px] w-2/3" />
                        </div>
                    </div>
                </div>
                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                <div className="mt-8">
                    <div className="table-responsive">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 text-left">ID</th>
                                    <th className="p-2 text-left">Order</th>
                                    <th className="w-1 p-2 text-left">Prix</th>
                                    <th className="w-1 p-2 text-left">Quantité</th>
                                    <th className="p-2 text-left">Totale</th>
                                    <th className="w-1 p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <FormControl fullWidth style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                                <TextField
                                                    variant="outlined"
                                                    placeholder="Rechercher produit"
                                                    value={item.searchTerm}
                                                    onChange={handleSearchChange(item._id)}
                                                    style={{ marginBottom: '8px' }}
                                                />

                                                <Select
                                                    value={item.productId}
                                                    onChange={(event) => handleProductChange(event, item._id)}
                                                    style={{ marginBottom: '8px' }}
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

                                                {typeFacturation === 'fournisseur' && (
                                                    <AddProduct open={showModal} handleClose={handleCloseModal} />
                                                )}
                                            </FormControl>
                                        </td>


                                        <td>
                                            <TextField
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => changeQuantityPrice('price', Number(e.target.value), item._id)}
                                                className="w-24"
                                            />
                                        </td>
                                        <td>
                                            <TextField
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => changeQuantityPrice('quantity', Number(e.target.value), item._id)}
                                                className="w-24"
                                            />
                                        </td>
                                        <td>{(item.price * item.quantity).toFixed(2)} $</td>
                                        <td>
                                            <button onClick={() => removeItem(item._id)} className="text-red-600"><IconTrash /></button>
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
                                <div>${calculateTotal()}</div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div>Tax(%)</div>
                                <div>0%</div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div>Transport(DH)</div>
                                <div>$0.00</div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div>Promotion(%)</div>
                                <div>0%</div>
                            </div>
                            <div className="flex items-center justify-between mt-4 font-semibold">
                                <div>Totale</div>
                                <div>$0.00</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 px-4">
                    <label htmlFor="notes">Commentaire</label>
                    <textarea id="notes" name="notes" className="form-textarea min-h-[130px]" placeholder="Noté ici...."></textarea>
                </div>
            </div>
            <div className="xl:w-96 w-full xl:mt-0 mt-6">
                <div className="panel mb-5">
                    <FormControl fullWidth>
                        <InputLabel id="type-label">Type Facturation</InputLabel>
                        <Select
                            labelId="type-label"
                            id="type"
                            name="type"
                            value={typeFacturation}
                            onChange={handleTypeChange}
                            className="form-select"
                        >
                            <MenuItem value="customer">Client</MenuItem>
                            <MenuItem value="fournisseur">Fournisseur</MenuItem>
                        </Select>
                    </FormControl>
                    <div className="mt-4">
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="tax">Tax(%) </label>
                                <input id="tax" type="number" name="tax" className="form-input" defaultValue={0} placeholder="Tax" />
                            </div>
                            <div>
                                <label htmlFor="discount">Promotion(%) </label>
                                <input id="discount" type="number" name="discount" className="form-input" defaultValue={0} placeholder="Promotion" />
                            </div>
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
                        <button type="button" className="btn btn-success w-full gap-2">
                            <IconSave className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Enregistre
                        </button>

                        <Link to="/apps/invoice/preview" className="btn btn-primary w-full gap-2">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Voir
                        </Link>

                        <button type="button" className="btn btn-secondary w-full gap-2">
                            <IconDownload className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Telecharger
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Add;
