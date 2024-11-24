import React, { ChangeEvent } from 'react';
import { Button } from '@mui/material';
import { read, utils } from 'xlsx';
import axios from 'axios'; // Import axios for making API requests
import Swal from 'sweetalert2'; // Import SweetAlert2

interface ExcelUploadFormProps {
  onUpload: () => void;
}

interface Product {
  [key: string]: string | number | undefined;
  "Title product"?: string;
  CODE?: string;
  Currency?: string;
  Price?: string;
  Tax?: string;
  "Cost per item"?: string;
  Profit?: string;
  Margin?: string;
  "ref color"?: string;
  "Name color"?: string;
  "Stock color"?: string;
  "U.T"?: string;
  Height?: string;
  CategoryId?: string;
  Description?: string;
}

const ButtonUploadXlsx: React.FC<ExcelUploadFormProps> = ({ onUpload }) => {
  const handleUpload = async (uploadedProducts: Product[]) => {
    Swal.fire({
      title: 'Uploading...',
      text: 'Please wait while the products are being uploaded.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      for (let product of uploadedProducts) {
        // Check if the product row is essentially empty
        if (!product["Title product"] || !product["CODE"]) {
          console.log('Empty row encountered, stopping processing.');
          break; // Stop processing further if the critical fields are missing
        }

        // Process each product
        const priceData = {
          currency: product["Currency"],
          price: product["Price"],
          tax: product["Tax"],
          cost_per_item: product["Cost per item"],
          profit: product["Profit"],
          margin: product["Margin"],
        };
        const priceResponse = await axios.post('http://localhost:8080/price/add-new', priceData);
        const priceId = priceResponse.data._id;

        const colorsIds = await Promise.all(
          [
            {
              color: product["ref color"],
              name: product["Name color"],
              stock: product["Stock color"],
            },
          ].map(async (colorObj) => {
            try {
              const colorData = {
                refColor: colorObj.color,
                name: colorObj.name,
                stock_color: colorObj.stock,
              };
              const colorResponse = await axios.post('http://localhost:8080/color/add-new', colorData);
              console.log('Color successfully added:', colorResponse.data);

              return colorResponse.data._id;
            } catch (error) {
              console.error('Error creating color:', error);
              return null;
            }
          })
        );

        const skuData = {
          sku: product["CODE"],
          barcode: product["CODE"],
        };
        const skuResponse = await axios.post('http://localhost:8080/sku/add-new', skuData);
        const skuId = skuResponse.data._id;

        const productData = {
          title: product["Title product"],
          description: product["Description"],
          units_type: product["U.T"],
          height: product["Height"],
          priceId: priceId,
          colorsId: colorsIds,
          skuId: skuId,
          categoryId: product["CategoryId"],
        };
        const productResponse = await axios.post('http://localhost:8080/product/add-new', productData);
        const productId = productResponse.data._id;
        console.log('This is Product ID:', productId);
      }

      Swal.fire({
        title: 'Success!',
        text: 'All products have been successfully uploaded.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      onUpload();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `There was a problem uploading your products. Err: ${error}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Error during upload:', error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = utils.sheet_to_json<string[]>(worksheet, { header: 1 });

      // Assuming the first row contains headers
      const headers = jsonData[0] as string[];
      const products: Product[] = jsonData.slice(1).map((row) => {
        const product: Product = {};
        headers.forEach((header, index) => {
          product[header] = row[index];
        });
        return product;
      });

      // Send the products to the handler function
      handleUpload(products);
    };
    fileReader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the input field visually
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button className='dark:bg-[#23324a] bg-[#f3f4f6] mt-2' style={{border: '2px dashed #2b41b487', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3em', borderRadius: '10px'}} component="span">
            <i style={{ fontSize: '2em' }} className="fa-duotone fa-solid fa-cloud-arrow-up dark:color-[#86abff] color-[#4980fe]"></i>
            <span className='dark:color-[#f3f4f6] color-black' style={{ textTransform: 'none', marginTop: '.5em' }}>Choisir fichier Excel</span>        
        </Button>
      </label>
    </div>
  );
};

export default ButtonUploadXlsx;
