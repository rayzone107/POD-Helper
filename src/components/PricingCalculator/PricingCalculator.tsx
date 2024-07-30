// src/components/PricingCalculator/PricingCalculator.tsx
import React, { useEffect } from 'react';
import { Grid, TextField, Checkbox, FormControlLabel, Button, Typography, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchCategories, fetchAllBrands, fetchTypes, calculatePrices } from '../../redux/actions';
import { setSelectedCategory, setSelectedBrand, setSelectedType, setProfitPercentage, setRunAdsOnEtsy, setDiscountPercentageEtsy, setDiscountPercentageShopify, resetPrices } from '../../redux/slices/pricingCalculatorSlice';
import PricingTable from './PricingTable/PricingTable';
import TypeSelector from '../common/TypeSelector/TypeSelector';
import { APP_PADDING } from '../../utils/constants';
import { Type } from '../../types';
import { fetchSettings, AppSettings } from '../../services/settingsService';
import './PricingCalculator.css';

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

  useEffect(() => {
    const fetchInitialData = async () => {
      dispatch(fetchCategories());
      dispatch(fetchAllBrands());
      dispatch(fetchTypes());
      
      try {
        const settings: AppSettings = await fetchSettings();
        dispatch(setProfitPercentage(settings.defaultProfitPercentage));
        dispatch(setDiscountPercentageEtsy(settings.defaultEtsySalePercentage));
        dispatch(setDiscountPercentageShopify(settings.defaultShopifySalePercentage));
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    fetchInitialData();
  }, [dispatch]);

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category));
    dispatch(resetPrices());
  };

  const handleBrandChange = (brand: string) => {
    dispatch(setSelectedBrand(brand));
    dispatch(resetPrices());
  };

  const handleTypeChange = (type: Type | null) => {
    dispatch(setSelectedType(type));
    dispatch(resetPrices());
  };

  const handleCalculate = () => {
    dispatch(calculatePrices());
  };

  return (
    <div className="PricingCalculator" style={{ padding: APP_PADDING }}>
      <TypeSelector
        selectedCategory={selectedCategory}
        selectedBrand={selectedBrand}
        selectedType={selectedType}
        onCategoryChange={handleCategoryChange}
        onBrandChange={handleBrandChange}
        onTypeChange={handleTypeChange}
      />
      {selectedType && (
        <Grid className='margin-top' container spacing={3}>
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
                  className='input-field'
                  value={profitPercentage}
                  onChange={(e) => dispatch(setProfitPercentage(parseFloat(e.target.value)))}
                />
                <TextField
                  label="Discount % on Etsy"
                  variant="outlined"
                  type="number"
                  fullWidth
                  className='input-field'
                  value={discountPercentageEtsy}
                  onChange={(e) => dispatch(setDiscountPercentageEtsy(parseFloat(e.target.value)))}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={runAdsOnEtsy}
                      onChange={(e) => dispatch(setRunAdsOnEtsy(e.target.checked))}
                    />
                  }
                  label="Running Ads on Etsy"
                  className="form-control-label"
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
                  className='input-field'
                  value={profitPercentage}
                  onChange={(e) => dispatch(setProfitPercentage(parseFloat(e.target.value)))}
                />
                <TextField
                  label="Discount % on Shopify"
                  variant="outlined"
                  type="number"
                  fullWidth
                  className='input-field'
                  value={discountPercentageShopify}
                  onChange={(e) => dispatch(setDiscountPercentageShopify(parseFloat(e.target.value)))}
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
      )}
    </div>
  );
};

export default PricingCalculator;
