"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FormControl, TextField, InputLabel, Select, MenuItem } from '@mui/material'; // Import FormControl and other components here
import axios from "axios";
import ButtonUploadXlsx from "../Buttons/ButtonUploadXlsx";

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

const AddProduct: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        images: [],
        price: "",
        cmp_price: "",
        tax_status: false,
        tax: "0",
        cost: "",
        profit: "",
        margin: "",
        colors: [],
        weight: "",
        units_type: "",
        depth: "",
        currency: "",
        height: "",
        sku: [],
        width: "",
        categoryId: "",
        active: false,
    });

    const [selectedCurrency, setSelectedCurrency] = useState<string>("MAD");
    const [selectedDimension, setSelectedDimension] = useState<string>("cm");
    const [showTaxField, setShowTaxField] = useState<boolean>(false);
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

    const handleSkuSelect = (selectedSku: string[]) => {
        setFormData((prevState) => ({
            ...prevState,
            sku: selectedSku,
            barcode: selectedSku.join(","), // Assuming barcode is derived from SKUs
        }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryId = e.target.value;
        setFormData((prevState) => ({
            ...prevState,
            categoryId: selectedCategoryId,
        }));
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
                    "http://localhost:8080/category/getAll"
                );
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formErrors = validateForm(formData);
        if (Object.keys(formErrors).length === 0) {
            try {
                // Handle API requests here...
                setShowSuccess(true);
            } catch (error) {
                console.error("Error creating product:", error);
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
                    <FormControl fullWidth style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                        <TextField
                            placeholder="Titre de produit"
                            value={formData.title}
                            style={{ display: 'flex', alignSelf: 'center' }}
                            className='dark:text-white'
                        />
                    </FormControl>
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
