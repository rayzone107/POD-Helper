import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setMockupSelectedColorVariants } from '../../redux/slices/mockupGeneratorSlice';
import { FormControlLabel, Checkbox, Typography, Grid } from '@mui/material';
import './ColorVariantsSelector.css';

const ColorVariantsSelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedType = useSelector((state: RootState) => state.mockupGenerator.selectedType);
  const selectedColorVariants = useSelector((state: RootState) => state.mockupGenerator.selectedColorVariants);

  React.useEffect(() => {
    if (selectedType) {
      const allVariantIds = selectedType.colorVariants.map(variant => variant.id);
      dispatch(setMockupSelectedColorVariants(allVariantIds));
    }
  }, [dispatch, selectedType]);

  const handleCheckboxChange = (id: string) => {
    if (selectedColorVariants.includes(id)) {
      dispatch(setMockupSelectedColorVariants(selectedColorVariants.filter((variant) => variant !== id)));
    } else {
      dispatch(setMockupSelectedColorVariants([...selectedColorVariants, id]));
    }
  };

  return (
    <div className="color-variants-selector">
      <Typography variant="h6" gutterBottom>
        Select Color Variants
      </Typography>
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
