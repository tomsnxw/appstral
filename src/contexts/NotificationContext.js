// src/context/NotificationContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [shouldShowRedDot, setShouldShowRedDot] = useState(false); 
  const [lastViewedDate, setLastViewedDate] = useState(null);
  const [hasVisitedNotificationsScreen, setHasVisitedNotificationsScreen] = useState(null); 

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; 
  };

  useEffect(() => {
    const loadInitialNotificationStatus = async () => {
      try {
        const storedLastViewedDate = await AsyncStorage.getItem('lastViewedNotificationsDate');
        const storedHasVisitedNotificationsScreen = await AsyncStorage.getItem('hasVisitedNotificationsScreen');
        
        setLastViewedDate(storedLastViewedDate);
        setHasVisitedNotificationsScreen(storedHasVisitedNotificationsScreen === 'true');

        const todayDate = getTodayDateString();

        if (storedHasVisitedNotificationsScreen !== 'true' || !storedLastViewedDate || storedLastViewedDate < todayDate) {
          setShouldShowRedDot(true);
        } else {
          setShouldShowRedDot(false);
        }

      } catch (error) {
        console.error('Error loading initial notification status:', error);
      }
    };
    loadInitialNotificationStatus();
  }, []); 

  const markNotificationsAsViewed = useCallback(async () => {
    const todayDate = getTodayDateString();
    setLastViewedDate(todayDate); 
    setShouldShowRedDot(false); 
    try {
      await AsyncStorage.setItem('lastViewedNotificationsDate', todayDate);
    } catch (error) {
      console.error('Error saving last viewed notifications date:', error);
    }
  }, []);

  const markNotificationsScreenAsVisited = useCallback(async () => {
    setHasVisitedNotificationsScreen(true); 
    try {
      await AsyncStorage.setItem('hasVisitedNotificationsScreen', 'true');
    } catch (error) {
      console.error('Error saving notification screen visited status:', error);
    }
  }, []);

  const updateRedDotStatus = useCallback(async (hasTodayEvents) => {
    const currentLastViewedDate = await AsyncStorage.getItem('lastViewedNotificationsDate');
    const currentHasVisitedNotificationsScreen = await AsyncStorage.getItem('hasVisitedNotificationsScreen');
    const todayDate = getTodayDateString();

    const showDot = hasTodayEvents && 
                    (currentHasVisitedNotificationsScreen !== 'true' || !currentLastViewedDate || currentLastViewedDate < todayDate);
    
    setShouldShowRedDot(showDot);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        shouldShowRedDot,
        markNotificationsAsViewed,
        markNotificationsScreenAsVisited,
        updateRedDotStatus, 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);