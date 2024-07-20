import React from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import { ColorVariant } from '../../../../types';
import './ColorVariantList.css';

interface ColorVariantListProps {
  colorVariants: ColorVariant[];
  onEdit: (variant: ColorVariant) => void;
  onDelete: (id: string) => void;
  onReplaceImage: (variant: ColorVariant) => void;
  onAdd: () => void;
}

const ColorVariantList: React.FC<ColorVariantListProps> = ({ colorVariants, onEdit, onDelete, onReplaceImage, onAdd }) => {
  return (
    <div className="color-variant-list">
      <Typography variant="h6" gutterBottom>
        Color Variants
      </Typography>
      <Button variant="contained" color="primary" onClick={onAdd} style={{ marginBottom: '20px' }}>
        Add Color Variant
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
                    <IconButton onClick={() => onReplaceImage(variant)}>
                      <ImageIcon />
                    </IconButton>
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
    </div>
  );
};

export default ColorVariantList;
