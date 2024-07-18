import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { ColorVariant } from '../../../../../types';
import './ReplaceImageDialog.css';

interface ReplaceImageDialogProps {
  open: boolean;
  variant: ColorVariant | null;
  onClose: () => void;
  onSave: (imageFile: File) => void;
}

const ReplaceImageDialog: React.FC<ReplaceImageDialogProps> = ({ open, variant, onClose, onSave }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      onSave(selectedFile);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="replace-image-dialog">
      <DialogTitle>Replace Image</DialogTitle>
      <DialogContent>
        {variant && variant.imageUrl && (
          <img src={variant.imageUrl} alt={variant.name} className="replace-image-dialog-img" />
        )}
        <Typography>Choose a new image file:</Typography>
        <input type="file" onChange={handleFileChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={!selectedFile}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReplaceImageDialog;
