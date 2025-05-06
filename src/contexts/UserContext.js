import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebaseConfig'; 
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const updateUser = async (newData) => {
    if (userData) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userDocRef, newData, { merge: true });
    }
  };
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        });

        return () => unsubscribeSnapshot();
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
<UserContext.Provider value={{ userData, setUserData, updateUser }}>
{children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
