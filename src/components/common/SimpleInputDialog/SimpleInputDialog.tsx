import React, { useEffect, useRef } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

interface SimpleInputDialogProps {
  open: boolean;
  title: string;
  fieldLabel: string;
  positiveButtonText: string;
  negativeButtonText: string;
  initialValue: string;
  onPositive: (value: string) => void;
  onNegative: () => void;
}

const SimpleInputDialog: React.FC<SimpleInputDialogProps> = ({
  open,
  title,
  fieldLabel,
  positiveButtonText,
  negativeButtonText,
  initialValue,
  onPositive,
  onNegative,
}) => {
  const [value, setValue] = React.useState(initialValue);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [open, initialValue]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      onPositive(value);
    } else if (event.key === 'Escape') {
      onNegative();
    }
  };

  return (
    <Dialog open={open} onClose={onNegative} onKeyDown={handleKeyDown} ref={dialogRef}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={fieldLabel}
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onNegative} color="primary">
          {negativeButtonText}
        </Button>
        <Button onClick={() => onPositive(value)} color="primary">
          {positiveButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleInputDialog;
