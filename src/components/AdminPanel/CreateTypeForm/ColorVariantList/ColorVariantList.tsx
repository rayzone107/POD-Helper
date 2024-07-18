import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ColorVariant } from '../../../../types';
import AlertDialog from '../../../common/AlertDialog/AlertDialog';

interface ColorVariantListProps {
  colorVariants: ColorVariant[];
  onEdit: (variant: ColorVariant) => void;
  onDelete: (id: string) => void;
}

const ColorVariantList: React.FC<ColorVariantListProps> = ({ colorVariants, onEdit, onDelete }) => {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setAlertOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
    }
    setAlertOpen(false);
    setDeleteId(null);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Hex Color Code</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {colorVariants.map((variant) => (
            <TableRow key={variant.id}>
              <TableCell>{variant.name}</TableCell>
              <TableCell>{variant.hexColorCode}</TableCell>
              <TableCell>
                {variant.imageUrl && <img src={variant.imageUrl} alt={variant.name} style={{ width: '50px', height: '50px' }} />}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(variant)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleDelete(variant.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog
        open={alertOpen}
        title="Delete Color Variant"
        message="Are you sure you want to delete this color variant?"
        positiveButtonText="Delete"
        negativeButtonText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setAlertOpen(false)}
      />
    </>
  );
};

export default ColorVariantList;
