import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../utils/theme';

export const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');

      if (savedTheme === 'dark') {
        setTheme(darkTheme);
      } else if (savedTheme === 'light') {
        setTheme(lightTheme);
      } else {
        const now = new Date();
        const hour = now.getHours();

        if (hour >= 6 && hour < 18) {
          setTheme(lightTheme);
        } else {
          setTheme(darkTheme);
        }
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async (mode) => {
    if (mode === 'dark') {
      setTheme(darkTheme);
      await AsyncStorage.setItem('theme', 'dark');
    } else if (mode === 'light') {
      setTheme(lightTheme);
      await AsyncStorage.setItem('theme', 'light');
    } else {
      await AsyncStorage.removeItem('theme');

      const now = new Date();
      const hour = now.getHours();
      if (hour >= 6 && hour < 18) {
        setTheme(lightTheme);
      } else {
        setTheme(darkTheme);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
