import { db, collection, getDocs, query, where } from './firebaseConfig';
import { Category, Brand } from '../types';

interface CategoryDoc {
  name: string;
}

interface BrandDoc {
  name: string;
  categoryId: string;
}

export const fetchCategoriesFromFirestore = async (): Promise<Category[]> => {
  const categoriesCollection = collection(db, 'categories');
  const categoriesSnapshot = await getDocs(categoriesCollection);
  const categories: Category[] = categoriesSnapshot.docs.map(doc => ({
    id: doc.id,
    name: (doc.data() as CategoryDoc).name,
  }));
  return categories;
};

export const fetchBrandsFromFirestore = async (categoryId: string): Promise<Brand[]> => {
  const brandsCollection = collection(db, 'brands');
  const q = query(brandsCollection, where('categoryId', '==', categoryId));
  const brandsSnapshot = await getDocs(q);
  const brands: Brand[] = brandsSnapshot.docs.map(doc => ({
    id: doc.id,
    name: (doc.data() as BrandDoc).name,
    categoryId: (doc.data() as BrandDoc).categoryId,
  }));
  return brands;
};
