import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ColorVariant } from '../../../../types';
import './ColorVariantList.css';

interface ColorVariantListProps {
  colorVariants: ColorVariant[];
  onEdit: (variant: ColorVariant) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onBulkAdd: (variants: ColorVariant[]) => void;
}

const ColorVariantList: React.FC<ColorVariantListProps> = ({ colorVariants, onEdit, onDelete, onAdd, onBulkAdd }) => {
  const [bulkAddDialogOpen, setBulkAddDialogOpen] = useState(false);
  const [bulkAddFiles, setBulkAddFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBulkAdd = async () => {
    if (!bulkAddFiles) return;

    const newVariants = await Promise.all(
      Array.from(bulkAddFiles).map(async (file) => {
        const name = file.name.replace(/\.[^/.]+$/, ""); // Remove the file extension
        const formattedName = name
          .split(/[\s_.-]+/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const imageUrl = URL.createObjectURL(file);

        return new Promise<ColorVariant>((resolve, reject) => {
          const img = new Image();
          img.src = imageUrl;
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              if (!ctx) throw new Error('Failed to get canvas context');
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);

              const { data } = ctx.getImageData(img.width / 2, img.height / 2, 1, 1);
              const hexColorCode = `#${((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1).toUpperCase()}`;

              const luminance = (0.299 * data[0] + 0.587 * data[1] + 0.114 * data[2]) / 255;
              const isDark = luminance < 0.5;

              resolve({
                id: uuidv4(), // Ensure unique ID
                name: formattedName,
                hexColorCode,
                isDark,
                imageFile: file,
                imageUrl,
              });
            } catch (error) {
              reject(error);
            }
          };
          img.onerror = () => {
            reject(new Error('Failed to load image'));
          };
        });
      })
    );

    if (newVariants.some((variant) => variant instanceof Error)) {
      setError('One or more images could not be processed. Please check the images and try again.');
      return;
    }

    onBulkAdd(newVariants as ColorVariant[]);
    setBulkAddDialogOpen(false);
    setBulkAddFiles(null);
    setError(null);
  };

  return (
    <div className="color-variant-list">
      <Typography variant="h6" gutterBottom>
        Color Variants
      </Typography>
      <Button variant="contained" color="primary" onClick={onAdd} style={{ marginBottom: '20px' }}>
        Add Color Variant
      </Button>
      <Button variant="contained" color="secondary" onClick={() => setBulkAddDialogOpen(true)} style={{ marginBottom: '20px', marginLeft: '10px' }}>
        Bulk Add Color Variants
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Is Dark</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {colorVariants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data yet
                </TableCell>
              </TableRow>
            ) : (
              colorVariants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell>{variant.name}</TableCell>
                  <TableCell>
                    <div
                      style={{
                        backgroundColor: variant.hexColorCode,
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {variant.imageUrl ? (
                      <img src={variant.imageUrl} alt={variant.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    ) : (
                      <Typography>No Image</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={variant.isDark} disabled />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEdit(variant)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onDelete(variant.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={bulkAddDialogOpen} onClose={() => setBulkAddDialogOpen(false)}>
        <DialogTitle>Bulk Add Color Variants</DialogTitle>
        <DialogContent>
          <input
            type="file"
            multiple
            onChange={(e) => setBulkAddFiles(e.target.files)}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkAddDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBulkAdd} color="primary" disabled={!bulkAddFiles}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ColorVariantList;
