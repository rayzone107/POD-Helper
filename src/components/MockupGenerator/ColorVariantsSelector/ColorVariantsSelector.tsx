import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { setMockupSelectedColorVariants } from '../../../redux/slices/mockupGeneratorSlice';
import { FormControlLabel, Checkbox, Typography, Grid, Button } from '@mui/material';
import './ColorVariantsSelector.css';

const ColorVariantsSelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedType = useSelector((state: RootState) => state.mockupGenerator.selectedType);
  const selectedColorVariants = useSelector((state: RootState) => state.mockupGenerator.selectedColorVariants);

  const [userHasSelected, setUserHasSelected] = useState(false);

  useEffect(() => {
    if (selectedType && !userHasSelected) {
      const allVariantIds = selectedType.colorVariants.map(variant => variant.id);
      dispatch(setMockupSelectedColorVariants(allVariantIds));
    }
  }, [dispatch, selectedType, userHasSelected]);

  const handleCheckboxChange = (id: string) => {
    setUserHasSelected(true);
    if (selectedColorVariants.includes(id)) {
      dispatch(setMockupSelectedColorVariants(selectedColorVariants.filter((variant) => variant !== id)));
    } else {
      dispatch(setMockupSelectedColorVariants([...selectedColorVariants, id]));
    }
  };

  const handleSelectAll = () => {
    setUserHasSelected(true);
    const allVariantIds = selectedType?.colorVariants.map(variant => variant.id) || [];
    dispatch(setMockupSelectedColorVariants(allVariantIds));
  };

  const handleSelectNone = () => {
    setUserHasSelected(true);
    dispatch(setMockupSelectedColorVariants([]));
  };

  const handleSelectDark = () => {
    setUserHasSelected(true);
    const darkVariantIds = selectedType?.colorVariants.filter(variant => variant.isDark).map(variant => variant.id) || [];
    dispatch(setMockupSelectedColorVariants(darkVariantIds));
  };

  const handleSelectLight = () => {
    setUserHasSelected(true);
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
