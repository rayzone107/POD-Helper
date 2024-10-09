import React from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SizeVariant } from '../../../../types';
import './SizeVariantList.css';

interface SizeVariantListProps {
  sizeVariants: SizeVariant[];
  onEdit: (variant: SizeVariant) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const SizeVariantList: React.FC<SizeVariantListProps> = ({ sizeVariants, onEdit, onDelete, onAdd }) => {
  return (
    <div className="size-variant-list">
      <h2>Size Variants</h2>
      <Button variant="contained" color="primary" onClick={onAdd} style={{ marginBottom: '20px' }}>
        Add Size Variant
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Shipping Cost</TableCell> {/* New column for shipping cost */}
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sizeVariants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data yet
                </TableCell>
              </TableRow>
            ) : (
              sizeVariants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell>{variant.name}</TableCell>
                  <TableCell>{variant.price}</TableCell>
                  <TableCell>{variant.shippingCost}</TableCell> {/* Display shipping cost */}
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

export default SizeVariantList;
