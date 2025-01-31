
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';

// Define prop types
interface SkuCodeBarProps {
  onSkuSelect: (sku: string) => void;
  onColorsName: string[];
  error?: { [key: string]: boolean };
}

const SkuCodeBar: React.FC<SkuCodeBarProps> = ({ onSkuSelect, onColorsName }) => {
  const [sku, setSku] = useState<string>('');
  const [barcode, setBarcode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [autoGenerate, setAutoGenerate] = useState<boolean>(false);

  useEffect(() => {
    if (autoGenerate) {
      generateSku();
    }
  }, [autoGenerate]);

  const handleChange = () => {
    if (!autoGenerate) {
      onSkuSelect(sku);
    }
  };

  const generateSku = () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');

    // Map to keep track of counts for each color name on the same day
    const colorCounts = new Map<string, number>();

    // Generate SKU for each color name provided
    const generatedSkus = onColorsName.map((colorName) => {
      let count = colorCounts.get(colorName) || 1;
      const refColor = count.toString().padStart(2, '0');
      colorCounts.set(colorName, count + 1);
      return `${colorName}${day}${refColor}`;
    });

    const generatedSku = generatedSkus.length > 0 ? generatedSkus[0] : '';

    setSku(generatedSku);
    onSkuSelect(generatedSku);
  };

  const handleAutoGenerateToggle = () => {
    setAutoGenerate((prev) => !prev);
  };

  const handleRegenerateSku = () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const colorCounts = new Map<string, number>();

    const currentSku = sku;
    const currentColorName = currentSku.substring(0, 2);

    const currentIndex = onColorsName.indexOf(currentColorName);
    let nextIndex = (currentIndex + 1) % onColorsName.length;
    const nextColorName = onColorsName[nextIndex];

    let count = colorCounts.get(nextColorName) || 1;
    const refColor = count.toString().padStart(2, '0');
    colorCounts.set(nextColorName, count + 1);

    const regeneratedSku = `${nextColorName.substring(0, 2)}${day}${refColor}`;
    setSku(regeneratedSku);
    onSkuSelect(regeneratedSku);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Switch checked={autoGenerate} onChange={handleAutoGenerateToggle} />
        Auto Generate SKU
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="SKU (Stock Keeping Unit)"
          value={sku}
          onChange={handleChange}
          name="sku"
          disabled={autoGenerate}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Barcode (ISBN, UPC, GTIN, etc.)"
          value={barcode}
          name="barcode"
          onChange={(e) => setBarcode(e.target.value)}
          disabled={autoGenerate}
          fullWidth
        />
      </Grid>
      {loading ? (
        <Grid item xs={12}>Loading...</Grid>
      ) : (
        <Grid item xs={12}>
          {autoGenerate && (
            <Button variant="contained" color="primary" onClick={handleRegenerateSku}>
              Regenerate SKU
            </Button>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default SkuCodeBar;
