import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Toolbar from './components/common/Toolbar';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import MockupPage from './pages/MockupPage';
import PricingPage from './pages/PricingPage';
import CreateTypePage from './pages/CreateTypePage';
import EditTypePage from './pages/EditTypePage';
import EditCategoriesPage from './pages/EditCategoriesPage';
import { CssBaseline, Container } from '@mui/material';
import { styled } from '@mui/system';

const ToolbarOffset = styled('div')({
  height: '64px', // Manually setting the height
});

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Toolbar />
      <ToolbarOffset />
      <Container>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/mockup" element={<MockupPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/create-type" element={<CreateTypePage />} />
          <Route path="/edit-type" element={<EditTypePage />} />
          <Route path="/edit-categories" element={<EditCategoriesPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
