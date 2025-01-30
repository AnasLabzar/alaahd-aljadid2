"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
    Grid,
    Paper,
    Stack,
    Button,
    TextField,
    InputAdornment,
    Divider,
    Link,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
} from '@mui/material';
import axios from "axios";
import ButtonUploadXlsx from "../Buttons/ButtonUploadXlsx";
import MediaUploader from "./MediaUploader";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import dynamic from 'next/dynamic';
import CustomizedCheckbox from "./CustomizedCheckbox";
import SkuCodeBar from "./SkuCodeBar";
import ColorPickerButton from "./ColorPickerButton";

interface FormData {
    title: string;
    description: string;
    images: string[]; // Assuming images are an array of URLs or paths
    price: string;
    cmp_price: string;
    tax_status: boolean;
    tax: string;
    cost: string;
    profit: string;
    margin: string;
    colors: { color: string; name: string; stock: number }[]; // Adjust if colors have a different structure
    weight: string;
    units_type: string;
    depth: string;
    currency: string;
    height: string;
    sku: string[];
    width: string;
    categoryId: string;
    active: boolean;
    barcode?: string;
}

interface Category {
    _id: string;
    name: string;
}

const currencies = [
    // Enable this two row for added a nother currency
    // {
    //     value: '$',
    //     label: 'USD',
    // },
    {
        value: '€',
        label: 'EUR',
    },
    {
        value: 'DH',
        label: 'MAD',
    },
];

const units_type = [
    {
        value: 'm',
        label: 'METRE',
    },
    {
        value: 'cm',
        label: 'CENTIME',
    },
    {
        value: 'mm',
        label: 'MELEM',
    },
];

interface SkuCodeBarProps {
    onSkuSelect: (sku: string[]) => void; // Accept an array of SKUs
    onColorsName: string[];
  }
  

