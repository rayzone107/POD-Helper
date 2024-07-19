import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
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

  const columns: GridColDef[] = [
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'brand', headerName: 'Brand', width: 150 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'variantCount', headerName: 'Variant Count', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => navigate(`/edit-type/${params.row.id}`)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = types.map((type) => ({
    id: type.id,
    category: getCategoryName(type.categoryId),
    brand: getBrandName(type.brandId),
    name: type.name,
    variantCount: type.colorVariants.length + type.sizeVariants.length,
  }));

  return (
    <Container className="admin-panel">
      <Typography variant="h4" component="h1" className="admin-panel-title">
        Admin Panel
      </Typography>
      <Button variant="contained" color="primary" onClick={handleEditCategoriesAndBrands} style={{ marginBottom: '20px' }}>
        Edit Categories and Brands
      </Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationModel={{ pageSize: 5, page: 0 }}
          checkboxSelection
        />
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
