import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControlLabel, Switch, InputLabel } from '@mui/material';
import { ChromePicker } from 'react-color';
import { ColorVariant } from '../../../../../types';
import './ColorVariantDialog.css';

interface ColorVariantDialogProps {
  open: boolean;
  variant: ColorVariant | null;
  onClose: () => void;
  onSave: (variant: ColorVariant) => void;
}

const ColorVariantDialog: React.FC<ColorVariantDialogProps> = ({ open, variant, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [hexColorCode, setHexColorCode] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (variant) {
      setName(variant.name);
      setHexColorCode(variant.hexColorCode);
      setIsDark(variant.isDark);
      setImageFile(variant.imageFile || null);
      setImageUrl(variant.imageUrl);
    } else {
      setName('');
      setHexColorCode('');
      setIsDark(false);
      setImageFile(null);
      setImageUrl(undefined);
    }
  }, [variant]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (variant) {
      onSave({
        ...variant,
        name,
        hexColorCode,
        isDark,
        imageFile,
        imageUrl,
      });
    } else {
      onSave({
        id: '',
        name,
        hexColorCode,
        isDark,
        imageFile,
        imageUrl,
      });
    }
    onClose();
  };

  const handlePickColor = async () => {
    if ('EyeDropper' in window) {
      try {
        // @ts-ignore
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        setHexColorCode(result.sRGBHex);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error('EyeDropper API is not supported in this browser.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{variant ? 'Edit Color Variant' : 'Add Color Variant'}</DialogTitle>
      <DialogContent className="dialog-content">
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <InputLabel style={{ marginTop: '16px' }}>Select Image</InputLabel>
        <div className="image-picker">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload" className="image-picker-label">
            {imageUrl ? (
              <img src={imageUrl} alt="Selected" className="selected-image" />
            ) : (
              <span className="image-picker-placeholder">+</span>
            )}
          </label>
        </div>
        <InputLabel style={{ marginTop: '16px' }}>Color</InputLabel>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <ChromePicker
            color={hexColorCode}
            onChangeComplete={(color) => setHexColorCode(color.hex)}
            disableAlpha
            styles={{ default: { picker: { width: '100%' } } }}
          />
          <Button
            onClick={handlePickColor}
            variant="contained"
            color="primary"
            style={{ marginLeft: '16px', paddingTop: '10px', paddingBottom: '10px', height: 'auto' }}
          >
            Pick Color
          </Button>
        </div>
        <FormControlLabel
          control={
            <Switch
              checked={isDark}
              onChange={(e) => setIsDark(e.target.checked)}
            />
          }
          label="Is Dark"
          style={{ marginTop: '16px' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColorVariantDialog;
