import React, { useEffect } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Checkbox, FormControlLabel, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchCategories, fetchAllBrands, fetchTypes, calculatePrices } from '../../redux/actions';
import { setSelectedCategory, setSelectedBrand, setSelectedType, setProfitPercentage, setRunAdsOnEtsy, setDiscountPercentageEtsy, setDiscountPercentageShopify } from '../../redux/slices/pricingCalculatorSlice';
import PricingTable from './PricingTable/PricingTable';

const PricingCalculator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector((state: RootState) => state.categories.categories);
  const brands = useSelector((state: RootState) => state.brands.brands);
  const types = useSelector((state: RootState) => state.types.types);
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
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
    dispatch(fetchTypes());
  }, [dispatch]);

  const handleCalculate = () => {
    dispatch(calculatePrices());
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Brand</InputLabel>
          <Select
            value={selectedBrand}
            onChange={(e) => dispatch(setSelectedBrand(e.target.value))}
            disabled={!selectedCategory}
          >
            {brands
              .filter((brand) => brand.categoryId === selectedCategory)
              .map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={selectedType ? selectedType.id : ''}
            onChange={(e) =>
              dispatch(setSelectedType(types.find((type) => type.id === e.target.value) || null))
            }
            disabled={!selectedBrand}
          >
            {types
              .filter((type) => type.categoryId === selectedCategory && type.brandId === selectedBrand)
              .map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
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
      <Grid item xs={6}>
        <Typography variant="h6" component="h2" gutterBottom>
          Etsy Prices
        </Typography>
        <PricingTable prices={etsyPrices} />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6" component="h2" gutterBottom>
          Shopify Prices
        </Typography>
        <PricingTable prices={shopifyPrices} />
      </Grid>
    </Grid>
  );
};

export default PricingCalculator;
