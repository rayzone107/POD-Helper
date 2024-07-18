import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import './AlertDialog.css';

interface AlertDialogProps {
  open: boolean;
  title: string;
  message: string;
  positiveButtonText: string;
  negativeButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  message,
  positiveButtonText,
  negativeButtonText,
  onConfirm,
  onCancel
}) => {
  return (
    <Dialog open={open} onClose={onCancel} className="alert-dialog">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          {negativeButtonText}
        </Button>
        <Button onClick={onConfirm} color="primary">
          {positiveButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
