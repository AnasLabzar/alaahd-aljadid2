"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the Package type
type Package = {
  name: string;
  priceId: string;
  colorsId: string[0];
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

const ListProduct = () => {
  const [products, setProducts] = useState<Package[]>([]); // State to hold product data
  const [prices, setPrices] = useState<{ [key: string]: Price }>({});
  const [colors, setColors] = useState<{ [key: string]: Color }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const rowsPerPage = 20; // Set rows per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://backendalaahd.onrender.com/api/products");
        const allProducts = response.data;
    
        if (!Array.isArray(allProducts) || allProducts.length === 0) {
          console.warn("No products found.");
          setProducts([]); // Clear products in state
          return;
        }
    
        setTotalRows(allProducts.length);
        const paginatedProducts = allProducts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
        
        // Fetch price data
        const pricePromises = paginatedProducts.map((product: Package) => {
          if (!product.priceId) {
            console.warn(`Product ${product._id} is missing priceId.`);
            return Promise.resolve(null); // Return a resolved promise to avoid breaking the map
          }
          return axios.get(`https://backendalaahd.onrender.com/api/prices/${product.priceId}`);
        });
    
        // Fetch color data
        const colorPromises = paginatedProducts.map((product: Package) => {
          if (!Array.isArray(product.colorsId) || product.colorsId.length === 0) {
            console.warn(`Product ${product._id} is missing valid colorsId.`);
            return Promise.resolve(null); // Return a resolved promise to avoid breaking the map
          }
          return axios.get(`https://backendalaahd.onrender.com/api/colors/${product.colorsId}`);
        });
    
        // Resolve all promises
        const [priceResponses, colorResponses] = await Promise.all([
          Promise.all(pricePromises),
          Promise.all(colorPromises),
        ]);
    
        // Filter out null responses
        const validPriceResponses = priceResponses.filter(res => res !== null);
        const validColorResponses = colorResponses.filter(res => res !== null);
    
        // Map the price and color data
        const priceData = validPriceResponses.reduce((acc: { [key: string]: Price }, res) => {
          acc[res.data._id] = res.data;
          return acc;
        }, {});
    
        const colorData = validColorResponses.reduce((acc: { [key: string]: Color }, res) => {
          acc[res.data._id] = res.data;
          return acc;
        }, {});
    
        // Update the state with fetched data
        setProducts(paginatedProducts);
        setPrices(priceData);
        setColors(colorData);
      } catch (error) {
        console.error("Error fetching products, prices, or colors:", error);
      }
    };
    
    

    fetchProducts();
  }, [currentPage]); // Re-run the effect when currentPage changes

  const totalPages = Math.ceil(totalRows / rowsPerPage); // Calculate total pages

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">ID</th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">Nom produit</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Couleur</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Prix d'Achat</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Prix vente</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Stock Actuel</th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="border-[#eee] px-4 py-4 dark:border-dark-3 text-center">
                  No products available
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
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
                    {prices[product.priceId]?.cost_per_item || "N/A"} DH
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {prices[product.priceId]?.price || "N/A"} DH
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {colors[product.colorsId]?.stock_color || "N/A"}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3 text-right">
                    <button className="hover:text-primary">Edit</button>
                    <button className="hover:text-primary ml-4">Delete</button>
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
    </div>
  );
};

export default ListProduct;
