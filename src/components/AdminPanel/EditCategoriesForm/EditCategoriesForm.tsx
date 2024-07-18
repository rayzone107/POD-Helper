import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../../redux/actions';
import { Category } from '../../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SimpleInputDialog from '../../common/SimpleInputDialog/SimpleInputDialog';
import './EditCategoriesForm.css';

const EditCategoriesForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const categories = useSelector((state: RootState) => state.categories.categories);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCategories()); // Fetch categories when the component mounts
  }, [dispatch]);

  const handleAddCategory = () => {
    dispatch(addCategory({ id: '', name: newCategoryName }));
    setNewCategoryName('');
    setOpen(false);
  };

  const handleUpdateCategory = () => {
    if (editingCategory) {
      dispatch(updateCategory({ ...editingCategory, name: newCategoryName }));
      setEditingCategory(null);
      setNewCategoryName('');
      setOpen(false);
    }
  };

  const handleSave = (value: string) => {
    if (editingCategory) {
      setNewCategoryName(value);
      handleUpdateCategory();
    } else {
      setNewCategoryName(value);
      handleAddCategory();
    }
  };

  const handleDeleteCategory = (id: string) => {
    dispatch(deleteCategory(id));
  };

  const openDialog = (category: Category | null = null) => {
    if (category) {
      setEditingCategory(category);
      setNewCategoryName(category.name);
    }
    setOpen(true);
  };

  const closeDialog = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setOpen(false);
  };

  return (
    <Container className="edit-categories-form">
      <Typography variant="h5" component="h2" gutterBottom>
        Categories
      </Typography>
      <Button variant="contained" color="primary" onClick={() => openDialog()} style={{ marginBottom: '20px' }}>
        Add Category
      </Button>
      <List>
        {categories.map((category) => (
          <ListItem key={category.id}>
            <ListItemText primary={category.name} />
            <IconButton edge="end" aria-label="edit" onClick={() => openDialog(category)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(category.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <SimpleInputDialog
        open={open}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        fieldLabel="Category Name"
        positiveButtonText={editingCategory ? 'Update' : 'Add'}
        negativeButtonText="Cancel"
        initialValue={newCategoryName}
        onPositive={handleSave}
        onNegative={closeDialog}
      />
    </Container>
  );
};

export default EditCategoriesForm;
