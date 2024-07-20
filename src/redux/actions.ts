import { AppThunk, AppThunkDispatch } from './store';
import { setCategories, addCategory as addCategoryAction, updateCategory as updateCategoryAction, deleteCategory as deleteCategoryAction } from './slices/categoriesSlice';
import { setBrands, addBrand as addBrandAction, updateBrand as updateBrandAction, deleteBrand as deleteBrandAction } from './slices/brandsSlice';
import { setTypes, deleteType as deleteTypeAction } from './slices/typesSlice';
import { setSelectedCategory, setSelectedBrand, setSelectedType, setProfitPercentage, setRunAdsOnEtsy, setDiscountPercentageEtsy, setDiscountPercentageShopify, setEtsyPrices, setShopifyPrices } from './slices/pricingCalculatorSlice';
import { fetchCategoriesFromFirestore, fetchBrandsFromFirestore, fetchAllBrandsFromFirestore, fetchTypesFromFirestore } from '../services/firestoreService';
import { Category, Brand, Type } from '../types';
import { db, collection, doc, setDoc, deleteDoc, getDoc, ref, deleteObject, storage } from '../services/firebaseConfig';
import { calculateEtsyPrice, calculateShopifyPrice } from '../services/pricingCalculatorService';

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

export const calculatePrices = (): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const {
    selectedType,
    profitPercentage,
    runAdsOnEtsy,
    discountPercentageEtsy,
    discountPercentageShopify,
  } = state.pricingCalculator;

  if (!selectedType) return;

  const etsyPrices: Record<string, number> = {};
  const shopifyPrices: Record<string, number> = {};

  selectedType.sizeVariants.forEach((variant) => {
    etsyPrices[variant.name] = calculateEtsyPrice(
      variant.price,
      profitPercentage,
      runAdsOnEtsy,
      discountPercentageEtsy
    );
    shopifyPrices[variant.name] = calculateShopifyPrice(
      variant.price,
      profitPercentage,
      discountPercentageShopify
    );
  });

  dispatch(setEtsyPrices(etsyPrices));
  dispatch(setShopifyPrices(shopifyPrices));
};
