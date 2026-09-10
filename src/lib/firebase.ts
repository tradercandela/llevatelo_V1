import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  writeBatch,
  query,
  orderBy
} from 'firebase/firestore';

export const firebaseConfig = {
  projectId: "gen-lang-client-0812614735",
  appId: "1:302589090009:web:f04a2fb439becff7a486c8",
  apiKey: "AIzaSyBvcWZQ-kdCb4VNiFJ10812PizjRYVyNBU",
  authDomain: "gen-lang-client-0812614735.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-llvatelo-3465e0fc-c040-46d2-bb79-4f497385afd3",
  storageBucket: "gen-lang-client-0812614735.firebasestorage.app",
  messagingSenderId: "302589090009"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  writeBatch,
  query,
  orderBy
};
