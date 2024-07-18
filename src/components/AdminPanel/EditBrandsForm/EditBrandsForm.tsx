import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchBrands, addBrand, updateBrand, deleteBrand } from '../../../redux/actions';
import { Category, Brand } from '../../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SimpleInputDialog from '../../common/SimpleInputDialog/SimpleInputDialog';
import './EditBrandsForm.css';

const EditBrandsForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const categories = useSelector((state: RootState) => state.categories.categories);
  const brands = useSelector((state: RootState) => state.brands.brands);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchBrands(selectedCategoryId));
    }
  }, [selectedCategoryId, dispatch]);

  const handleAddBrand = () => {
    dispatch(addBrand({ id: '', name: newBrandName, categoryId: selectedCategoryId }));
    setNewBrandName('');
    setOpen(false);
  };

  const handleUpdateBrand = () => {
    if (editingBrand) {
      dispatch(updateBrand({ ...editingBrand, name: newBrandName }));
      setEditingBrand(null);
      setNewBrandName('');
      setOpen(false);
    }
  };

  const handleSave = (value: string) => {
    if (editingBrand) {
      setNewBrandName(value);
      handleUpdateBrand();
    } else {
      setNewBrandName(value);
      handleAddBrand();
    }
  };

  const handleDeleteBrand = (id: string) => {
    dispatch(deleteBrand(id));
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
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteBrand(brand.id)}>
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
    </Container>
  );
};

export default EditBrandsForm;
