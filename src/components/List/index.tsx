"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the Package type
type Package = {
  name: string;
  priceId: string;
  colorId: string;
  skuId: string;
  invoiceDate: string;
  status: "Paid" | "Unpaid" | "Pending"; // Adjust statuses as needed
};

// Define types for Price, SKU, and Color
type Price = {
  _id: string;
  currency: string;
  price: string;
  tax: string;
  cost_per_item: string;
  profit: string;
  margin: string;
};

type SKU = {
  _id: string;
  sku: string;
  barcode: string;
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
  const [skus, setSkus] = useState<{ [key: string]: SKU }>({});
  const [colors, setColors] = useState<{ [key: string]: Color }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const rowsPerPage = 20; // Set rows per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products from the API
        const response = await axios.get("https://backendalaahd.onrender.com/api/products");
        const allProducts = response.data;

        setTotalRows(allProducts.length); // Set total number of products for pagination

        // Slice the products for pagination
        const paginatedProducts = allProducts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
        
        // Fetch price, color, and SKU data concurrently using Promise.all
        const pricePromises = paginatedProducts.map((product: Package) =>
          axios.get(`https://backendalaahd.onrender.com/api/prices/${product.priceId}`)
        );
        const skuPromises = paginatedProducts.map((product: Package) =>
          axios.get(`https://backendalaahd.onrender.com/api/skus/${product.skuId[0]}`)
        );
        const colorPromises = paginatedProducts.map((product: Package) =>
          axios.get(`https://backendalaahd.onrender.com/api/colors/${product.colorId[0]}`)
        );

        // Resolve all promises
        const [priceResponses, skuResponses, colorResponses] = await Promise.all([
          Promise.all(pricePromises),
          Promise.all(skuPromises),
          Promise.all(colorPromises),
        ]);

        // Map the price, sku, and color data by their respective IDs
        const priceData = priceResponses.reduce((acc: { [key: string]: Price }, res) => {
          acc[res.data._id] = res.data;
          return acc;
        }, {});

        const skuData = skuResponses.reduce((acc: { [key: string]: SKU }, res) => {
          acc[res.data._id] = res.data;
          return acc;
        }, {});

        const colorData = colorResponses.reduce((acc: { [key: string]: Color }, res) => {
          acc[res.data._id] = res.data;
          return acc;
        }, {});

        // Update the state with fetched data
        setProducts(paginatedProducts); // Set only the paginated products
        setPrices(priceData);
        setSkus(skuData);
        setColors(colorData);
      } catch (error) {
        console.error("Error fetching products, prices, SKUs, or colors:", error);
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
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">SKU</th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">Nom produit</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Couleur</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Prix d'Achat</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Prix vente</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Stock Actuel</th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                  {skus[product.skuId]?.sku || "N/A"}
                </td>
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                  <h5 className="text-dark dark:text-white">{product.name}</h5>
                </td>
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                  <span
                    className="inline-block h-4 w-4 rounded-full"
                    style={{ backgroundColor: colors[product.colorId]?.refColor || "#000" }}
                  ></span>
                  <p>{colors[product.colorId]?.name || "N/A"}</p>
                </td>
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                  {prices[product.priceId]?.cost_per_item || "N/A"}
                </td>
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                  {prices[product.priceId]?.price || "N/A"}
                </td>
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                  {colors[product.colorId]?.stock_color || "N/A"}
                </td>
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3 text-right">
                  <button className="hover:text-primary">Edit</button>
                  <button className="hover:text-primary ml-4">Delete</button>
                </td>
              </tr>
            ))}
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
