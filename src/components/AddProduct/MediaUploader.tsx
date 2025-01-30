import React, { useState } from 'react';
import {
  Paper,
  Button,
  InputLabel,
  Typography,
  Select,
  MenuItem,
  Alert,
  Grid,
  TextField,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import { PlusCircleOutlined, ClearOutlined } from '@ant-design/icons';

interface MediaUploaderProps {
  onImagesSelect: (images: string[]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onImagesSelect }) => {
  const [mediaType, setMediaType] = useState<'images' | 'url'>('images');
  const [imagesSave, setImagesSave] = useState<string[]>([]);
  const [exceededLimit, setExceededLimit] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { value } = e.target;
    const updatedImages = [...imagesSave];
    updatedImages[index] = value;
    setImagesSave(updatedImages);
    onImagesSelect(updatedImages);
  };

  const handleMediaTypeChange = (event: SelectChangeEvent<'images' | 'url'>) => {
    setMediaType(event.target.value as 'images' | 'url');
  };

  const handleAddField = () => {
    if (imagesSave.length === 8) {
      setExceededLimit(true);
      return;
    }
    setImagesSave([...imagesSave, '']);
    onImagesSelect([...imagesSave, '']);
  };

  const handleClearImage = (index: number) => {
    if (imagesSave.length === 1) return;
    if (imagesSave.length <= 8) setExceededLimit(false);
    const updatedImages = imagesSave.filter((_, i) => i !== index);
    setImagesSave(updatedImages);
    onImagesSelect(updatedImages);
  };

  return (
    <Paper style={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant="subtitle1" gutterBottom>
        Media
      </Typography>
      <InputLabel>Select media type</InputLabel>
      <Select value={mediaType} onChange={handleMediaTypeChange} name="mediaType" sx={{ marginTop: '2' }}>
        <MenuItem value="images">I have images</MenuItem>
        <MenuItem value="url">I have URL</MenuItem>
      </Select>
      {mediaType === 'images' ? (
        <>
          <Grid container style={{ gap: '10px', margin: 'auto 0', padding: '20px 0' }}>
            <input accept="image/*, video/*, .obj" style={{ display: 'none' }} id="contained-button-file" multiple type="file" />
            <label htmlFor="contained-button-file">
              <Button variant="contained" component="span" style={{ gap: '4px' }}>
                Upload Files
              </Button>
            </label>
            <Typography style={{ display: 'flex', alignItems: 'center' }} variant="body2">
              No file chosen
            </Typography>
          </Grid>
          <Typography style={{ margin: '10px 0' }} variant="body2" gutterBottom>
            Add from URL
          </Typography>
          <Typography variant="body2" gutterBottom>
            Accepts images, videos, or 3D models
          </Typography>
        </>
      ) : (
        <Grid container>
          {imagesSave.map((image, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                variant="outlined"
                name={`image-${index}`}
                value={image}
                fullWidth
                placeholder="Upload image or paste URL"
                onChange={(e) => handleImageChange(e, index)}
                style={{ marginTop: '1em' }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => handleClearImage(index)}>
                      <ClearOutlined />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <IconButton color="primary" onClick={handleAddField} style={{ marginTop: '16px' }}>
              <PlusCircleOutlined />
            </IconButton>
          </Grid>
        </Grid>
      )}
      {exceededLimit && (
        <Alert severity="warning" style={{ marginTop: '1em' }}>
          Maximum limit of 8 images for the product.
        </Alert>
      )}
    </Paper>
  );
};

export default MediaUploader;