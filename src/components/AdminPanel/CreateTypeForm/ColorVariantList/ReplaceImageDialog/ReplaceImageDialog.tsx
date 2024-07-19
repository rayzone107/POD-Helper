import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

interface ReplaceImageDialogProps {
  open: boolean;
  variantName: string;
  onClose: () => void;
  onSave: (file: File) => void;
}

const ReplaceImageDialog: React.FC<ReplaceImageDialogProps> = ({
  open,
  variantName,
  onClose,
  onSave,
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (file) {
      onSave(file);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Replace Image for {variantName}</DialogTitle>
      <DialogContent>
        <input type="file" onChange={handleFileChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={!file}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReplaceImageDialog;
