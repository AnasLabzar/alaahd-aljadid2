import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconX from '../../components/Icon/IconX';
import IconPlus from '../../components/Icon/IconPlus';
import IconTrash from '../../components/Icon/IconTrash';
import Select from 'react-select';
import axios from 'axios';
import MaskedInput from 'react-text-mask';

const AddProduct: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Add Product'));
    }, [dispatch]);

    const [modalOpen, setModalOpen] = useState(false);
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [colorOptions, setColorOptions] = useState([]);
    const [selectedColors, setSelectedColors] = useState([{ value: null, label: '', salePrice: '', purchasePrice: '', quantity: '', sku: '', category: '' }]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const closeModal = () => setModalOpen(false);

    // Fetch unique colors
    const fetchUniqueColors = async () => {
        try {
            const response = await axios.get('https://backendalaahd.onrender.com/api/colors');
            const colors = response.data;
            const uniqueColorsMap = new Map();

            colors.forEach(color => {
                if (color.name !== 'NONE' && !uniqueColorsMap.has(color.name)) {
                    uniqueColorsMap.set(color.name, color.refColor);
                }
            });

            const formattedColors = Array.from(uniqueColorsMap.entries()).map(([name, refColor]) => ({
                value: name,
                label: (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: refColor,
                                marginRight: '8px'
                            }}
                        />
                        {name}
                    </div>
                ),
                refColor
            }));

            setColorOptions(formattedColors);
        } catch (error) {
            console.error('Error fetching colors:', error);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://backendalaahd.onrender.com/api/categories');
            const categories = response.data.map(category => ({
                value: category._id,
                label: category.title,
            }));
            setCategoryOptions(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        if (modalOpen) {
            fetchUniqueColors();
            fetchCategories();
        }
    }, [modalOpen]);

    // Generate a SKU for the product based on the selected color
    const generateSKU = (colorName) => {
        const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
        return `${colorName?.substring(0, 2).toUpperCase()}${randomNumber}`; // Example: FB2031
    };

    const addColorRow = () => {
        if (selectedColors.length < 10) {
            setSelectedColors([...selectedColors, { value: null, label: '', salePrice: '', purchasePrice: '', quantity: '', sku: '', category: '' }]);
        }
    };

    const handleColorChange = (selectedOption, index) => {
        const newSelectedColors = [...selectedColors];
        newSelectedColors[index].value = selectedOption; // Store the selected option
        const colorName = selectedOption?.value || ''; // Get the color name from the selected option
        newSelectedColors[index].sku = generateSKU(colorName); // Generate the SKU using the color name
        setSelectedColors(newSelectedColors);
    };

    const handleInputChange = (index, field, value) => {
        const newSelectedColors = [...selectedColors];
        newSelectedColors[index][field] = value;
        setSelectedColors(newSelectedColors);
    };

    const handleCategoryChange = (selectedOption, index) => {
        const newSelectedColors = [...selectedColors];
        newSelectedColors[index].category = selectedOption;
        setSelectedColors(newSelectedColors);
    };

    const handleDeleteColorRow = (index) => {
        const newSelectedColors = selectedColors.filter((_, i) => i !== index);
        setSelectedColors(newSelectedColors);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        console.log({ productName, description, selectedColors });
        closeModal();
    };

    const calculateMargin = (salePrice, purchasePrice) => {
        const sale = parseFloat(salePrice.replace(' DH', '').replace(',', '.')) || 0;
        const purchase = parseFloat(purchasePrice.replace(' DH', '').replace(',', '.')) || 0;
        if (purchase === 0) return 0;
        return ((sale - purchase) / purchase * 100).toFixed(2);
    };

    return (
        <div>
            <button type="button" onClick={() => setModalOpen(true)} className="btn btn-rounded btn-primary">
                <IconPlus />
            </button>
            <Transition appear show={modalOpen} as={Fragment}>
                <Dialog as="div" open={modalOpen} onClose={closeModal}>
                    <Transition.Child as={Fragment}>
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-screen items-center justify-center px-4">
                            <Transition.Child as={Fragment}>
                                <Dialog.Panel className="panel w-full max-w-3xl rounded-lg bg-white p-6 dark:bg-gray-800">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">Add Product</h3>
                                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                            <IconX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <form onSubmit={handleAddProduct}>
                                        <div className="flex flex-row gap-4 mb-4">
                                            <div className="mb-4 flex-1">
                                                <label className="block text-sm font-medium">Product Name</label>
                                                <input
                                                    type="text"
                                                    className="form-input mt-1 block w-full"
                                                    placeholder="Enter product name"
                                                    required
                                                    value={productName}
                                                    onChange={(e) => setProductName(e.target.value)}
                                                />
                                            </div>

                                            <div className="mb-4 flex-1">
                                                <label className="block text-sm font-medium">Category</label>
                                                <Select
                                                    options={categoryOptions}
                                                    placeholder="Select Category"
                                                    className="z-50"
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />
                                            </div>

                                            <div className="mb-4 flex-1">
                                                <label className="block text-sm font-medium">SKU</label>
                                                <input
                                                    type="text"
                                                    className="form-input mt-1 block w-full"
                                                    value={selectedColors[0]?.sku || ''} // Assuming SKU is generated based on the first selected color
                                                    placeholder='En attend votre selection'
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <hr className="border-white-light dark:border-[#1b2e4b] my-6" />

                                        {/* Responsive Table Layout */}
                                        <div className="overflow-auto">
                                            <label className="block text-sm font-medium">Product Details</label>
                                            <table className="min-w-full table-auto">
                                                <thead>
                                                    <tr className="text-left">
                                                        <th className="py-1" style={{ width: '21%' }}>Color</th>
                                                        <th className="py-1" style={{ width: '20%' }}>Prix de vente</th>
                                                        <th className="py-1" style={{ width: '20%' }}>Prix d'achat</th>
                                                        <th className="py-1" style={{ width: '14%' }}>Quantité</th>
                                                        <th className="py-1" style={{ width: '16%' }}>Margin %</th>
                                                        <th className="py-1" style={{ width: '4%' }}>Supprimer</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedColors.map((color, index) => (
                                                        <tr key={index} className="border-b">
                                                            {/* Color Selection */}
                                                            <td className="p-1">
                                                                <Select
                                                                    options={colorOptions}
                                                                    value={color.value}
                                                                    onChange={(selectedOption) => handleColorChange(selectedOption, index)}
                                                                    placeholder="Couleur"
                                                                    className="z-50"
                                                                    menuPortalTarget={document.body}
                                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                />
                                                            </td>

                                                            {/* Sale Price */}
                                                            <td className="p-1">
                                                                <MaskedInput
                                                                    className="form-input"
                                                                    mask={[/\d/, /\d/, /\d/, ',', /\d/, /\d/, ' ', 'D', 'H']}
                                                                    placeholder="000,00 DH"
                                                                    value={color.salePrice}
                                                                    onChange={(e) => handleInputChange(index, 'salePrice', e.target.value)}
                                                                />
                                                            </td>

                                                            {/* Purchase Price */}
                                                            <td className="p-1">
                                                                <MaskedInput
                                                                    className="form-input"
                                                                    mask={[/\d/, /\d/, /\d/, ',', /\d/, /\d/, ' ', 'D', 'H']}
                                                                    placeholder="000,00 DH"
                                                                    value={color.purchasePrice}
                                                                    onChange={(e) => handleInputChange(index, 'purchasePrice', e.target.value)}
                                                                />
                                                            </td>

                                                            {/* Quantity */}
                                                            <td className="p-1">
                                                                <input
                                                                    type="number"
                                                                    className="form-input"
                                                                    placeholder="Quantité"
                                                                    value={color.quantity}
                                                                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                                                />
                                                            </td>

                                                            {/* Margin */}
                                                            <td className="p-1">
                                                                <input
                                                                    type="text"
                                                                    className="form-input"
                                                                    placeholder="0%"
                                                                    value={calculateMargin(color.salePrice, color.purchasePrice)}
                                                                    disabled
                                                                />
                                                            </td>

                                                            {/* Delete Row */}
                                                            <td className="p-1 text-center">
                                                                <button type="button" onClick={() => handleDeleteColorRow(index)}>
                                                                    <IconTrash />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-4 float-end">
                                            <button
                                                type="button"
                                                className={`btn btn-outline-primary ${selectedColors.length === 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={addColorRow}
                                                disabled={selectedColors.length === 10}
                                            >
                                                Ajouter autre
                                                <IconPlus />
                                            </button>
                                        </div>

                                        <div className="mt-16">
                                            <button type="submit" className="btn btn-primary">
                                                Add Product
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default AddProduct;
