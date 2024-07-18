import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../../redux/actions';
import { Category } from '../../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './EditCategoriesForm.css';

const EditCategoriesForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const categories = useSelector((state: RootState) => state.categories.categories);
  const dispatch = useDispatch<AppDispatch>();

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

      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={editingCategory ? handleUpdateCategory : handleAddCategory} color="primary">
            {editingCategory ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditCategoriesForm;
