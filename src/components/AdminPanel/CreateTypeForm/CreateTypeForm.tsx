import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchCategories, fetchBrands, saveType, fetchTypeById } from '../../../redux/actions';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './CreateTypeForm.css';

import ColorVariantList from './ColorVariantList/ColorVariantList';
import SizeVariantList from './SizeVariantList/SizeVariantList';
import PrimaryVariant from './PrimaryVariant/PrimaryVariant';
import ColorVariantDialog from './ColorVariantList/ColorVariantDialog/ColorVariantDialog';
import SizeVariantDialog from './SizeVariantList/SizeVariantDialog/SizeVariantDialog';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../services/firebaseConfig';

interface CreateTypeFormProps {
  mode: 'create' | 'edit';
}

const CreateTypeForm: React.FC<CreateTypeFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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
    setSaving(true);
    const typeId = mode === 'edit' ? id! : uuidv4();

    const updatedColorVariants = colorVariants.map((variant) => ({
      ...variant,
      id: variant.id || uuidv4(),
    }));

    const updatedSizeVariants = sizeVariants.map((variant) => ({
      ...variant,
      id: variant.id || uuidv4(),
      shippingCost: variant.shippingCost || 0,  // Ensure shippingCost is handled
    }));

    const uploadImage = async (variant: any) => {
      if (variant.imageFile) {
        const storageRef = ref(storage, `types/${typeId}/variants/${variant.id}`);
        await uploadBytes(storageRef, variant.imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        return { ...variant, imageUrl, imageFile: null };
      }
      return variant;
    };

    const updatedColorVariantsWithUrls = await Promise.all(updatedColorVariants.map(uploadImage));

    dispatch(
      saveType({
        id: typeId,
        name,
        categoryId,
        brandId,
        primaryLightVariant,
        primaryDarkVariant,
        boundingOverlayBoxDimensions,
        colorVariants: updatedColorVariantsWithUrls,
        sizeVariants: updatedSizeVariants,
      })
    ).then(() => {
      setSaving(false);
      setSuccess(true);
      if (mode === 'create') {
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      }
    });
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
      setColorVariants(colorVariants.map((v) => (v.id === editingColorVariant.id ? variant : v)));
    } else {
      setColorVariants([...colorVariants, { ...variant, id: uuidv4() }]);
    }
    setOpenColorVariantDialog(false);
  };

  const handleBulkAddColorVariants = (newVariants: any[]) => {
    setColorVariants([...colorVariants, ...newVariants]);
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
      setSizeVariants(sizeVariants.map((v) => (v.id === editingSizeVariant.id ? variant : v)));
    } else {
      setSizeVariants([...sizeVariants, { ...variant, id: uuidv4() }]);
    }
    setOpenSizeVariantDialog(false);
  };

  return (
    <Container className="create-type-form">
      <Typography variant="h5" component="h2" className="create-type-form-title">
        {mode === 'edit' ? 'Edit Type' : 'Create Type'}
      </Typography>
      {saving && (
        <div className="saving-overlay">
          <CircularProgress />
        </div>
      )}
      <form>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={saving}>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={!categoryId || saving}>
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
          disabled={saving}
        />

        <ColorVariantList
          colorVariants={colorVariants}
          onEdit={handleEditColorVariant}
          onDelete={handleDeleteColorVariant}
          onAdd={() => setOpenColorVariantDialog(true)}
          onBulkAdd={handleBulkAddColorVariants}
        />

        <SizeVariantList
          sizeVariants={sizeVariants}
          onEdit={handleEditSizeVariant}
          onDelete={handleDeleteSizeVariant}
          onAdd={() => setOpenSizeVariantDialog(true)}
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

        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
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
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success">
          Type saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateTypeForm;
