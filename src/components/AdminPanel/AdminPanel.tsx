import React from 'react';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const items = useSelector((state: RootState) => state.items.items);

  const handleAddType = () => {
    navigate('/create-type');
  };

  const handleEditCategoriesAndBrands = () => {
    navigate('/edit-categories');
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
              <TableCell>Name</TableCell>
              <TableCell>Variant Count</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No data yet</TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.variantCount}</TableCell>
                  <TableCell>
                    {/* Add Edit functionality later */}
                  </TableCell>
                  <TableCell>
                    {/* Add Delete functionality later */}
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
    </Container>
  );
};

export default AdminPanel;
