"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddProduct from "../Modal/ModalAddProduct";

// Define the Package type
type Package = {
  title: string;
  priceId: string;
  colorsId: string[0];
  categoryId: string[0];
  invoiceDate: string;
  status: "Paid" | "Unpaid" | "Pending"; // Adjust statuses as needed
};

// Define types for Price and Color
type Price = {
  _id: string;
  currency: string;
  price: string;
  tax: string;
  cost_per_item: string;
  profit: string;
  margin: string;
};

type Color = {
  _id: string;
  refColor: string;
  name: string;
  stock_color: string;
};

type Category = {
  _id: string;
  name: string;
};

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState<Package[]>([]); // State to hold all product data
  const [prices, setPrices] = useState<{ [key: string]: Price }>({});
  const [colors, setColors] = useState<{ [key: string]: Color }>({});
  const [categories, setCategories] = useState<{ [key: string]: Category }>({});
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20; // Set rows per page
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://backendalaahd.onrender.com/api/products");
        const productsData = response.data;

        if (!Array.isArray(productsData) || productsData.length === 0) {
          console.warn("No products found.");
          setAllProducts([]); // Clear products in state
          return;
        }

        // Set all products (no pagination yet)
        setAllProducts(productsData);

        // Fetch price and color data for all products
        const pricePromises = productsData.map((product: Package) => {
          if (!product.priceId) {
            return Promise.resolve(null);
          }
          return axios.get(`https://backendalaahd.onrender.com/api/prices/${product.priceId}`);
        });

        const colorPromises = productsData.map((product: Package) => {
          if (!Array.isArray(product.colorsId) || product.colorsId.length === 0) {
            return Promise.resolve(null);
          }
          return axios.get(`https://backendalaahd.onrender.com/api/colors/${product.colorsId}`);
        });

        const categoryPromises = productsData.map((product: Package) => {
          if (!Array.isArray(product.categoryId) || product.categoryId.length === 0) {
            return Promise.resolve(null);
          }
          return axios.get(`https://backendalaahd.onrender.com/api/categories/${product.categoryId}`);
        });

        // Resolve all promises
        const [priceResponses, colorResponses, categoryResponse] = await Promise.all([
          Promise.all(pricePromises),
          Promise.all(colorPromises),
          Promise.all(categoryPromises),
        ]);

        // Filter out null responses
        const validPriceResponses = priceResponses.filter(res => res !== null);
        const validColorResponses = colorResponses.filter(res => res !== null);
        const validCategoryResponses = categoryResponse.filter(res => res !== null);

        // Map the price and color data
        const priceData = validPriceResponses.reduce((acc: { [key: string]: Price }, res) => {
          if (res) { // Check if res is not null
            acc[res.data._id] = res.data;
          }
          return acc;
        }, {});

        const colorData = validColorResponses.reduce((acc: { [key: string]: Color }, res) => {
          if (res) { // Check if res is not null
            acc[res.data._id] = res.data;
          }
          return acc;
        }, {});

        const categoryData = validCategoryResponses.reduce((acc: { [key: string]: Category }, res) => {
          if (res) { // Check if res is not null
            acc[res.data._id] = res.data;
          }
          return acc;
        }, {});

        // Update the state with fetched data
        setPrices(priceData);
        setColors(colorData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching products, prices, or colors:", error);
      }
    };

    fetchProducts();
  }, []); // Fetch all products on component mount

  // Open modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Filter products based on search term (product name or color name)
  const filteredProducts = allProducts.filter((product) => {
    const productName = product.title.toLowerCase();
    const colorName = colors[product.colorsId]?.name?.toLowerCase() || '';
    const categoryName = colors[product.categoryId]?.name?.toLowerCase() || '';
    return productName.includes(searchTerm.toLowerCase()) || colorName.includes(searchTerm.toLowerCase()) || categoryName.includes(searchTerm.toLowerCase());
  });

  // Calculate pagination after filtering
  const totalRows = filteredProducts.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {/* Search Bar */}
      <div className="mb-4 flex justify-between">

        <input
          type="text"
          placeholder="Search by product or color name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
          className="px-4 py-2 border rounded w-2/5"
        />
        <button onClick={handleOpenModal} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          + Ajouter produit
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">ID</th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">Nom produit</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Couleur</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Categories</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Prix d'Achat</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Prix vente</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Margin</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Stock Actuel</th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="border-[#eee] px-4 py-4 dark:border-dark-3 text-center">
                  No products available
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product, index) => (
                <tr key={index}>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {index + 1}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <h5 className="text-dark dark:text-white">{product.title}</h5>
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <span
                      className="inline-block h-4 w-4 rounded-full"
                      style={{ backgroundColor: colors[product.colorsId]?.refColor || "#000" }}
                    ></span>
                    <p>{colors[product.colorsId]?.name || "N/A"}</p>
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {categories[product.categoryId]?.name || "N/A"}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {prices[product.priceId]?.cost_per_item || "N/A"} DH
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {prices[product.priceId]?.price || "N/A"} DH
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {prices[product.priceId]?.margin
                      ? `${parseFloat(prices[product.priceId].margin).toFixed(1).replace('.', ',')} %`
                      : "N/A"}
                  </td>

                  <td>
                    {colors[product.colorsId]?.stock_color || "N/A"}
                  </td>
                  <td className="border-[#eee] flex align-middle px-4 py-4 dark:border-dark-3 text-right">
                    <button className="hover:text-primary flex align-middle fill-blue-400 rounded-full px-3 py-1 bg-blue-100">
                      <span className="text-blue-400 font-medium">Modifier</span></button>
                    <button className="hover:text-primary ml-4 fill-red-600">
                      <svg width="18" id="Layer_1" enable-background="new 0 0 25.9 32" viewBox="0 0 25.9 32" xmlns="http://www.w3.org/2000/svg"><path d="m8 10h2v16h-2z" /><path d="m12 10h2v16h-2z" /><path d="m16 10h2v16h-2z" /><path d="m18 4v-4h-10v4h-8v2h2l1 23c0 1.7 1.3 3 3 3h14c1.6 0 3-1.3 3-3l1-23h1.9v-2zm-8-2h6v2h-6zm11 27c0 .6-.4 1-1 1h-14c-.6 0-1-.5-1-1l-1-23h18z" /></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <AddProduct open={showModal} handleClose={handleCloseModal} />
    </div >
  );
};

export default ListProduct;
