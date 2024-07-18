import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchCategories, fetchBrands, saveType, fetchTypeById } from '../../../redux/actions';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ColorVariantList from './ColorVariantList/ColorVariantList';
import SizeVariantList from './SizeVariantList/SizeVariantList';
import ColorVariantDialog from './ColorVariantList/ColorVariantDialog/ColorVariantDialog';
import SizeVariantDialog from './SizeVariantList/SizeVariantDialog/SizeVariantDialog';
import PrimaryVariant from './PrimaryVariant/PrimaryVariant';
import { ColorVariant, SizeVariant } from '../../../types';
import './CreateTypeForm.css';

interface CreateTypeFormProps {
  mode: 'create' | 'edit';
}

const CreateTypeForm: React.FC<CreateTypeFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector((state: RootState) => state.categories.categories);
  const brands = useSelector((state: RootState) => state.brands.brands);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
  const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([]);
  const [primaryLightVariant, setPrimaryLightVariant] = useState('');
  const [primaryDarkVariant, setPrimaryDarkVariant] = useState('');
  const [boundingOverlayBoxDimensions, setBoundingOverlayBoxDimensions] = useState({
    startX: 0,
    endX: 0,
    startY: 0,
    endY: 0,
  });

  const [openColorVariantDialog, setOpenColorVariantDialog] = useState(false);
  const [openSizeVariantDialog, setOpenSizeVariantDialog] = useState(false);
  const [editingColorVariant, setEditingColorVariant] = useState<ColorVariant | null>(null);
  const [editingSizeVariant, setEditingSizeVariant] = useState<SizeVariant | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
    if (mode === 'edit' && id) {
      dispatch(fetchTypeById(id)).then((type) => {
        setName(type.name);
        setCategoryId(type.categoryId);
        setBrandId(type.brandId);
        setColorVariants(type.colorVariants);
        setSizeVariants(type.sizeVariants);
        setPrimaryLightVariant(type.primaryLightVariant);
        setPrimaryDarkVariant(type.primaryDarkVariant);
        setBoundingOverlayBoxDimensions(type.boundingOverlayBoxDimensions);
      });
    }
  }, [dispatch, mode, id]);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchBrands(categoryId));
    }
  }, [categoryId, dispatch]);

  const handleSave = async () => {
    const typeId = mode === 'edit' ? id! : uuidv4(); // Generate unique ID for new type or use existing ID for edit

    const updatedColorVariants = colorVariants.map((variant) => ({
      ...variant,
      id: variant.id || uuidv4(),
    }));

    const updatedSizeVariants = sizeVariants.map((variant) => ({
      ...variant,
      id: variant.id || uuidv4(),
    }));

    dispatch(
      saveType({
        id: typeId,
        name,
        categoryId,
        brandId,
        primaryLightVariant,
        primaryDarkVariant,
        boundingOverlayBoxDimensions,
        colorVariants: updatedColorVariants,
        sizeVariants: updatedSizeVariants,
      })
    );
  };

  const handleAddColorVariant = () => {
    setEditingColorVariant(null);
    setOpenColorVariantDialog(true);
  };

  const handleEditColorVariant = (variant: ColorVariant) => {
    setEditingColorVariant(variant);
    setOpenColorVariantDialog(true);
  };

  const handleSaveColorVariant = (variant: ColorVariant) => {
    setColorVariants((prevVariants) =>
      editingColorVariant
        ? prevVariants.map((v) => (v.id === variant.id ? variant : v))
        : [...prevVariants, variant]
    );
    setOpenColorVariantDialog(false);
  };

  const handleDeleteColorVariant = (id: string) => {
    setColorVariants((prevVariants) => prevVariants.filter((v) => v.id !== id));
  };

  const handleAddSizeVariant = () => {
    setEditingSizeVariant(null);
    setOpenSizeVariantDialog(true);
  };

  const handleEditSizeVariant = (variant: SizeVariant) => {
    setEditingSizeVariant(variant);
    setOpenSizeVariantDialog(true);
  };

  const handleSaveSizeVariant = (variant: SizeVariant) => {
    setSizeVariants((prevVariants) =>
      editingSizeVariant
        ? prevVariants.map((v) => (v.id === variant.id ? variant : v))
        : [...prevVariants, variant]
    );
    setOpenSizeVariantDialog(false);
  };

  const handleDeleteSizeVariant = (id: string) => {
    setSizeVariants((prevVariants) => prevVariants.filter((v) => v.id !== id));
  };

  return (
    <Container className="create-type-form">
      <Typography variant="h5" component="h2" className="create-type-form-title">
        {mode === 'edit' ? 'Edit Type' : 'Create Type'}
      </Typography>
      <form>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={!categoryId}>
          <InputLabel>Brand</InputLabel>
          <Select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
            {brands
              .filter((brand) => brand.categoryId === categoryId)
              .map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          label="Type Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <ColorVariantList
          colorVariants={colorVariants}
          onEdit={handleEditColorVariant}
          onDelete={handleDeleteColorVariant}
        />
        <Button variant="contained" color="primary" onClick={handleAddColorVariant}>
          Add Color Variant
        </Button>

        <SizeVariantList
          sizeVariants={sizeVariants}
          onEdit={handleEditSizeVariant}
          onDelete={handleDeleteSizeVariant}
        />
        <Button variant="contained" color="primary" onClick={handleAddSizeVariant}>
          Add Size Variant
        </Button>

        <PrimaryVariant
          colorVariants={colorVariants}
          primaryLightVariant={primaryLightVariant}
          primaryDarkVariant={primaryDarkVariant}
          setPrimaryLightVariant={setPrimaryLightVariant}
          setPrimaryDarkVariant={setPrimaryDarkVariant}
        />

        <Typography variant="h6" component="h3" className="create-type-form-title">
          Bounding Overlay Box Dimensions
        </Typography>
        <TextField
          label="Start X"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={boundingOverlayBoxDimensions.startX}
          onChange={(e) =>
            setBoundingOverlayBoxDimensions((prev) => ({
              ...prev,
              startX: parseInt(e.target.value, 10),
            }))
          }
        />
        <TextField
          label="End X"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={boundingOverlayBoxDimensions.endX}
          onChange={(e) =>
            setBoundingOverlayBoxDimensions((prev) => ({
              ...prev,
              endX: parseInt(e.target.value, 10),
            }))
          }
        />
        <TextField
          label="Start Y"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={boundingOverlayBoxDimensions.startY}
          onChange={(e) =>
            setBoundingOverlayBoxDimensions((prev) => ({
              ...prev,
              startY: parseInt(e.target.value, 10),
            }))
          }
        />
        <TextField
          label="End Y"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={boundingOverlayBoxDimensions.endY}
          onChange={(e) =>
            setBoundingOverlayBoxDimensions((prev) => ({
              ...prev,
              endY: parseInt(e.target.value, 10),
            }))
          }
        />

        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </form>

      <ColorVariantDialog
        open={openColorVariantDialog}
        variant={editingColorVariant}
        onClose={() => setOpenColorVariantDialog(false)}
        onSave={handleSaveColorVariant}
      />
      <SizeVariantDialog
        open={openSizeVariantDialog}
        variant={editingSizeVariant}
        onClose={() => setOpenSizeVariantDialog(false)}
        onSave={handleSaveSizeVariant}
      />
    </Container>
  );
};

export default CreateTypeForm;
