import { 
  initializeApp 
} from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signOut,
  updatePassword, 
  EmailAuthProvider,
  reauthenticateWithCredential,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail, 
  signInWithEmailAndPassword
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  deleteDoc,
  increment,
  onSnapshot,
  query,
  where,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Purchases from 'react-native-purchases';
const firebaseConfig = {
  apiKey: "AIzaSyBPORNaOngd5do6nroWg09SVUoFvbr90ro",
  authDomain: "efemeris-b8058.firebaseapp.com",
  projectId: "efemeris-b8058",
  storageBucket: "efemeris-b8058.firebasestorage.app",
  messagingSenderId: "798861160394",
  appId: "1:798861160394:android:39cdf57c560f0d9bb86933",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Inicializa la persistencia de Auth
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
  autoSave: true,
});

const auth = getAuth(app);

const db = getFirestore(app);

const signUpUser = async (email, password, name, lastName, birthDate, birthTime, birthCountry, birthCity) => {
  console.log("Datos recibidos en signUpUser:", { email, password, name, lastName, birthDate, birthTime, birthCountry, birthCity });
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData = {
      name,
      lastName,
      email,
      birthDate,
      birthTime,
      birthCountry,
      birthCity,
      firstTime: true,
      notifications: false,
      premium: false,
      sistemaCasas: "T",
      membresia: "",
      extraCharts: 3,
      
    };

    await setDoc(doc(db, "users", user.uid), userData);

    console.log("Registro exitoso:", user.email);
    console.log("Datos guardados en Firestore:", userData);

    return user;
  } catch (error) {
    console.error("Error en el registro:", error.message);

    if (auth.currentUser) {
      await auth.currentUser.delete().catch(err => {
        console.error("No se pudo eliminar el usuario huérfano:", err.message);
      });
    }

    throw error;
  }
};

const logInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Inicio de sesión exitoso:", userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    throw error;
  }
};

const reauthenticateUser = async (currentPassword) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No se encontró un usuario autenticado.");
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
};

const updateUserPassword = async (newPassword) => {
  const user = auth.currentUser; 
  if (!user) {
    throw new Error("No se encontró un usuario autenticado.");
  }

  await updatePassword(user, newPassword);
  console.log("Contraseña actualizada exitosamente");
};

const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("Sesión cerrada exitosamente");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

const deleteUserAccount = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No se encontró un usuario autenticado.");
    }

    await deleteDoc(doc(db, "users", user.uid));

    await user.delete();

    console.log("Cuenta eliminada exitosamente.");
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error.message);
    throw error;
  }
};

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Correo de restablecimiento enviado");
  } catch (error) {
    console.error("Error al enviar el correo de restablecimiento:", error.message);
    throw error;
  }
};

async function guardarTokenFCM(token) {
  const auth = getAuth();
  const db = getFirestore();

  if (auth.currentUser) {
    const uid = auth.currentUser.uid;
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists() || docSnap.data().fcm_token !== token) {
      await setDoc(userRef, { fcm_token: token }, { merge: true });
    }
  }
}

const updateUserLanguage = async (lang) => {
  const auth = getAuth();
  const db = getFirestore();

  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);

  try {
    await updateDoc(userRef, { lang });
    console.log('Idioma actualizado en Firestore:', lang);
  } catch (error) {
    console.error('Error al actualizar idioma en Firestore:', error);
  }
};

const updateUserNotifications = async (newNotificationStatus) => {
  const auth = getAuth();
  const db = getFirestore();

  const user = auth.currentUser;
  if (!user) {
    throw new Error("No se encontró un usuario autenticado.");
  }

  const userRef = doc(db, 'users', user.uid);

  try {
    await updateDoc(userRef, { notifications: newNotificationStatus });
  } catch (error) {
    console.error('Error al actualizar el estado de las notificaciones:', error);
  }
};

const enviarMensaje = async (email, asunto, mensaje) => {
  try {
    await addDoc(collection(db, "mensajes"), {
      email,
      asunto,
      mensaje,
      fecha: serverTimestamp(),
    });
    console.log("Mensaje enviado con éxito");
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    throw error;
  }
};

const checkAndUpdateSubscriptionStatus = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    console.log('Customer Info al iniciar (desde FirebaseConfig):', customerInfo);

    const isEstelarActive = customerInfo?.entitlements?.active['estelar.premium']?.isActive === true;
    const isSolarActive = customerInfo?.entitlements?.active['solar.premium']?.isActive === true;

    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      if (!isEstelarActive && !isSolarActive) {
        await updateDoc(userRef, { premium: false, membresia: "" }); // O el valor que desees
        console.log('Suscripción premium no activa, base de datos actualizada (FirebaseConfig).');
      } else if (isEstelarActive) {
        await updateDoc(userRef, { premium: true, membresia: 'estelar' });
        console.log('Suscripción Estelar activa, base de datos actualizada (FirebaseConfig).');
      } else if (isSolarActive) {
        await updateDoc(userRef, { premium: true, membresia: 'solar' });
        console.log('Suscripción Solar activa, base de datos actualizada (FirebaseConfig).');
      } else {
        console.log('El usuario tiene una suscripción activa pero no es premium (FirebaseConfig).');
      }
    } else {
      console.log('No hay usuario autenticado al verificar la suscripción (FirebaseConfig).');
    }
  } catch (error) {
    console.log('Error al obtener la Customer Info (FirebaseConfig):', error);
  }
};

export {
  auth,
  db,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  increment,
  updateDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  deleteUserAccount,
  onSnapshot,
  signOutUser,
  onAuthStateChanged,
  getAuth,
  updateUserPassword,
  reauthenticateUser,
  signUpUser, 
  logInUser,
  resetPassword,
  getFirestore,
  guardarTokenFCM,
  updateUserLanguage,
  updateUserNotifications,
  enviarMensaje,
  checkAndUpdateSubscriptionStatus
};
