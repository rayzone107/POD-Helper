import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { SketchPicker } from 'react-color';
import './ColorVariantDialog.css';
import { ColorVariant } from '../../../../../types';

interface ColorVariantDialogProps {
  open: boolean;
  variant: ColorVariant | null;
  onClose: () => void;
  onSave: (variant: ColorVariant) => void;
}

const ColorVariantDialog: React.FC<ColorVariantDialogProps> = ({ open, variant, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [hexColorCode, setHexColorCode] = useState('#000000');

  useEffect(() => {
    if (variant) {
      setName(variant.name);
      setHexColorCode(variant.hexColorCode);
    } else {
      setName('');
      setHexColorCode('#000000');
    }
  }, [variant]);

  const handleSave = () => {
    onSave({ id: variant ? variant.id : '', name, hexColorCode });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{variant ? 'Edit Color Variant' : 'Add Color Variant'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <SketchPicker
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
