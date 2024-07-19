import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchTypes, fetchCategories, fetchAllBrands, deleteType } from '../../redux/actions';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertDialog from '../common/AlertDialog/AlertDialog';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const types = useSelector((state: RootState) => state.types.types);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const brands = useSelector((state: RootState) => state.brands.brands);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTypes());
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  const handleAddType = () => {
    navigate('/create-type');
  };

  const handleEditCategoriesAndBrands = () => {
    navigate('/edit-categories');
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find(brand => brand.id === brandId);
    return brand ? brand.name : 'Unknown Brand';
  };

  const handleDeleteClick = (typeId: string) => {
    setTypeToDelete(typeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (typeToDelete) {
      dispatch(deleteType(typeToDelete));
      setTypeToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setTypeToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <Container className="admin-panel">
      <Typography variant="h4" component="h1" className="admin-panel-title">
        Admin Panel
      </Typography>
      <Button variant="contained" color="primary" onClick={handleEditCategoriesAndBrands} style={{ marginBottom: '20px' }}>
        Edit Categories and Brands
      </Button>
      <div className="table-container">
        <Table>
          <TableHead className="table-header">
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Variant Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No data yet</TableCell>
              </TableRow>
            ) : (
              types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{getCategoryName(type.categoryId)}</TableCell>
                  <TableCell>{getBrandName(type.brandId)}</TableCell>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.colorVariants.length + type.sizeVariants.length}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/edit-type/${type.id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(type.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="add-type-button">
        <Button variant="contained" color="primary" onClick={handleAddType}>
          Add Type
        </Button>
      </div>
      <AlertDialog
        open={deleteDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this type?"
        positiveButtonText="Delete"
        negativeButtonText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Container>
  );
};

export default AdminPanel;
