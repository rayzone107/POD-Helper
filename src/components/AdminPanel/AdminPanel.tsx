// src/components/AdminPanel/AdminPanel.tsx

import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, TextField, InputAdornment, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchTypes, fetchCategories, fetchAllBrands, deleteType } from '../../redux/actions';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import AlertDialog from '../common/AlertDialog/AlertDialog';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const types = useSelector((state: RootState) => state.types.types);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const brands = useSelector((state: RootState) => state.brands.brands);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredTypes, setFilteredTypes] = useState(types);
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);
  const [showMissingShipping, setShowMissingShipping] = useState<boolean>(false); // New filter state

  useEffect(() => {
    dispatch(fetchTypes());
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  // Function to check if any size variant is missing shipping cost
  const hasMissingShippingCost = (type: any) => {
    return type.sizeVariants.some((variant: any) => !variant.shippingCost || variant.shippingCost === 0);
  };

  useEffect(() => {
    // Filtering logic based on search term and missing shipping cost
    const filtered = types.filter(type => {
      const matchesSearch = [getCategoryName(type.categoryId), getBrandName(type.brandId), type.name]
        .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesShippingFilter = !showMissingShipping || hasMissingShippingCost(type);

      return matchesSearch && matchesShippingFilter;
    });

    setFilteredTypes(filtered);
  }, [searchTerm, types, showMissingShipping]);

  const handleAddType = () => {
    navigate('/create-type');
  };

  const handleEditCategoriesAndBrands = () => {
    navigate('/edit-categories');
  };

  const handleEditSettings = () => {
    navigate('/admin/settings');
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find(brand => brand.id === brandId);
    return brand ? brand.name : 'Unknown Brand';
  };

  const handleDelete = (id: string) => {
    setTypeToDelete(id);
    setAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (typeToDelete) {
      dispatch(deleteType(typeToDelete));
    }
    setAlertOpen(false);
    setTypeToDelete(null);
  };

  const handleCancelDelete = () => {
    setAlertOpen(false);
    setTypeToDelete(null);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const columns: GridColDef[] = [
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'brand', headerName: 'Brand', width: 250 },
    { field: 'name', headerName: 'Name', width: 250 },
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
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = filteredTypes.map(type => ({
    id: type.id,
    category: getCategoryName(type.categoryId),
    brand: getBrandName(type.brandId),
    name: type.name,
    variantCount: type.colorVariants.length + type.sizeVariants.length,
  }));

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setPage(newModel.page);
    setPageSize(newModel.pageSize);
  };

  return (
    <Container className="admin-panel">
      <Typography variant="h4" component="h1" className="admin-panel-title">
        Admin Panel
      </Typography>
      <div className="button-container" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleEditCategoriesAndBrands}>
          Edit Categories and Brands
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddType}>
          Add Type
        </Button>
        <Button variant="contained" color="primary" onClick={handleEditSettings}>
          Edit Settings
        </Button>
      </div>
      <div className="search-bar-container">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search by category, brand, or name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <FormControlLabel
        control={
          <Checkbox
            checked={showMissingShipping}
            onChange={(e) => setShowMissingShipping(e.target.checked)}
          />
        }
        label="Show only items with missing shipping cost"
        className="form-control-label"
      />
      <div className="table-container">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          pagination
          paginationModel={{ pageSize, page }}
          onPaginationModelChange={handlePaginationModelChange}
          checkboxSelection
        />
      </div>
      <AlertDialog
        open={alertOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this type?"
        positiveButtonText="Delete"
        negativeButtonText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Container>
  );
};

export default AdminPanel;
