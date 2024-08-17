import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { setMockupSelectedColorVariants } from '../../../redux/slices/mockupGeneratorSlice';
import { FormControlLabel, Checkbox, Typography, Grid, Button } from '@mui/material';
import './ColorVariantsSelector.css';

const ColorVariantsSelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedType = useSelector((state: RootState) => state.mockupGenerator.selectedType);
  const selectedColorVariants = useSelector((state: RootState) => state.mockupGenerator.selectedColorVariants);

  useEffect(() => {
    if (selectedType && selectedColorVariants.length === 0) {
      // Only set default selections if no variants are currently selected
      const allVariantIds = selectedType.colorVariants.map(variant => variant.id);
      dispatch(setMockupSelectedColorVariants(allVariantIds));
    }
  }, [dispatch, selectedType, selectedColorVariants.length]);

  const handleCheckboxChange = (id: string) => {
    if (selectedColorVariants.includes(id)) {
      dispatch(setMockupSelectedColorVariants(selectedColorVariants.filter((variant) => variant !== id)));
    } else {
      dispatch(setMockupSelectedColorVariants([...selectedColorVariants, id]));
    }
  };

  const handleSelectAll = () => {
    const allVariantIds = selectedType?.colorVariants.map(variant => variant.id) || [];
    dispatch(setMockupSelectedColorVariants(allVariantIds));
  };

  const handleSelectNone = () => {
    dispatch(setMockupSelectedColorVariants([]));
  };

  const handleSelectDark = () => {
    const darkVariantIds = selectedType?.colorVariants.filter(variant => variant.isDark).map(variant => variant.id) || [];
    dispatch(setMockupSelectedColorVariants(darkVariantIds));
  };

  const handleSelectLight = () => {
    const lightVariantIds = selectedType?.colorVariants.filter(variant => !variant.isDark).map(variant => variant.id) || [];
    dispatch(setMockupSelectedColorVariants(lightVariantIds));
  };

  return (
    <div className="color-variants-selector">
      <Typography variant="h6" gutterBottom>
        Select Color Variants
      </Typography>
      <div className="top-level-options">
        <Button variant="outlined" onClick={handleSelectAll}>Select All</Button>
        <Button variant="outlined" onClick={handleSelectNone}>Select None</Button>
        <Button variant="outlined" onClick={handleSelectDark}>Select Dark</Button>
        <Button variant="outlined" onClick={handleSelectLight}>Select Light</Button>
      </div>
      <Grid container spacing={2}>
        {selectedType?.colorVariants.map((variant) => (
          <Grid item key={variant.id} xs={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedColorVariants.includes(variant.id)}
                  onChange={() => handleCheckboxChange(variant.id)}
                />
              }
              label={
                <div className="color-variant-label">
                  <div
                    className="color-box"
                    style={{ backgroundColor: variant.hexColorCode }}
                  />
                  {variant.name}
                </div>
              }
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ColorVariantsSelector;
