import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Select from 'react-select';
import axios from 'axios';
import MaskedInput from 'react-text-mask';



// Define props interface
interface AddProductProps {
    open: boolean;
    handleClose: () => void;
}

interface ColorType {
    _id: string;
    refColor: string; // The hex code for the color
    colorName: string;
}

// Define Color interface
interface Color {
    value: string;
    label: JSX.Element; // Adjust based on your actual data structure
    refColor: string;   // or whatever type refColor should be
}

// Define Category interface
interface Category {
    value: string;
    label: string;      // Adjust based on your actual data structure
}

// Define Selected Color interface
interface SelectedColor {
    value: Color | null; // Allow null since initially there might not be a selection
    label: string;
    salePrice: string;
    purchasePrice: string;
    quantity: string;
    sku: string;
    category: Category | null; // Category can also be null initially
}

const AddProduct: React.FC<AddProductProps> = ({ open, handleClose }) => {

    const [productName, setProductName] = useState<string>('');
    const [colorOptions, setColorOptions] = useState<Color[]>([]);
    const [selectedColors, setSelectedColors] = useState<SelectedColor[]>([
        { value: null, label: '', salePrice: '', purchasePrice: '', quantity: '', sku: '', category: null }
    ]);
    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

    // Fetch unique colors
    const fetchUniqueColors = async () => {
        try {
            const response = await axios.get('https://backendalaahd.onrender.com/api/colors');
            const colors = response.data;

            const uniqueColorsMap = new Map<string, string>();

            // Specify the type of color in the forEach parameter
            colors.forEach((color: ColorType) => {
                if (color.colorName !== 'NONE' && !uniqueColorsMap.has(color.colorName)) {
                    uniqueColorsMap.set(color.colorName, color.refColor);
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
        if (open) {
            fetchUniqueColors();
            fetchCategories();
        }
    }, [open]);

    const generateSKU = (colorName: string) => {
        const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
        return `${colorName?.substring(0, 2).toUpperCase()}${randomNumber}`; // Example: FB2031
    };

    const addColorRow = () => {
        if (selectedColors.length < 10) {
            setSelectedColors([...selectedColors, { value: null, label: '', salePrice: '', purchasePrice: '', quantity: '', sku: '', category: null }]);
        }
    };

    const handleColorChange = (selectedOption: Color | null, index: number) => {
        const newSelectedColors = [...selectedColors];
        newSelectedColors[index].value = selectedOption; // Store the selected option object
        const colorName = selectedOption?.value || ''; // Get the color name
        newSelectedColors[index].sku = generateSKU(colorName); // Generate SKU
        setSelectedColors(newSelectedColors);
    };    

    const handleInputChange = (index: number, field: keyof SelectedColor, value: string) => {
        const newSelectedColors = [...selectedColors];
        newSelectedColors[index][field] = value;
        setSelectedColors(newSelectedColors);
    };

    const handleCategoryChange = (selectedOption: Category | null, index: number) => {
        const newSelectedColors = [...selectedColors];
        newSelectedColors[index].category = selectedOption;
        setSelectedColors(newSelectedColors);
    };

    const handleDeleteColorRow = (index: number) => {
        const newSelectedColors = selectedColors.filter((_, i) => i !== index);
        setSelectedColors(newSelectedColors);
    };

    const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ productName, selectedColors });
        handleClose(); // Call handleClose to close the modal after adding the product
    };

    const calculateMargin = (salePrice: string, purchasePrice: string): string => {
        const sale = parseFloat(salePrice.replace(' DH', '').replace(',', '.')) || 0;
        const purchase = parseFloat(purchasePrice.replace(' DH', '').replace(',', '.')) || 0;
        if (purchase === 0) return '0%';
        return `${((sale - purchase) / purchase * 100).toFixed(2)}%`;
    };

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" open={open} onClose={handleClose}>
                <Transition.Child as={Fragment}>
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4">
                        <Transition.Child as={Fragment}>
                            <Dialog.Panel className="panel w-full max-w-3xl rounded-lg bg-white p-6 dark:bg-gray-800">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">Add Product</h3>
                                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
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
                                                onChange={(selectedOption) => handleCategoryChange(selectedOption, 0)} // Add handling for category change
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
                                        <table className="min-w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 p-2 text-left">Color</th>
                                                    <th className="border border-gray-300 p-2 text-left">Sale Price (DH)</th>
                                                    <th className="border border-gray-300 p-2 text-left">Purchase Price (DH)</th>
                                                    <th className="border border-gray-300 p-2 text-left">Quantity</th>
                                                    <th className="border border-gray-300 p-2 text-left">Margin</th>
                                                    <th className="border border-gray-300 p-2 text-left">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedColors.map((color, index) => (
                                                    <tr key={index}>
                                                        <td className="border border-gray-300 p-2">
                                                            <Select
                                                                options={colorOptions}
                                                                placeholder="Select Color"
                                                                onChange={(selectedOption) => handleColorChange(selectedOption, index)}
                                                                className="z-50"
                                                                menuPortalTarget={document.body}
                                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 p-2">
                                                            <MaskedInput
                                                                mask={[/\d/, /\d/, /\d/, /\d/, ' ', 'D', 'H']}
                                                                className="form-input mt-1 block w-full"
                                                                placeholder="Enter Sale Price"
                                                                value={color.salePrice}
                                                                onChange={(e) => handleInputChange(index, 'salePrice', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 p-2">
                                                            <MaskedInput
                                                                mask={[/\d/, /\d/, /\d/, /\d/, ' ', 'D', 'H']}
                                                                className="form-input mt-1 block w-full"
                                                                placeholder="Enter Purchase Price"
                                                                value={color.purchasePrice}
                                                                onChange={(e) => handleInputChange(index, 'purchasePrice', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 p-2">
                                                            <MaskedInput
                                                                mask={[/\d/, /\d/, /\d/, /\d/]}
                                                                className="form-input mt-1 block w-full"
                                                                placeholder="Enter Quantity"
                                                                value={color.quantity}
                                                                onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 p-2">
                                                            {calculateMargin(color.salePrice, color.purchasePrice)}
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <button type="button" onClick={() => handleDeleteColorRow(index)} className="text-red-600 hover:text-red-800">
                                                                Supprimer
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <button type="button" onClick={addColorRow} className="text-blue-600 hover:text-blue-800">
                                             Add Color
                                        </button>
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
    );
};

export default AddProduct;
