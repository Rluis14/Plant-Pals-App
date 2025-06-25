// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyDF4GKDb0uPfUDA7RqbbH5CVxBgv_XonAU',
  authDomain: 'plant-pals-22cd7.firebaseapp.com',
  projectId: 'plant-pals-22cd7',
  storageBucket: 'plant-pals-22cd7.firebasestorage.app',
  messagingSenderId: '504983460073',
  appId: '1:504983460073:web:883560de507790b355f878',
  measurementId: 'G-0KLYCM222D',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Setup persistent auth for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
