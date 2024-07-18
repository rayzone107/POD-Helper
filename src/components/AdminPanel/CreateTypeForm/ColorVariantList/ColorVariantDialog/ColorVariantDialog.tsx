import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { ColorVariant } from '../../../../../types';
import { ChromePicker } from 'react-color';
import './ColorVariantDialog.css';

interface ColorVariantDialogProps {
  open: boolean;
  variant: ColorVariant | null;
  onClose: () => void;
  onSave: (variant: ColorVariant) => void;
}

const ColorVariantDialog: React.FC<ColorVariantDialogProps> = ({
  open,
  variant,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [hexColorCode, setHexColorCode] = useState('');

  useEffect(() => {
    if (variant) {
      setName(variant.name);
      setHexColorCode(variant.hexColorCode);
    }
  }, [variant]);

  const handleSave = () => {
    if (variant) {
      onSave({
        ...variant,
        name,
        hexColorCode,
      });
    } else {
      onSave({
        id: '',
        name,
        hexColorCode,
        imageUrl: '',
        imageFile: null,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="color-variant-dialog">
      <DialogTitle>{variant ? 'Edit Color Variant' : 'Add Color Variant'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ChromePicker
          color={hexColorCode}
          onChangeComplete={(color) => setHexColorCode(color.hex)}
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
