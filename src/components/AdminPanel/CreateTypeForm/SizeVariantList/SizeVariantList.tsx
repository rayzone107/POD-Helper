import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SizeVariant } from '../../../../types';
import AlertDialog from '../../../common/AlertDialog/AlertDialog';

interface SizeVariantListProps {
  sizeVariants: SizeVariant[];
  onEdit: (variant: SizeVariant) => void;
  onDelete: (id: string) => void;
}

const SizeVariantList: React.FC<SizeVariantListProps> = ({ sizeVariants, onEdit, onDelete }) => {
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
            <TableCell>Price</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sizeVariants.map((variant) => (
            <TableRow key={variant.id}>
              <TableCell>{variant.name}</TableCell>
              <TableCell>{variant.price}</TableCell>
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
        title="Delete Size Variant"
        message="Are you sure you want to delete this size variant?"
        positiveButtonText="Delete"
        negativeButtonText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setAlertOpen(false)}
      />
    </>
  );
};

export default SizeVariantList;
