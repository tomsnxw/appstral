import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [hasNewNotificationsToday, setHasNewNotificationsToday] = useState(false);

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // "YYYY-MM-DD"
  };

  // Modificación clave: Ya no establecemos hasNewNotificationsToday en el useEffect inicial
  // Solo se encargará de cargar la última fecha vista si es necesario para alguna otra lógica
  useEffect(() => {
    // Podrías cargar la lastViewedDate aquí si la necesitas para algo más,
    // pero no para determinar directamente hasNewNotificationsToday
    const loadLastViewedDate = async () => {
      try {
        const lastViewedDate = await AsyncStorage.getItem('lastViewedNotificationsDate');
        // Aquí no cambiamos hasNewNotificationsToday, ya que dependerá de los eventos reales
        // Pero podrías usar esta fecha para un fetch condicional en HomeScreen o similar
      } catch (error) {
        console.error('Error loading last viewed date:', error);
      }
    };
    loadLastViewedDate();
  }, []);

  const markNotificationsAsViewed = useCallback(async () => {
    setHasNewNotificationsToday(false);
    try {
      await AsyncStorage.setItem('lastViewedNotificationsDate', getTodayDateString());
    } catch (error) {
      console.error('Error saving last viewed notifications date:', error);
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ hasNewNotificationsToday, setHasNewNotificationsToday, markNotificationsAsViewed }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);