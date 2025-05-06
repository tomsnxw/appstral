import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, doc, getDoc, updateDoc } from '../config/firebaseConfig';

const CasaContext = createContext();

export const CasaProvider = ({ children }) => {
  const [sistemaCasas, setSistemaCasas] = useState('T');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const cargarSistemaCasas = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setSistemaCasas(userDoc.data().sistemaCasas || 'T');
        }
      }
    };

    const unsuscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        cargarSistemaCasas();
      }
    });

    return () => unsuscribe();
  }, []);

  const actualizarSistemaCasas = async (nuevoSistema) => {
    setSistemaCasas(nuevoSistema);
    setReloadKey((prevKey) => prevKey + 1);
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), { sistemaCasas: nuevoSistema });
    }
  };

  return (
    <CasaContext.Provider value={{ sistemaCasas, setSistemaCasas: actualizarSistemaCasas, reloadKey }}>
      {children}
    </CasaContext.Provider>
  );
};

export const useCasa = () => useContext(CasaContext);
