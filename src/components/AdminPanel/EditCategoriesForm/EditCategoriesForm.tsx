import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../../redux/actions';
import { Category } from '../../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SimpleInputDialog from '../../common/SimpleInputDialog/SimpleInputDialog';
import AlertDialog from '../../common/AlertDialog/AlertDialog';
import './EditCategoriesForm.css';

const EditCategoriesForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const categories = useSelector((state: RootState) => state.categories.categories);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCategories()); // Fetch categories when the component mounts
  }, [dispatch]);

  const handleAddCategory = (categoryName: string) => {
    dispatch(addCategory({ id: '', name: categoryName }));
    setNewCategoryName('');
    setOpen(false);
  };

  const handleUpdateCategory = (categoryName: string) => {
    if (editingCategory) {
      dispatch(updateCategory({ ...editingCategory, name: categoryName }));
      setEditingCategory(null);
      setNewCategoryName('');
      setOpen(false);
    }
  };

  const handleSave = (value: string) => {
    if (editingCategory) {
      handleUpdateCategory(value);
    } else {
      handleAddCategory(value);
    }
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete));
      setCategoryToDelete(null);
      setAlertOpen(false);
    }
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

  const openAlertDialog = (id: string) => {
    setCategoryToDelete(id);
    setAlertOpen(true);
  };

  const closeAlertDialog = () => {
    setCategoryToDelete(null);
    setAlertOpen(false);
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
            <IconButton edge="end" aria-label="delete" onClick={() => openAlertDialog(category.id)}>
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

      <AlertDialog
        open={alertOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this category?"
        positiveButtonText="Delete"
        negativeButtonText="Cancel"
        onConfirm={handleDeleteCategory}
        onCancel={closeAlertDialog}
      />
    </Container>
  );
};

export default EditCategoriesForm;
