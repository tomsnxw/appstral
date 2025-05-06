import React, { createContext, useState, useEffect } from 'react';
import i18n from '../i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserLanguage } from '../config/firebaseConfig';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = async (lng) => {
    if (language === lng) return;

    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem('appLanguage', lng);
    setLanguage(lng);
    await updateUserLanguage(lng)
  };

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('appLanguage');
      if (savedLanguage && savedLanguage !== i18n.language) {
        await i18n.changeLanguage(savedLanguage);
        setLanguage(savedLanguage);
      }
    };

    loadLanguage();

    i18n.on('languageChanged', (lng) => {
      setLanguage(lng);
    });

    return () => {
      i18n.off('languageChanged');
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
