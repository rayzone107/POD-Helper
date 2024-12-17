import { db, doc, getDoc, setDoc } from './firebaseConfig';

export interface AppSettings {
  defaultProfitPercentage: number;
  defaultEtsySalePercentage: number;
  defaultShopifySalePercentage: number;
  mockupGrid: {
    horizontal: number;
    vertical: number;
  };
  defaultFreeShippingEtsy: boolean;
  defaultFreeShippingShopify: boolean;
}

export const fetchSettings = async (): Promise<AppSettings> => {
  const docRef = doc(db, 'settings', 'defaults');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as AppSettings;
  } else {
    throw new Error('No settings document found');
  }
};

export const updateSettings = async (settings: AppSettings): Promise<void> => {
  const docRef = doc(db, 'settings', 'defaults');
  await setDoc(docRef, settings, { merge: true });
};