const AddProduct: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        images: [],
        price: '',
        cmp_price: '',
        tax_status: false,
        tax: '0',
        cost: '',
        profit: '',
        margin: '',
        colors: [],
        weight: '',
        units_type: '',
        depth: '',
        currency: '',
        height: '',
        sku: [],
        width: '',
        categoryId: '', // Add categoryId to the initial state
        active: false,
    });

    const [selectedCurrency, setSelectedCurrency] = useState<string>("MAD");
    const [selectedDimension, setSelectedDimension] = useState<string>("cm");
    const [showTaxField, setShowTaxField] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [colorId, setColorId] = useState<string[]>([]);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const handleColorsSelect = (selectedColors: FormData["colors"]) => {
        setFormData((prevState) => ({
            ...prevState,
            colors: selectedColors,
        }));
    };

    const handleImagesSelect = (images: string[]) => {
        setFormData((prevState) => ({
            ...prevState,
            images,
        }));
    };

    const handleSkuSelect = (SKU: string) => {
        setFormData((prevState) => ({
            ...prevState,
            sku: [SKU], // Wrap the string in an array
            barcode: SKU, // Assuming barcode is derived from a single SKU
        }));
    };
    

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryId = e.target.value;
        setFormData((prevState) => ({
            ...prevState,
            categoryId: selectedCategoryId,
        }));
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currency = e.target.value;
        setFormData((prevState) => ({
            ...prevState,
            currency,
        }));
        setSelectedCurrency(currency);
    };

    const handleDimensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const unitsType = e.target.value;
        setFormData((prevState) => ({
            ...prevState,
            units_type: unitsType,
        }));
        setSelectedDimension(unitsType);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    const validateForm = (data: FormData): Partial<FormData> => {
        const errors: Partial<FormData> = {};

        if (!data.title.trim()) {
            errors.title = "Title is required";
        }

        if (!data.price.trim()) {
            errors.price = "Price is required";
        } else if (isNaN(Number(data.price))) {
            errors.price = "Price must be a number";
        }

        if (!data.tax.trim()) {
            errors.tax = "Tax is required. You can turn off the tax using the checkbox.";
        }

        // if (!data.colors.length) {
        //     errors.colors = "At least one color is required";
        // }

        // if (!data.sku.length) {
        //     errors.sku = "SKU is required or can be generated.";
        // }

        if (!data.height.trim()) {
            errors.height = "Height is required";
        }

        if (!data.categoryId.trim()) {
            errors.categoryId = "Category of the product is required";
        }

        return errors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };

        if (name === "cost") {
            if (formData.price && parseFloat(formData.price) !== 0) {
                const price = parseFloat(formData.price);
                const cost = parseFloat(value);
                const profit = price - cost;
                const margin = (profit / price) * 100;
                updatedFormData = {
                    ...updatedFormData,
                    profit: profit.toFixed(2),
                    margin: margin.toFixed(2),
                };
            }
        } else if (name === "price") {
            if (formData.cost && parseFloat(formData.cost) !== 0) {
                const price = parseFloat(value);
                const cost = parseFloat(formData.cost);
                const profit = price - cost;
                const margin = (profit / price) * 100;
                updatedFormData = {
                    ...updatedFormData,
                    profit: profit.toFixed(2),
                    margin: margin.toFixed(2),
                };
            }
        }

        setFormData(updatedFormData);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get<Category[]>(
                    "https://backendalaahd.onrender.com/api/category/getAll"
                );
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formErrors = validateForm(formData);
        if (Object.keys(formErrors).length === 0) {
            try {
                // Step 1: Create the new price
                const priceData = {
                    currency: formData.currency,
                    price: formData.price,
                    cmp_price: formData.cmp_price,
                    tax: formData.tax,
                    cost_per_item: formData.cost,
                    profit: formData.profit,
                    margin: formData.margin
                };
                const priceResponse = await axios.post('https://backendalaahd.onrender.com/api/price/add-new', priceData);
                const priceId = priceResponse.data._id;

                // Step 2: Create the new colors
                const colorsIds = await Promise.all(
                    formData.colors.map(async (colorObj) => {
                        try {
                            const colorData = {
                                refColor: colorObj.color,
                                name: colorObj.name,
                                stock_color: colorObj.stock
                            };
                            const colorResponse = await axios.post('https://backendalaahd.onrender.com/api/color/add-new', colorData);
                            console.log('Color successfully added:', colorResponse.data);

                            const colorsData = colorResponse.data._id;
                            return colorsData;
                        } catch (error) {
                            console.error('Error creating color:', error);
                            return null;
                        }
                    })
                );

                // Step 3: Create the new SKU
                const skuData = {
                    sku: formData.sku,
                    barcode: formData.barcode,
                };
                const skuResponse = await axios.post('https://backendalaahd.onrender.com/api/sku/add-new', skuData);
                const skuId = skuResponse.data._id;

                // Step 4: Create the new product with the price ID, color IDs, and SKU ID
                const productData = {
                    title: formData.title,
                    description: formData.description,
                    images: formData.images,
                    weight: formData.weight,
                    units_type: formData.units_type,
                    depth: formData.depth,
                    height: formData.height,
                    width: formData.width,
                    active: formData.active,
                    priceId: priceId,
                    colorsId: colorsIds.filter((id) => id !== null), // Remove null values
                    skuId: skuId,
                    categoryId: formData.categoryId
                };
                const productResponse = await axios.post('https://backendalaahd.onrender.com/api/product/add-new', productData);
                const productId = productResponse.data._id;
                console.log("This is Product ID:", productId);

                setShowSuccess(true);

            } catch (error) {
                console.error('Error creating product, price, and color:', error);
                setShowError(true);
            }
        } else {
            setErrors(formErrors);
        }
    };

    const handleUpload = () => {
        // Handle the uploaded product data here
        console.log('Uploaded products:');
        // Update your state or perform any necessary actions with the uploaded products data
    };

    const calculateCostPerItem = () => {
        const profit = parseFloat(formData.profit);
        const margin = parseFloat(formData.margin);

        // Validate inputs
        if (!isNaN(profit) && !isNaN(margin) && margin !== -100) {
            const calculatedCost = (profit / (1 + margin / 100)).toFixed(2);
            setFormData((prevData) => ({
                ...prevData,
                cost: calculatedCost,
            }));
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
                    </div>
                </div>
                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                <div className="mt-8 px-[14px]">
                    <Stack spacing={2}>
                        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                            <TextField
                                name="title"
                                label="Title *"
                                value={formData.title}
                                onChange={handleChange}
                                error={!!errors.title}
                                helperText={errors.title}
                                fullWidth
                            />

                            <Typography variant="h6" mt={3} sx={{ position: 'relative', top: '.5em' }} gutterBottom>
                                Description
                            </Typography>
                            <ReactQuill
                                name="description"
                                label="Description"
                                theme="snow"
                                value={formData.description}
                                onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, description: value }))}
                                fullWidth
                                style={{ marginTop: '20px' }}
                            />
                        </Paper>
                        <MediaUploader onImagesSelect={handleImagesSelect} />
                        <Paper style={{ padding: '15px 20px 20px 20px' }}>
                            <Typography variant="subtitle1" gutterBottom mb={3}>
                                Prices
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={3}>
                                    <TextField
                                        id="outlined-select-currency"
                                        name="currency"
                                        select
                                        label="Select currency"
                                        value={selectedCurrency}
                                        onChange={handleCurrencyChange}
                                        defaultValue={currencies.find(currency => currency.value === 'DH')?.value || ''}
                                        helperText="Please select currency"
                                    >
                                        {currencies.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label} ({option.value})
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        name='price'
                                        label='Price *'
                                        value={formData.price}
                                        placeholder='0.00'
                                        onChange={handleChange}
                                        error={!!errors.price}
                                        helperText={errors.price}
                                        fullWidth
                                        type="number"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {selectedCurrency}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={5}>
                                    <TextField
                                        name='cmp_price'
                                        label="Compare-at price"
                                        placeholder='0.00'
                                        // value={formData[field]}
                                        onChange={handleChange}
                                        fullWidth
                                        type="number"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {selectedCurrency}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Divider sx={{ margin: '2em 0' }} />
                            <Grid container style={{ cursor: 'pointer' }} mt={1} mb={2}>
                                <CustomizedCheckbox checked={showTaxField} name='tax_status' onChange={() => setShowTaxField(!showTaxField)} />
                                <Typography sx={{ fontSize: '13px', display: 'flex', alignItems: 'center', opacity: '.8' }}>
                                    Charge tax on this product
                                </Typography>
                            </Grid>
                            {showTaxField && (
                                <TextField
                                    name="tax"
                                    label="Tax"
                                    value={formData.tax}
                                    onChange={handleChange}
                                    error={!!errors.tax}
                                    helperText={errors.tax}
                                    fullWidth
                                    placeholder='00'
                                    InputProps={{ startAdornment: '%' }}
                                    style={{ marginBottom: '30px' }}
                                />
                            )}
                            <Grid container spacing={3}>
                                <Grid item xs={4}>
                                    <TextField
                                        name="cost"
                                        label="Cost per item"
                                        placeholder="0.00"
                                        value={formData.cost}
                                        onChange={handleChange}
                                        fullWidth
                                        type="number"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">{selectedCurrency}</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        name="profit"
                                        label="Profit"
                                        placeholder="0.00"
                                        value={formData.profit}
                                        onChange={handleChange}
                                        fullWidth
                                        type="number"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">{selectedCurrency}</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        name="margin"
                                        label="Margin"
                                        placeholder="0.00"
                                        value={formData.margin}
                                        onChange={handleChange}
                                        onBlur={calculateCostPerItem}
                                        fullWidth
                                        type="number"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper style={{ padding: '20px' }}>
                            <Typography variant="subtitle1" gutterBottom mb={3}>
                                Inventory
                            </Typography>
                            <Grid container style={{ cursor: 'pointer' }} mt={1} mb={2}>
                                <CustomizedCheckbox checked={isChecked} onChange={handleCheckboxChange} />
                                <Typography sx={{ fontSize: '13px', display: 'flex', alignItems: 'center', opacity: '.8' }}>
                                    Track quantity
                                </Typography>
                            </Grid>
                            <Grid container mt={3}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Quantity
                                </Typography>
                                <Link to="/" style={{ cursor: 'pointer', display: 'flex', alignItems: 'right' }}>
                                    <Typography gutterBottom>
                                        Edit type of quantity
                                    </Typography>
                                </Link>
                            </Grid>
                            <Divider variant="fullWidth" />
                                <Typography variant="subtitle1" gutterBottom>
                                    Add colors
                                </Typography>
                                <ColorPickerButton colorName="Custom Color" error={!!errors.color} helperText={errors.color} onChange={handleColorsSelect} onColorsSelect={handleColorsSelect} />

                                <Typography variant="subtitle1" gutterBottom>
                                    Stock Keeping Unit
                                </Typography>
                                <SkuCodeBar onSkuSelect={handleSkuSelect} error={!!errors.sku} helperText={errors.sku} onColorsName={formData.colors.map(color => color.name)} />
                        </Paper>

                        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                            <Typography variant="subtitle1" gutterBottom mb={3}>
                                Shipping
                            </Typography>
                            <Grid container style={{ cursor: 'pointer' }} mt={1} mb={2}>
                                <CustomizedCheckbox checked={isChecked} onChange={handleCheckboxChange} />
                                <Typography sx={{ fontSize: '13px', display: 'flex', alignItems: 'center', opacity: '.8' }}>
                                    This is a physical product
                                </Typography>
                            </Grid>
                            <TextField
                                placeholder="0.00"
                                id="outlined-start-adornment"
                                label="Weight"
                                name="weight"
                                type="number"
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: 'kg'
                                }}
                            />
                            <Divider sx={{ margin: '2em 0' }} />
                            <Grid container spacing={4}>
                                <Grid item xs={3}>
                                    <TextField
                                        id="outlined-select-dimension"
                                        select="mm"
                                        label="Select units Type"
                                        name="units_type"
                                        defaultValue="mm"
                                        onChange={handleDimensionChange}
                                        helperText="Please select units type"
                                    >
                                        {units_type.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label} ({option.value})
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        label="Depth"
                                        name="depth"
                                        placeholder='0.00'
                                        onChange={handleChange}
                                        type="number"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment>
                                                    {selectedDimension}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        placeholder="0.00"
                                        id="outlined-start-adornment"
                                        label="Height"
                                        name="height"
                                        error={!!errors.height} helperText={errors.height}
                                        type="number"
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment>
                                                    {selectedDimension}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        placeholder="0.00"
                                        id="outlined-start-adornment"
                                        label="Width"
                                        name="width"
                                        type="number"
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment>
                                                    {selectedDimension}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Stack direction="row" spacing={2}>
                            {/* <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                                Back
                            </Button> */}
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                color="primary"
                            >
                                Create product
                            </Button>
                        </Stack>
                    </Stack>
                </div>
            </div>
            <div className="xl:w-80 w-full xl:mt-0 mt-6">
                <div className="bg-white p-5 shadow dark:bg-black px-4 flex-1 py-6 mb-5">
                    <label className="font-bold">Téléchargez vos données</label>
                    <p className="color-grey text-[12.6px] opacity-.8 mb-3"><span className="text-red">*</span> Type de fichier (xlsx / xls)</p>
                    <ButtonUploadXlsx onUpload={handleUpload} />
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
