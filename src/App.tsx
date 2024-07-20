import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Toolbar from './components/common/Toolbar/Toolbar';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import MockupPage from './pages/MockupPage';
import PricingPage from './pages/PricingPage';
import CreateTypePage from './pages/CreateTypePage';
import EditCategoriesPage from './pages/EditCategoriesPage';
import PricingCalculatorPage from './pages/PricingCalculatorPage';
import MockupGeneratorPage from './pages/MockupGeneratorPage';
import GeneratedMockupsPage from './pages/GeneratedMockupsPage';
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
          <Route path="/pricing-calculator" element={<PricingCalculatorPage />} />
          <Route path="/mockup-generator" element={<MockupGeneratorPage />} />
          <Route path="/generated-mockups" element={<GeneratedMockupsPage />} />
          <Route path="/create-type" element={<CreateTypePage mode="create" />} />
          <Route path="/edit-type/:id" element={<CreateTypePage mode="edit" />} />
          <Route path="/edit-categories" element={<EditCategoriesPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
