import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchBrands, addBrand, updateBrand, deleteBrand } from '../../../redux/actions';
import { Brand } from '../../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SimpleInputDialog from '../../common/SimpleInputDialog/SimpleInputDialog';
import AlertDialog from '../../common/AlertDialog/AlertDialog';
import './EditBrandsForm.css';

const EditBrandsForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);

  const categories = useSelector((state: RootState) => state.categories.categories);
  const brands = useSelector((state: RootState) => state.brands.brands);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchBrands(selectedCategoryId));
    }
  }, [selectedCategoryId, dispatch]);

  const handleAddBrand = (brandName: string) => {
    console.log('Adding brand:', brandName);
    dispatch(addBrand({ id: '', name: brandName, categoryId: selectedCategoryId }));
    setNewBrandName('');
    setOpen(false);
  };

  const handleUpdateBrand = (brandName: string) => {
    if (editingBrand) {
      console.log('Updating brand:', brandName);
      dispatch(updateBrand({ ...editingBrand, name: brandName }));
      setEditingBrand(null);
      setNewBrandName('');
      setOpen(false);
    }
  };

  const handleSave = (value: string) => {
    console.log('Received value from dialog:', value);
    if (editingBrand) {
      handleUpdateBrand(value);
    } else {
      handleAddBrand(value);
    }
  };

  const handleDeleteBrand = () => {
    if (brandToDelete) {
      dispatch(deleteBrand(brandToDelete));
      setBrandToDelete(null);
      setAlertOpen(false);
    }
  };

  const openDialog = (brand: Brand | null = null) => {
    if (brand) {
      setEditingBrand(brand);
      setNewBrandName(brand.name);
    }
    setOpen(true);
  };

  const closeDialog = () => {
    setEditingBrand(null);
    setNewBrandName('');
    setOpen(false);
  };

  const openAlertDialog = (id: string) => {
    setBrandToDelete(id);
    setAlertOpen(true);
  };

  const closeAlertDialog = () => {
    setBrandToDelete(null);
    setAlertOpen(false);
  };

  return (
    <Container className="edit-brands-form">
      <Typography variant="h5" component="h2" gutterBottom>
        Brands
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={() => openDialog()} style={{ marginBottom: '20px' }} disabled={!selectedCategoryId}>
        Add Brand
      </Button>
      <List>
        {brands.map((brand) => (
          <ListItem key={brand.id}>
            <ListItemText primary={brand.name} />
            <IconButton edge="end" aria-label="edit" onClick={() => openDialog(brand)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => openAlertDialog(brand.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <SimpleInputDialog
        open={open}
        title={editingBrand ? 'Edit Brand' : 'Add Brand'}
        fieldLabel="Brand Name"
        positiveButtonText={editingBrand ? 'Update' : 'Add'}
        negativeButtonText="Cancel"
        initialValue={newBrandName}
        onPositive={handleSave}
        onNegative={closeDialog}
      />

      <AlertDialog
        open={alertOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this brand?"
        positiveButtonText="Delete"
        negativeButtonText="Cancel"
        onConfirm={handleDeleteBrand}
        onCancel={closeAlertDialog}
      />
    </Container>
  );
};

export default EditBrandsForm;
