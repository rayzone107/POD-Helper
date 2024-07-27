// src/services/settingsService.ts
import { db, doc, getDoc } from './firebaseConfig';

export interface AppSettings {
  defaultProfitPercentage: number;
  defaultEtsySalePercentage: number;
  defaultShopifySalePercentage: number;
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
