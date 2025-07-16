// src/context/NotificationContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [hasNewNotificationsToday, setHasNewNotificationsToday] = useState(false);

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // "YYYY-MM-DD"
  };

  useEffect(() => {
    const loadNotificationStatus = async () => {
      try {
        const lastViewedDate = await AsyncStorage.getItem('lastViewedNotificationsDate');
        const todayDate = getTodayDateString();

        // Si la última fecha vista es anterior a hoy, o no hay registro,
        // asumimos que PUEDE haber notificaciones nuevas de hoy.
        // NotificationsScreen será el encargado de 'marcar como vistas' si las hay.
        if (!lastViewedDate || lastViewedDate < todayDate) {
          setHasNewNotificationsToday(true); // <-- ¡Cambiado a true!
        } else {
          setHasNewNotificationsToday(false); // Ya se vieron hoy
        }
      } catch (error) {
        console.error('Error loading notification status:', error);
      }
    };
    loadNotificationStatus();
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