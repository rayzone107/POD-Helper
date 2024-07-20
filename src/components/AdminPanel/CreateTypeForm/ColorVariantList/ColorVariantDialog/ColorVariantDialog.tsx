import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { SketchPicker } from 'react-color';
import { ColorVariant } from '../../../../../types';

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

  useEffect(() => {
    if (variant) {
      setName(variant.name);
      setHexColorCode(variant.hexColorCode);
      setIsDark(variant.isDark);
    }
  }, [variant]);

  const handleSave = () => {
    if (variant) {
      onSave({
        ...variant,
        name,
        hexColorCode,
        isDark,
      });
    } else {
      onSave({
        id: '',
        name,
        hexColorCode,
        isDark,
        imageUrl: '',
        imageFile: null,
      });
    }
    onClose();
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
        <FormControlLabel
          control={<Checkbox checked={isDark} onChange={(e) => setIsDark(e.target.checked)} />}
          label="Is Dark"
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
