import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { SketchPicker, ColorResult } from 'react-color';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';

// Define the color object structure
interface ColorButton {
  color: string;
  name: string;
  stock: string;
}

// Define prop types
interface ColorPickerButtonProps {
  onColorsSelect: (colors: ColorButton[]) => void;
  error?: { [key: string]: boolean };
  helperText?: { [key: string]: string };
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({ onColorsSelect, error = {}, helperText = {} }) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [buttonColor, setButtonColor] = useState<string>('#000');
  const [colorName, setColorName] = useState<string>('Custom Color');
  const [colorStock, setColorStock] = useState<string>('0');
  const [colorButtons, setColorButtons] = useState<ColorButton[]>([]);
  const [exceededLimit, setExceededLimit] = useState<boolean>(false);

  // Open color picker
  const handleButtonClick = () => {
    setShowColorPicker(true);
  };

  // Handle color change
  const handleColorChange = (color: ColorResult) => {
    setButtonColor(color.hex);
  };

  // Save new color button
  const handleColorSave = () => {
    if (colorButtons.length >= 10) {
      setExceededLimit(true);
      return;
    }
    const newColor: ColorButton = { color: buttonColor, name: colorName, stock: colorStock };
    const updatedColors = [...colorButtons, newColor];
    setColorButtons(updatedColors);
    onColorsSelect(updatedColors); // Notify parent component
    setShowColorPicker(false);
  };

  // Close color picker
  const handleColorPickerClose = () => {
    setShowColorPicker(false);
  };

  // Delete a color
  const handleDeleteColor = (index: number) => {
    const newButtons = [...colorButtons];
    newButtons.splice(index, 1);
    setColorButtons(newButtons);
    onColorsSelect(newButtons);
  };

  return (
    <>
      {/* Render color buttons */}
      {colorButtons.map((btn, index) => (
        <Grid container alignItems="center" spacing={2} key={index} sx={{ marginTop: '1em', marginBottom: '1em' }}>
          <Grid item xs={12} sm={8}>
            <Button
              variant="contained"
              style={{ backgroundColor: btn.color, color: '#fff' }}
              onClick={handleButtonClick}
              fullWidth
            >
              {btn.name}
            </Button>
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              label="Stock"
              value={btn.stock}
              onChange={(e) => {
                const newButtons = [...colorButtons];
                newButtons[index].stock = e.target.value;
                setColorButtons(newButtons);
              }}
              error={!!error[`color${index}`]}
              helperText={helperText[`color${index}`]}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button variant="outlined" onClick={() => handleDeleteColor(index)} fullWidth startIcon={<i className="fa-duotone fa-solid fa-trash"></i>}>
              Delete
            </Button>
          </Grid>
        </Grid>
      ))}

      {/* Button to add a new color */}
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} sm={8}>
          <Fab color="primary" onClick={handleButtonClick} aria-label="add">
            {/* <AddIcon style={{ fontSize: '1.3rem' }} /> */}
            <i className="fa-duotone fa-solid fa-layer-plus" style={{ fontSize: '1.3rem' }}></i>
          </Fab>
        </Grid>
      </Grid>

      {/* Color picker modal */}
      {showColorPicker && (
        <Grid item>
          <SketchPicker color={buttonColor} onChange={handleColorChange} />
          {exceededLimit && (
            <Alert
              color="error"
              variant="outlined"
              sx={{ border: '1px solid #ffd66680', background: '#fffbe6', marginTop: '2em' }}
              icon={<i className="fa-duotone fa-solid fa-circle-exclamation" style={{ color: '#faad14' }}></i>}
        
            >
              <Typography variant="h6">Maximum limit of 10 colors reached.</Typography>
            </Alert>
          )}
          <TextField
            type="text"
            label="Name"
            value={colorName}
            sx={{ marginTop: '2em' }}
            onChange={(e) => setColorName(e.target.value)}
            error={!!error.name}
            helperText={helperText.name}
            fullWidth
          />
          <TextField
            label="Stock"
            value={colorStock}
            sx={{ marginTop: '1em' }}
            onChange={(e) => setColorStock(e.target.value)}
            error={!!error.stock}
            helperText={helperText.stock}
            fullWidth
          />
          <Button sx={{ marginTop: '1em' }} color="info" variant="contained" onClick={handleColorSave} disabled={exceededLimit}>
            Save Color
          </Button>
          <Button sx={{ marginTop: '1em' }} onClick={handleColorPickerClose}>
            Close
          </Button>
        </Grid>
      )}
    </>
  );
};

export default ColorPickerButton;
