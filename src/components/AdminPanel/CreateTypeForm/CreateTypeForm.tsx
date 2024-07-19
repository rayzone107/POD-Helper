import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchCategories, fetchBrands, saveType, fetchTypeById } from '../../../redux/actions';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './CreateTypeForm.css';

import ColorVariantList from './ColorVariantList/ColorVariantList';
import SizeVariantList from './SizeVariantList/SizeVariantList';
import PrimaryVariant from './PrimaryVariant/PrimaryVariant';
import ColorVariantDialog from './ColorVariantList/ColorVariantDialog/ColorVariantDialog';
import SizeVariantDialog from './SizeVariantList/SizeVariantDialog/SizeVariantDialog';
import ReplaceImageDialog from './ColorVariantList/ReplaceImageDialog/ReplaceImageDialog';

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
  const [colorVariants, setColorVariants] = useState<any[]>([]);
  const [sizeVariants, setSizeVariants] = useState<any[]>([]);
  const [primaryLightVariant, setPrimaryLightVariant] = useState('');
  const [primaryDarkVariant, setPrimaryDarkVariant] = useState('');
  const [boundingOverlayBoxDimensions, setBoundingOverlayBoxDimensions] = useState({
    startX: 0,
    endX: 0,
    startY: 0,
    endY: 0,
  });

  const [openColorVariantDialog, setOpenColorVariantDialog] = useState(false);
  const [editingColorVariant, setEditingColorVariant] = useState<any | null>(null);

  const [openSizeVariantDialog, setOpenSizeVariantDialog] = useState(false);
  const [editingSizeVariant, setEditingSizeVariant] = useState<any | null>(null);

  const [openReplaceImageDialog, setOpenReplaceImageDialog] = useState(false);
  const [variantForImageReplacement, setVariantForImageReplacement] = useState<any | null>(null);

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

  const handleEditColorVariant = (variant: any) => {
    setEditingColorVariant(variant);
    setOpenColorVariantDialog(true);
  };

  const handleDeleteColorVariant = (id: string) => {
    setColorVariants(colorVariants.filter((variant) => variant.id !== id));
  };

  const handleSaveColorVariant = (variant: any) => {
    if (editingColorVariant) {
      // Update existing variant
      setColorVariants(colorVariants.map((v) => (v.id === editingColorVariant.id ? variant : v)));
    } else {
      // Add new variant
      setColorVariants([...colorVariants, { ...variant, id: uuidv4() }]);
    }
    setOpenColorVariantDialog(false);
  };

  const handleAddColorVariant = () => {
    setEditingColorVariant(null);
    setOpenColorVariantDialog(true);
  };

  const handleReplaceImage = (variant: any) => {
    setVariantForImageReplacement(variant);
    setOpenReplaceImageDialog(true);
  };

  const handleSaveImage = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setColorVariants((prevVariants) =>
        prevVariants.map((variant) =>
          variant.id === variantForImageReplacement.id ? { ...variant, imageUrl } : variant
        )
      );
      setOpenReplaceImageDialog(false);
    };
    reader.readAsDataURL(file);
  };

  const handleEditSizeVariant = (variant: any) => {
    setEditingSizeVariant(variant);
    setOpenSizeVariantDialog(true);
  };

  const handleDeleteSizeVariant = (id: string) => {
    setSizeVariants(sizeVariants.filter((variant) => variant.id !== id));
  };

  const handleSaveSizeVariant = (variant: any) => {
    if (editingSizeVariant) {
      // Update existing variant
      setSizeVariants(sizeVariants.map((v) => (v.id === editingSizeVariant.id ? variant : v)));
    } else {
      // Add new variant
      setSizeVariants([...sizeVariants, { ...variant, id: uuidv4() }]);
    }
    setOpenSizeVariantDialog(false);
  };

  const handleAddSizeVariant = () => {
    setEditingSizeVariant(null);
    setOpenSizeVariantDialog(true);
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
          onReplaceImage={handleReplaceImage}
          onAdd={handleAddColorVariant}
        />

        <SizeVariantList
          sizeVariants={sizeVariants}
          onEdit={handleEditSizeVariant}
          onDelete={handleDeleteSizeVariant}
          onAdd={handleAddSizeVariant}
        />

        <PrimaryVariant
          colorVariants={colorVariants}
          primaryLightVariant={primaryLightVariant}
          primaryDarkVariant={primaryDarkVariant}
          setPrimaryLightVariant={setPrimaryLightVariant}
          setPrimaryDarkVariant={setPrimaryDarkVariant}
          boundingOverlayBoxDimensions={boundingOverlayBoxDimensions}
          setBoundingOverlayBoxDimensions={setBoundingOverlayBoxDimensions}
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
      <ReplaceImageDialog
        open={openReplaceImageDialog}
        variantName={variantForImageReplacement?.name || ''}
        onClose={() => setOpenReplaceImageDialog(false)}
        onSave={handleSaveImage}
      />
    </Container>
  );
};

export default CreateTypeForm;
