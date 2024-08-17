import { AppThunk, AppThunkDispatch, RootState } from './store';
import { setCategories, addCategory as addCategoryAction, updateCategory as updateCategoryAction, deleteCategory as deleteCategoryAction } from './slices/categoriesSlice';
import { setBrands, addBrand as addBrandAction, updateBrand as updateBrandAction, deleteBrand as deleteBrandAction } from './slices/brandsSlice';
import { setTypes, deleteType as deleteTypeAction } from './slices/typesSlice';
import { setEtsyPrices, setShopifyPrices } from './slices/pricingCalculatorSlice';
import { fetchCategoriesFromFirestore, fetchBrandsFromFirestore, fetchAllBrandsFromFirestore, fetchTypesFromFirestore } from '../services/firestoreService';
import { Category, Brand, Type, PricingInfo } from '../types';
import { db, collection, doc, setDoc, deleteDoc, getDoc, ref, deleteObject, storage } from '../services/firebaseConfig';
import { calculateEtsyPrice, calculateShopifyPrice, calculateEtsyPriceWithoutProfit, calculateShopifyPriceWithoutProfit } from '../services/pricingCalculatorService';
import { setMockupSelectedCategory, setMockupSelectedBrand, setMockupSelectedType, setMockupLightVariantOverlay, setMockupDarkVariantOverlay, setMockupOverlayPosition, setMockupSelectedColorVariants } from './slices/mockupGeneratorSlice';

export const fetchCategories = (): AppThunk => async (dispatch: AppThunkDispatch) => {
  const categories: Category[] = await fetchCategoriesFromFirestore();
  dispatch(setCategories(categories));
};

export const fetchBrands = (categoryId: string): AppThunk => async (dispatch: AppThunkDispatch) => {
  const brands: Brand[] = await fetchBrandsFromFirestore(categoryId);
  dispatch(setBrands(brands));
};

export const fetchAllBrands = (): AppThunk => async (dispatch: AppThunkDispatch) => {
  const brands: Brand[] = await fetchAllBrandsFromFirestore();
  dispatch(setBrands(brands));
};

export const fetchTypes = (): AppThunk => async (dispatch: AppThunkDispatch) => {
  const types: Type[] = await fetchTypesFromFirestore();
  dispatch(setTypes(types));
};

export const addCategory = (category: Category): AppThunk => async (dispatch: AppThunkDispatch) => {
  const categoryRef = doc(collection(db, 'categories'));
  await setDoc(categoryRef, { name: category.name });
  category.id = categoryRef.id;
  dispatch(addCategoryAction(category));
};

export const updateCategory = (category: Category): AppThunk => async (dispatch: AppThunkDispatch) => {
  const categoryRef = doc(db, 'categories', category.id);
  await setDoc(categoryRef, { name: category.name }, { merge: true });
  dispatch(updateCategoryAction(category));
};

export const deleteCategory = (id: string): AppThunk => async (dispatch: AppThunkDispatch) => {
  const categoryRef = doc(db, 'categories', id);
  await deleteDoc(categoryRef);
  dispatch(deleteCategoryAction(id));
};

export const addBrand = (brand: Brand): AppThunk => async (dispatch: AppThunkDispatch) => {
  console.log('Action adding brand:', brand);
  const brandRef = doc(collection(db, 'brands'));
  await setDoc(brandRef, { name: brand.name, categoryId: brand.categoryId });
  brand.id = brandRef.id;
  dispatch(addBrandAction(brand));
};

export const updateBrand = (brand: Brand): AppThunk => async (dispatch: AppThunkDispatch) => {
  const brandRef = doc(db, 'brands', brand.id);
  await setDoc(brandRef, { name: brand.name, categoryId: brand.categoryId }, { merge: true });
  dispatch(updateBrandAction(brand));
};

export const deleteBrand = (id: string): AppThunk => async (dispatch: AppThunkDispatch) => {
  const brandRef = doc(db, 'brands', id);
  await deleteDoc(brandRef);
  dispatch(deleteBrandAction(id));
};

export const fetchTypeById = (id: string): AppThunk<Promise<Type>> => async (dispatch: AppThunkDispatch) => {
  const typeRef = doc(db, 'types', id);
  const docSnapshot = await getDoc(typeRef);
  return { id: docSnapshot.id, ...docSnapshot.data() } as Type;
};

export const saveType = (type: Type): AppThunk<Promise<void>> => async (dispatch: AppThunkDispatch) => {
  const typeRef = doc(db, 'types', type.id);
  await setDoc(typeRef, type);
};

export const deleteType = (id: string): AppThunk => async (dispatch: AppThunkDispatch) => {
  const typeRef = doc(db, 'types', id);
  const typeSnapshot = await getDoc(typeRef);
  const typeData = typeSnapshot.data();

  if (typeData) {
    const storageRefs = typeData.colorVariants.map((variant: any) => ref(storage, `types/${id}/variants/${variant.id}`));
    await Promise.all(storageRefs.map((storageRef: any) => deleteObject(storageRef)));
  }

  await deleteDoc(typeRef);
  dispatch(deleteTypeAction(id));
};

export const calculatePrices = (): AppThunk => (dispatch, getState) => {
  const state: RootState = getState();
  const { selectedType, profitPercentageEtsy, profitPercentageShopify, runAdsOnEtsy, discountPercentageEtsy, discountPercentageShopify } = state.pricingCalculator;

  if (selectedType) {
    const etsyPrices: Record<string, PricingInfo> = {};
    const shopifyPrices: Record<string, PricingInfo> = {};

    // Find the cheapest variant
    const cheapestVariant = selectedType.sizeVariants.reduce((prev, curr) => (prev.price < curr.price ? prev : curr));

    // Calculate 0% profit price for the cheapest variant
    etsyPrices['0% profit option'] = calculateEtsyPriceWithoutProfit(cheapestVariant.price, discountPercentageEtsy, runAdsOnEtsy);
    shopifyPrices['0% profit option'] = calculateShopifyPriceWithoutProfit(cheapestVariant.price, discountPercentageShopify);

    selectedType.sizeVariants.forEach(variant => {
      etsyPrices[variant.name] = calculateEtsyPrice(variant.price, profitPercentageEtsy, discountPercentageEtsy, runAdsOnEtsy);
      shopifyPrices[variant.name] = calculateShopifyPrice(variant.price, profitPercentageShopify, discountPercentageShopify);
    });

    dispatch(setEtsyPrices(etsyPrices));
    dispatch(setShopifyPrices(shopifyPrices));
  }
};

// Mockup Generator Actions
export const setMockupSelectedCategoryAction = (category: string): AppThunk => (dispatch) => {
  dispatch(setMockupSelectedCategory(category));
};

export const setMockupSelectedBrandAction = (brand: string): AppThunk => (dispatch) => {
  dispatch(setMockupSelectedBrand(brand));
};

export const setMockupSelectedTypeAction = (type: Type | null): AppThunk => (dispatch) => {
  dispatch(setMockupSelectedType(type));
};

export const setLightOverlay = (file: File | null): AppThunk => (dispatch) => {
  dispatch(setMockupLightVariantOverlay(file));
};

export const setDarkOverlay = (file: File | null): AppThunk => (dispatch) => {
  dispatch(setMockupDarkVariantOverlay(file));
};

export const setOverlayPos = (position: { x: number; y: number; width: number; height: number }): AppThunk => (dispatch) => {
  dispatch(setMockupOverlayPosition(position));
};

export const setSelectedColorVars = (variants: string[]): AppThunk => (dispatch) => {
  dispatch(setMockupSelectedColorVariants(variants));
};
