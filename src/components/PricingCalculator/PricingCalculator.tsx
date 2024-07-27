import React from 'react';
import { Grid, TextField, Checkbox, FormControlLabel, Button, Typography, Divider, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { calculatePrices } from '../../redux/actions';
import { setSelectedCategory, setSelectedBrand, setSelectedType, setProfitPercentage, setRunAdsOnEtsy, setDiscountPercentageEtsy, setDiscountPercentageShopify } from '../../redux/slices/pricingCalculatorSlice';
import PricingTable from './PricingTable/PricingTable';
import { APP_PADDING } from '../../utils/constants';
import TypeSelector from '../common/TypeSelector/TypeSelector';
import './PricingCalculator.css';
import { Type } from '../../types';

const PricingCalculator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const selectedCategory = useSelector((state: RootState) => state.pricingCalculator.selectedCategory);
  const selectedBrand = useSelector((state: RootState) => state.pricingCalculator.selectedBrand);
  const selectedType = useSelector((state: RootState) => state.pricingCalculator.selectedType);
  const profitPercentage = useSelector((state: RootState) => state.pricingCalculator.profitPercentage);
  const runAdsOnEtsy = useSelector((state: RootState) => state.pricingCalculator.runAdsOnEtsy);
  const discountPercentageEtsy = useSelector((state: RootState) => state.pricingCalculator.discountPercentageEtsy);
  const discountPercentageShopify = useSelector((state: RootState) => state.pricingCalculator.discountPercentageShopify);
  const etsyPrices = useSelector((state: RootState) => state.pricingCalculator.etsyPrices);
  const shopifyPrices = useSelector((state: RootState) => state.pricingCalculator.shopifyPrices);

  const handleCalculate = () => {
    dispatch(calculatePrices());
  };

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category));
  };

  const handleBrandChange = (brand: string) => {
    dispatch(setSelectedBrand(brand));
  };

  const handleTypeChange = (type: Type | null) => {
    dispatch(setSelectedType(type));
  };

  return (
    <Container style={{ padding: APP_PADDING }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pricing Calculator
      </Typography>
      <TypeSelector
        selectedCategory={selectedCategory}
        selectedBrand={selectedBrand}
        selectedType={selectedType}
        onCategoryChange={handleCategoryChange}
        onBrandChange={handleBrandChange}
        onTypeChange={handleTypeChange}
      />
      <Divider style={{ margin: '20px 0', width: '100%' }} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h6" component="h2" gutterBottom>
                Etsy
              </Typography>
              <TextField
                label="Profit % Expected"
                variant="outlined"
                type="number"
                fullWidth
                className="input-field"
                value={profitPercentage}
                onChange={(e) => dispatch(setProfitPercentage(parseFloat(e.target.value)))}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={runAdsOnEtsy}
                    onChange={(e) => dispatch(setRunAdsOnEtsy(e.target.checked))}
                  />
                }
                label="Running Ads on Etsy"
              />
              <TextField
                label="Discount % on Etsy"
                variant="outlined"
                type="number"
                fullWidth
                value={discountPercentageEtsy}
                onChange={(e) => dispatch(setDiscountPercentageEtsy(parseFloat(e.target.value)))}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" component="h2" gutterBottom>
                Shopify
              </Typography>
              <TextField
                label="Profit % Expected"
                variant="outlined"
                type="number"
                fullWidth
                value={profitPercentage}
                onChange={(e) => dispatch(setProfitPercentage(parseFloat(e.target.value)))}
              />
              <TextField
                label="Discount % on Shopify"
                variant="outlined"
                type="number"
                fullWidth
                value={discountPercentageShopify}
                onChange={(e) => dispatch(setDiscountPercentageShopify(parseFloat(e.target.value)))}
                style={{ marginTop: '10px' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCalculate}
            disabled={!selectedType}
          >
            Calculate Prices
          </Button>
        </Grid>
        <Divider style={{ margin: '20px 0', width: '100%' }} />
        <Grid item xs={12}>
          <Typography variant="h6" component="h2" gutterBottom>
            Etsy Prices
          </Typography>
          <PricingTable prices={etsyPrices} />
        </Grid>
        <Divider style={{ margin: '20px 0', width: '100%' }} />
        <Grid item xs={12}>
          <Typography variant="h6" component="h2" gutterBottom>
            Shopify Prices
          </Typography>
          <PricingTable prices={shopifyPrices} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PricingCalculator;
