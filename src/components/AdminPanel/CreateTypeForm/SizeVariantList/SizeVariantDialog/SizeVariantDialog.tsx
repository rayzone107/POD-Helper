import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { SizeVariant } from '../../../../../types';
import './SizeVariantDialog.css';

interface SizeVariantDialogProps {
  open: boolean;
  variant: SizeVariant | null;
  onClose: () => void;
  onSave: (variant: SizeVariant) => void;
}

const SizeVariantDialog: React.FC<SizeVariantDialogProps> = ({
  open,
  variant,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [shippingCost, setShippingCost] = useState<number | string>(''); // New state for shipping cost

  useEffect(() => {
    if (variant) {
      setName(variant.name);
      setPrice(variant.price);
      setShippingCost(variant.shippingCost || '');  // Initialize shipping cost
    }
  }, [variant]);

  const handleSave = () => {
    if (variant) {
      onSave({
        ...variant,
        name,
        price: typeof price === 'string' ? parseFloat(price) : price,
        shippingCost: typeof shippingCost === 'string' ? parseFloat(shippingCost) : shippingCost, // Save shipping cost
      });
    } else {
      onSave({
        id: '',
        name,
        price: typeof price === 'string' ? parseFloat(price) : price,
        shippingCost: typeof shippingCost === 'string' ? parseFloat(shippingCost) : shippingCost, // Save shipping cost
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="size-variant-dialog">
      <DialogTitle>{variant ? 'Edit Size Variant' : 'Add Size Variant'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Price"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          label="Shipping Cost"  // New field for shipping cost
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={shippingCost}
          onChange={(e) => setShippingCost(e.target.value)}
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

export default SizeVariantDialog;
