import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { setMockupSelectedColorVariants } from '../../../redux/slices/mockupGeneratorSlice';
import { FormControlLabel, Checkbox, Typography, Grid, Button, TextField } from '@mui/material';
import './ColorVariantsSelector.css';

const ColorVariantsSelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedType = useSelector((state: RootState) => state.mockupGenerator.selectedType);
  const selectedColorVariants = useSelector((state: RootState) => state.mockupGenerator.selectedColorVariants);

  const [userHasSelected, setUserHasSelected] = useState(false);
  const [inputData, setInputData] = useState('');

  useEffect(() => {
    if (selectedType && !userHasSelected) {
      const allVariantIds = selectedType.colorVariants.map(variant => variant.id);
      dispatch(setMockupSelectedColorVariants(allVariantIds));
    }
  }, [dispatch, selectedType, userHasSelected]);

  // Updated handleInputChange function
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pastedText = event.target.value.toLowerCase(); // Lowercase for case-insensitive matching
    setInputData(pastedText);

    if (selectedType) {
      // Check if each color variant's name exists in the pasted content
      const matchingVariantIds = selectedType.colorVariants
        .filter(variant => pastedText.includes(variant.name.toLowerCase()))
        .map(variant => variant.id);

      // Update selected color variants in Redux
      dispatch(setMockupSelectedColorVariants(matchingVariantIds));
      setUserHasSelected(true); // Mark as user-selected to prevent auto-selection
    }
  };

  const handleCheckboxChange = (id: string) => {
    setUserHasSelected(true);
    const updatedSelection = selectedColorVariants.includes(id)
      ? selectedColorVariants.filter((variant) => variant !== id)
      : [...selectedColorVariants, id];
    dispatch(setMockupSelectedColorVariants(updatedSelection));
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

  const totalColorVariants = selectedType?.colorVariants.length || 0;
  const selectedCount = selectedColorVariants.length;

  return (
    <div className="color-variants-selector">
      <Typography variant="h6" gutterBottom>
        Select Color Variants ({selectedCount} of {totalColorVariants} selected)
      </Typography>

      {/* Text field for pasting table data */}
      <TextField
        label="Paste color data here"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={inputData}
        onChange={handleInputChange}
        placeholder="Paste the table content here to auto-select colors"
        style={{ marginBottom: '20px' }}
      />

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
