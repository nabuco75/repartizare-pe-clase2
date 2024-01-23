import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxEbBWkNhI07lybabnHxTmTFKJuAFXgOk",
  authDomain: "repartizare-pe-clase.firebaseapp.com",
  databaseURL: "https://repartizare-pe-clase-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "repartizare-pe-clase",
  storageBucket: "repartizare-pe-clase.appspot.com",
  messagingSenderId: "315429834065",
  appId: "1:315429834065:web:d3bb062718866da36e5770",
  measurementId: "G-S4E4S05LYS",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
