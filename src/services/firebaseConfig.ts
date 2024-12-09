import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, getDoc, setDoc, deleteDoc, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA5Yv97_XhL1pOHiYSJPM8jBeAoRXhSFnE",
  authDomain: "mockup-generator-a523e.firebaseapp.com",
  projectId: "mockup-generator-a523e",
  storageBucket: "mockup-generator-a523e.appspot.com",
  messagingSenderId: "410536383827",
  appId: "1:410536383827:web:1ca6891e6858a61c82bda6",
  measurementId: "G-2987Q8J89W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error(
      'Multiple tabs open. Persistence can only be enabled in one tab at a time if multi-tab synchronization is not supported.'
    );
  } else if (err.code === 'unimplemented') {
    console.error(
      'The current browser does not support all features required for persistence.'
    );
  }
});

const storage = getStorage(app);

export { db, storage, collection, getDocs, query, where, doc, getDoc, setDoc, deleteDoc, ref, uploadBytes, getDownloadURL, deleteObject };
