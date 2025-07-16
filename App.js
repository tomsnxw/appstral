import React, { useState, useEffect, useContext, useRef } from 'react';
import { NavigationContainer,useNavigationContainerRef, DefaultTheme , useNavigationState,  useNavigation, CommonActions   } from '@react-navigation/native';
import { createStackNavigator,TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import { View, ScrollView, TouchableOpacity, ActivityIndicator,Modal, TextInput, Animated, Easing , StyleSheet, KeyboardAvoidingView, useWindowDimensions, Dimensions, Platform, Pressable, Keyboard, TouchableWithoutFeedback, Text, BackHandler } from 'react-native';
import PagerView from 'react-native-pager-view';
import NetInfo from '@react-native-community/netinfo';
import SignUpScreen from './src/screens/SignUpScreen';
import { useFonts } from 'expo-font';
import { CasaProvider, useCasa } from './src/contexts/CasaContext';
import LogInScreen from './src/screens/LogInScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProfileScreen from './src/screens/ProfileScreen';
import MySolarRevoScreen from './src/screens/MySolarRevoScreen';
import SolarRevoScreen from './src/screens/SolarRevoScreen';
import MyTransitsScreen from './src/screens/MyTransitsScreen';
import TransitsScreen from './src/screens/TransitsScreen'
import MyChartScreen from './src/screens/MyChartScreen'; 
import PolicyScreen from './src/screens/PolicyScreen';
import TermsScreen from './src/screens/TermsScreen';
import MembresyScreen from './src/screens/MembresyScreen';
import MyChartsScreen from './src/screens/MyChartsScreen'; 
import { ToastProvider } from "./src/contexts/ToastContext";
import CalculateScreen from './src/screens/CalculateChart'; 
import ChartDetails from './src/screens/ChartDetailsScreen'
import Glosario from './src/screens/GlosarioScreen';
import EfemeridesScreen from './src/screens/EfemeridesScreen';
import { createBottomTabNavigator, SceneStyleInterpolators  } from '@react-navigation/bottom-tabs';
import HomeIcon from "./assets/icons/HomeIcon";
import NoConnectionIcon from "./assets/icons/NoConnectionIcon";
import ProfileIcon from "./assets/icons/profileIcon";
import AppstralName from "./assets/icons/AppstralName";
import AppstralStar from "./assets/icons/AppstralStar";
import ConstellationOne from "./assets/icons/ConstellationOne";
import ConstellationTwo from "./assets/icons/ConstellationTwo";
import ConstellationThree from "./assets/icons/ConstellationThree";
import ConstellationFour from "./assets/icons/ConstellationFour";
import ConstellationFive from "./assets/icons/ConstellationFive";
import ConstellationSix from "./assets/icons/ConstellationSix";
import CalculateIcon from "./assets/icons/calculateIcon";
import EphemerisIcon from "./assets/icons/ephemerisIcon";
import ErrorBoundary from './src/components/ErrorBoundary'
import 'react-native-reanimated';
import { auth, onAuthStateChanged, db, doc,setDoc,checkAndUpdateSubscriptionStatus, getDoc,getAuth, updateDoc, guardarTokenFCM } from "./src/config/firebaseConfig";
import { UserProvider } from './src/contexts/UserContext';
import { useTranslation } from 'react-i18next';
import './src/i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, ThemeContext  } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext'; 
import { LinearGradient } from 'expo-linear-gradient';
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Purchases from 'react-native-purchases';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";
import NotificationsScreen from './src/screens/NotificationsScreen';
import { NotificationProvider } from './src/contexts/NotificationContext';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    console.log('Notificación recibida:', notification);
    return {
      shouldShowAlert: true, 
      shouldPlaySound: true, 
      shouldSetBadge: false, 
    };
  },
});

export async function registerForPushNotificationsAsync() {
  let token;
  let finalStatus;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log('📱 Token FCM:', token);
    } else {
      console.log('❌ Permiso de notificaciones denegado');
    }
  } else {
    finalStatus = 'denied'; // Considerar como denegado si no es un dispositivo físico
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: true,
      enableVibrate: true,
      shouldShowAlert: true,
    });
  }

  return { token, finalStatus };
}

const App = () => {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t, i18n } = useTranslation();
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isConnected, setIsConnected] = useState(null);
  const navigationRef = useNavigationContainerRef();
  const [initialNotificationData, setInitialNotificationData] = useState(null);

  useEffect(() => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: '<TU_API_KEY_PUBLICA_DE_APPLE>' });
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: 'goog_kKDJcHBrPfeMtodupJQmiOyhCff' });
    }

    // Check for initial notification when the app launches (cold start)
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response && response.notification.request.content.data?.screen) {
        setInitialNotificationData(response.notification.request.content.data);
        console.log('Initial notification data:', response.notification.request.content.data);
      }
    });
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('🛎️ Usuario tocó la notificación:', response);

      const data = response.notification.request.content.data;

      // Navigate if navigationRef is ready
      if (navigationRef.isReady() && data?.screen) {
        navigationRef.navigate(data.screen, data.params || {});
      } else {
        // If navigationRef is not ready, store the data to navigate later
        setInitialNotificationData(data);
        console.log('Navigation not ready, storing initial notification data for later:', data);
      }
    });

    return () => subscription.remove();
  }, [navigationRef]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        console.log('✅ Usuario autenticado con Firebase:', user.uid);

        const userRef = doc(db, 'users', user.uid);
        let userDocSnap = await getDoc(userRef);

        let retries = 3;
        while (!userDocSnap.exists() && retries > 0) {
          console.log(`⏳ Reintentando obtener el documento del usuario para ${user.uid}...`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          userDocSnap = await getDoc(userRef);
          retries--;
        }

        if (!userDocSnap.exists()) {
          console.warn('⚠️ No se encontró el documento del usuario después de varios intentos. Creando uno nuevo si es necesario.');
          await setDoc(userRef, { createdAt: serverTimestamp(), notifications: false, vip: false }, { merge: true });
          userDocSnap = await getDoc(userRef);
        }

        const userData = userDocSnap.data();
        const isVip = userData?.vip === true;

        // --- Lógica para refrescar el token de notificaciones ---
        const { token, finalStatus } = await registerForPushNotificationsAsync();
        if (token) {
          await guardarTokenFCM(token);
        } else {
          console.log('🔄 No se pudo obtener el token de notificaciones. Actualizando estado de notificaciones a false para el usuario:', user.uid);
          try {
            await setDoc(userRef, { notifications: false }, { merge: true });
          } catch (error) {
            console.error('❌ Error al actualizar notifications a false en Firestore:', error);
          }
        }
        // --- Fin de la lógica para refrescar el token de notificaciones ---


        // Configurar RevenueCat con el UID del usuario
        Purchases.configure({
          apiKey: Platform.OS === 'ios'
            ? '<TU_API_KEY_PUBLICA_DE_APPLE>'
            : 'goog_kKDJcHBrPfeMtodupJQmiOyhCff',
          appUserID: user.uid,
        });

        if (isVip) {
          console.log('✨ Usuario VIP detectado. No se verificará la suscripción de RevenueCat.');
          await updateDoc(userRef, { premium: true, membresia: 'estelar' });
        } else {
          console.log('💳 Verificando suscripción para usuario no VIP.');
          try {
            const customerInfo = await Purchases.getCustomerInfo();
            const currentAppUserID = await Purchases.getAppUserID();
            console.log('🆔 RevenueCat App User ID:', currentAppUserID);
            console.log('📦 RevenueCat Entitlements:', customerInfo.entitlements);
            await checkAndUpdateSubscriptionStatus(customerInfo);
          } catch (error) {
            console.error('❌ Error al obtener customerInfo de RevenueCat:', error);
          }
        }
      } else {
        setIsLoggedIn(false);
        console.log('🔒 Usuario no autenticado con Firebase');
        Purchases.reset();
      }

      setAuthChecked(true);
    });

    return unsubscribe;
  }, []); 


  
    useEffect(() => {
      const checkAuthState = () => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            setIsLoggedIn(true);
            const userDocRef = doc(db, "users", user.uid);
  
            let userDocSnap = await getDoc(userDocRef);
            let retries = 3;
            while (!userDocSnap.exists() && retries > 0) {
              await new Promise((resolve) => setTimeout(resolve, 500));
              userDocSnap = await getDoc(userDocRef);
              retries--;
            }
  
            if (!userDocSnap.exists()) {
              console.log("No se encontró el documento del usuario después de varios intentos.");
            }
          } else {
            setIsLoggedIn(false);
          }
  
          setAuthChecked(true);
        });
      };
  
      checkAuthState();
    }, []);

        const [fontsLoaded] = useFonts({
      'Effra_Bold_Italic': require('./assets/fonts/Effra_Bold_Italic.ttf'),
      'Effra_Bold': require('./assets/fonts/Effra_Bold.ttf'),
      'Effra_Hairline_Italic': require('./assets/fonts/Effra_Hairline_Italic.ttf'),
      'Effra_Hairline': require('./assets/fonts/Effra_Hairline.ttf'),
      'Effra_Italic': require('./assets/fonts/Effra_Italic.ttf'),
      'Effra_Light_Italic': require('./assets/fonts/Effra_Light_Italic.ttf'),
      'Effra_Light': require('./assets/fonts/Effra_Light.ttf'),
      'Effra_Medium': require('./assets/fonts/Effra_Medium.ttf'),
      'Effra_Medium_Italic': require('./assets/fonts/Effra_Medium_Italic.ttf'),
      'Effra_Regular': require('./assets/fonts/Effra_Regular.ttf'),
      'Effra_SemiBold': require('./assets/fonts/Effra_SemiBold.ttf'),
      'Effra_SemiBold_Italic': require('./assets/fonts/Effra_SemiBold_Italic.ttf'),
      'Effra_Thin': require('./assets/fonts/Effra_Thin.ttf'),
      'Effra_Thin_Italic': require('./assets/fonts/Effra_Thin_Italic.ttf'),
      'Effra_XBold_Italic': require('./assets/fonts/Effra_XBold_Italic.ttf'),
      'Effra_XBold': require('./assets/fonts/Effra_XBold.ttf'),
      'Astronomicon': require('./assets/fonts/Astronomicon.ttf'),
    });

    useEffect(() => {
      const loadLanguage = async () => {
        try {
          const savedLanguage = await AsyncStorage.getItem('language');
          if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
          }
        } catch (error) {
          console.error('Error loading language:', error);
        } finally {
          setLanguageLoaded(true);
        }
      };
  
      loadLanguage();
    }, []);
  
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
      });
  
      NetInfo.fetch().then(state => {
        setIsConnected(state.isConnected);
      });
  
      return () => {
        unsubscribe();
      };
    }, []);
  
    useEffect(() => {
      if (languageLoaded && fontsLoaded && isConnected !== null && authChecked) {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 2000); // 2000 milisegundos = 2 segundos
    
        // Limpia el temporizador si los valores de las dependencias cambian antes de que se complete el retraso
        return () => clearTimeout(timer);
      }
    }, [languageLoaded, fontsLoaded, isConnected, authChecked]);
    
  const opacities = [useRef(new Animated.Value(1)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  
  useEffect(() => {
    let currentIndex = 0;
  
    const loop = () => {
      const nextIndex = (currentIndex + 1) % 3;
  
      Animated.sequence([
        Animated.delay(3000),
        Animated.parallel([
          Animated.timing(opacities[currentIndex], {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacities[nextIndex], {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ]).start(() => {
        currentIndex = nextIndex;
        loop();
      });
    };
  
    loop();
  }, []);
  
  if (loading || !authChecked) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>
          <Animated.View style={{ opacity: opacities[0], ...StyleSheet.absoluteFillObject }}>
            <LinearGradient colors={['#29ABE2', '#7F47DD']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ConstellationOne style={{ width: width * 0.95, height: width * 0.65, fill: 'white', position: 'absolute', top: height * 0.08, right: 0 }} />
              <ConstellationTwo style={{ width: width * 0.95, height: width * 0.65, fill: 'white', position: 'absolute', bottom: height * 0.12, right: 0 }} />
            </LinearGradient>
          </Animated.View>

    
          <Animated.View style={{ opacity: opacities[1], ...StyleSheet.absoluteFillObject }}>
            <LinearGradient colors={['#F8FF2E', '#DD8BD9']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ConstellationThree style={{ width: width * 0.95, height: width * 0.65, fill: 'white', position: 'absolute', top: height * 0.08, right: 0 }} />
              <ConstellationFour style={{ width: width * 0.95, height: width * 0.65, fill: 'white', position: 'absolute', bottom: height * 0.12, right: 0 }} />
            </LinearGradient>
          </Animated.View>
    
          <Animated.View style={{ opacity: opacities[2], ...StyleSheet.absoluteFillObject }}>
            <LinearGradient colors={['#E229DC', '#4FF5A4']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ConstellationFive style={{ width, height: width * 0.65, fill: 'white', position: 'absolute', top: height * 0.08, right: 0 }} />
              <ConstellationSix style={{ width, height: width * 0.5, fill: 'white', position: 'absolute', bottom: height * 0.12, right: 0 }} />
            </LinearGradient>
          </Animated.View>
    
          {/* Logo y texto */}
          <AppstralStar style={{ width: width * 0.225, height: width * 0.225, fill: 'white' }} />
          <AppstralName style={{ width: width * 0.35, height: width * 0.22, fill: 'white', marginBottom: 15 }} />

          <View style={{ justifyContent: 'center', position: 'absolute', bottom: height * 0.08 }}>
            <Text style={{ textAlign: 'center', color: 'white', fontFamily: 'Effra_Light', fontSize: height * 0.018 }}>Versión Beta 1.0</Text>
            <Text style={{ textAlign: 'center', color: 'white', fontFamily: 'Effra_Light', fontSize: height * 0.012 }}>©2025 Appstral. Todos los derechos reservados.</Text>
          </View>
        </View>
      );
    }

const EfemeridesTabBar = ({ state, descriptors, navigation, filtroCategoria, setFiltroCategoria, categorias }) => {
  const [activeTab, setActiveTab] = useState(state.index);
  const scrollProgress = useRef(new Animated.Value(0)).current;
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const handleTabPress = (index) => {
    setActiveTab(index);
    navigation.navigate(state.routeNames[index]);
  };

  Animated.timing(scrollProgress, {
    toValue: activeTab,
    duration: 300,
    useNativeDriver: true,
  }).start();

  return (
    <View style={{
      position: 'absolute',
      top: 0, // Ensure it's at the very top
      left: 0,
      right: 0,
      backgroundColor: theme.background,
      width: wp('100%'),
      // Calculate total height needed for both sections
      height: hp('13.5%') + (activeTab !== 3 ? hp('7.5%') : 0), // Base height + categories height if active
    }}>
      {/* Top section: Title and Main Tabs */}
      <View style={{
        width: wp('90%'),
        height: hp('13.5%'), // This is the height of the main tab bar section
        justifyContent: 'flex-end',
        alignSelf: 'center',
        marginBottom: 0,
        borderBottomWidth: hp('0.1%'),
        borderColor: theme.tertiary
      }}>
        <Text style={{ fontSize: RFValue(22), transform: [{ translateY: hp('0%') }], fontFamily: 'Effra_Regular', textAlign: 'start', color: theme.primary }}>{t('efemerides')}</Text>

        {/* Tab Bar */}
        <View style={{ flexDirection: 'row', height: hp('4.5%') }}>
          {state.routeNames.map((routeName, index) => {
            const isFocused = state.index === index;
            return (
              <TouchableOpacity
                key={routeName}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  color: theme.black
                }}
                onPress={() => handleTabPress(index)}
              >
                <Text style={[{ fontFamily: 'Effra_Regular', fontSize: RFValue(14), textAlign: 'center', color: theme.tertiary }, isFocused && { fontFamily: 'Effra_Regular', fontSize: RFValue(14), textAlign: 'center', color: theme.black }]}>
                  {routeName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Animated Indicator */}
        <Animated.View
          style={[
            { bottom: -hp('0.1%'), height: hp('0.1%'), backgroundColor: theme.black, },
            {
              width: wp('90%') / state.routeNames.length,
              transform: [
                {
                  translateX: scrollProgress.interpolate({
                    inputRange: [0, state.routeNames.length - 1],
                    outputRange: [0, wp('90%') - (wp('90%') / state.routeNames.length)],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Filtros: Categorías para todas las pestañas excepto "Glosario" */}
      {activeTab !== 3 && ( // Assuming "Glosario" is the 4th tab (index 3)

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: wp('3%'),
              backgroundColor: theme.background,
              height: hp('7.5%'),
              paddingHorizontal: wp('6.25%'),
            }}
          >
            {categorias.map((categoria, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setFiltroCategoria(categoria)}
                style={[{
                  height: hp('3%'),
                  borderColor: theme.secondary,
                  width: 'auto',
                  backgroundColor: theme.background,
                  paddingHorizontal: wp('6.25%'),
                  borderRadius: 100,
                  borderWidth: 1,
                  paddingBottom: hp(.1),
                  justifyContent: 'center',
                  alignItems: 'center',
                }, filtroCategoria === categoria && {
                  backgroundColor: theme.black,
                  borderColor: theme.black,
                }]}
              >
                <Text
                  style={filtroCategoria === categoria ?
                    {
                      color: theme.white,
                      fontFamily: 'Effra_Regular',
                      fontSize: RFValue(12)
                    }
                    :
                    {
                      color: theme.black,
                      fontFamily: 'Effra_Regular',
                      fontSize: RFValue(12)
                    }
                  }
                >
                  {t(categoria)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
      )}
    </View>
  );
};

    if (!isConnected) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>
          <LinearGradient colors={['#29ABE2', '#7F47DD']} style={{ position: 'absolute',width: width, height: height, justifyContent: 'center', alignItems: 'center' }}>
            <ConstellationOne style={{ width: width * 0.95, height: width * 0.65, fill: 'white', position: 'absolute', top: height * 0.08, right: 0 }} />
            <ConstellationTwo style={{ width: width * 0.95, height: width * 0.65, fill: 'white', position: 'absolute', bottom: height * 0.12, right: 0 }} />
          </LinearGradient>

  
        {/* Logo y texto */}
        <AppstralStar style={{ width: width * 0.225, height: width * 0.225, fill: 'white' }} />
        <AppstralName style={{ width: width * 0.35, height: width * 0.22, fill: 'white', marginBottom: 15 }} />

        <View style={{ justifyContent: 'center', position: 'absolute', bottom: height * 0.08 }}>
          <Text style={{ textAlign: 'center', color: 'white', fontFamily: 'Effra_Light', fontSize: height * 0.018 }}>Versión Beta 1.0</Text>
          <Text style={{ textAlign: 'center', color: 'white', fontFamily: 'Effra_Light', fontSize: height * 0.012 }}>©2025 Appstral. Todos los derechos reservados.</Text>
        </View>
        <Modal transparent={true} statusBarTranslucent={true} visible={true} animationType="fade">
           <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',justifyContent: 'center', alignItems: 'center',}}>
                   <View style={{backgroundColor: 'white', borderRadius: 12, width: '77.5%', height: height*.5,paddingTop: 25, justifyContent: 'space-between'}}>
                   <NoConnectionIcon style={{ width: width * .6, height: width * .6, marginHorizontal: 'auto' }} />
                       <View style={{alignContent: 'center', alignItems: 'center', marginTop: 10, gap: 15, marginBottom: 25}}>
                 <Text style={{textAlign: 'center', width: width*.65, fontFamily: 'Effra_Regular', color: '#333333', fontSize: height * 0.0215, lineHeight: height * 0.025,}}>{t("connection.title")}</Text>
                 <Text style={{textAlign: 'center', width: width*.65, fontFamily: 'Effra_Regular', color: '#808080', fontSize: height * 0.0175, lineHeight: height * 0.025,}}>{t("connection.subtitle")}</Text>
                                  
                 </View>
                 <TouchableOpacity style={{width: '100%',marginBottom: 0, paddingTop: 15, backgroundColor: '#FAFAFA', paddingBottom: 10, borderBottomLeftRadius: 12, borderBottomRightRadius: 12,}}>
                  <Text style={{justifyContent: 'center', textAlign: 'center', fontFamily: 'Effra_Regular', fontSize: height * 0.02, color: theme.primary,}}>Aceptar</Text>
                  </TouchableOpacity>
               </View>
             </View>
           </Modal>
      </View>
      );
    }
    
    const EfemeridesTabs = () => {
      const [filtroCategoria, setFiltroCategoria] = useState('todo');
  const [filtroFecha, setFiltroFecha] = useState('');
  const categorias = ['todo', 'retrogradaciones', 'cambios', 'lunaciones'];

return (
  <Tab.Navigator
    tabBar={props => (
      <EfemeridesTabBar
        {...props}
        theme={theme}
        filtroCategoria={filtroCategoria}
        setFiltroCategoria={setFiltroCategoria}
        categorias={categorias}
      />
    )}
    screenOptions={{
      animationEnabled: true,
      gestureEnabled: true,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerShown: false
    }}
  >
    <Tab.Screen
      name={t('Hoy')}
      children={() => <EfemeridesScreen rangoTiempo="hoy" filtroCategoria={filtroCategoria} />}
    />
    <Tab.Screen
      name={t('Semana')}
      children={() => <EfemeridesScreen rangoTiempo="semana" filtroCategoria={filtroCategoria} />}
    />
    <Tab.Screen
      name={t('Mes')}
      children={() => <EfemeridesScreen rangoTiempo="mes" filtroCategoria={filtroCategoria} />}
    />
    <Tab.Screen
      name={t('Glosario')}
      children={() => <Glosario />}
    />
  </Tab.Navigator>
);
};


  const ProfileStack = () => (
    <Stack.Navigator initialRouteName='Profile' screenOptions={{
      animationEnabled: true,
      gestureEnabled: true,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="PolicyScreen" component={PolicyScreen}  />
      <Stack.Screen name="TermsScreen" component={TermsScreen}  />
      <Stack.Screen name="MembresyScreen" component={MembresyScreen}  />
    </Stack.Navigator>
  );
  
  const ChartStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='MyCharts'>
      <Stack.Screen name="MyCharts" component={MyChartsScreen} />
      <Stack.Screen name="ChartDetails" component={ChartDetails} />
      <Stack.Screen name="Transits" component={TransitsScreen} />
      <Stack.Screen name="SolarRevo" component={SolarRevoScreen} />
    </Stack.Navigator>
  )

  const MyChartStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='MyChart'>
      <Stack.Screen name="MyChart" component={MyChartScreen} />
      <Stack.Screen name="MySolarRevo" component={MySolarRevoScreen} />
      <Stack.Screen name="MyTransits" component={MyTransitsScreen} />
    </Stack.Navigator>
  )

  const MyDataTabBar = ({ state, descriptors, navigation }) => {
    const [activeTab, setActiveTab] = useState(state.index);
    const scrollProgress = useRef(new Animated.Value(0)).current;
    const { theme } = useContext(ThemeContext);
    const handleTabPress = (index) => {
      if (state.index === index) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: state.routeNames[index] }],
          })
        );
      } else {
        setActiveTab(index);
        navigation.navigate(state.routeNames[index]);
      }
    };
  
    Animated.timing(scrollProgress, {
      toValue: activeTab,
      duration: 300,
      useNativeDriver: true,
    }).start();
  
    return (
      <View  style={{position: 'absolute', backgroundColor: theme.background, width: wp('100%'),height: hp('13.5%'),  }}>
      <View style={{width: wp('90%'),height: hp('13.5%'),justifyContent: 'flex-end',margin: 'auto',marginTop: 'auto',marginBottom: 0,borderBottomWidth: hp('0.1%'),borderColor: theme.tertiary }}>
      <Text style={{fontSize: RFValue(22),transform: [{translateY: hp('0%')}],fontFamily: 'Effra_Regular',textAlign: 'start',color: theme.primary}}>{t('perfil')}</Text>
        <View style={{flexDirection: 'row', height: hp('4.5%')}}>
          {state.routeNames.map((routeName, index) => {
            const isFocused = state.index === index;
            const color = isFocused ? '#673ab7' : '#222';
            return (
              <TouchableOpacity
              key={routeName}
              style={{
                flex: 1,
                justifyContent: 'center',
                color: theme.black
              }}
              onPress={() => handleTabPress(index)}
            >
                <Text style={[{fontFamily: 'Effra_Regular', fontSize: RFValue(14),textAlign: 'center',color: theme.tertiary }, isFocused && {fontFamily: 'Effra_Regular', fontSize: RFValue(14),textAlign: 'center',color: theme.black}]}>
                  {routeName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
  
        {/* Indicador Animado */}
        <Animated.View
          style={[
            {bottom: -hp('0.1%'), height: hp('0.1%'),backgroundColor: theme.black,},
            {
              width: width * 0.9 / state.routeNames.length, 
              transform: [
                {
                  translateX: scrollProgress.interpolate({
                    inputRange: [0, state.routeNames.length - 1],
                    outputRange: [0, width * 0.9 - (width * 0.9 / state.routeNames.length)],
                  }),
                },
              ],
            },
          ]}
        />
      </View></View>
    );
  };


  const MyDataTabs = () => {
    return (
      <Tab.Navigator initialRouteName={t('mi_carta')}
        tabBar={props => <MyDataTabBar {...props}/>}
        screenOptions={{
          animationEnabled: true,
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Tab.Screen name={t('mis_datos')} component={ProfileStack} options={{
          itle: t('mis_datos'),
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}/>
        <Tab.Screen name={t('mi_carta')} component={MyChartStack} options={{
          title: t('mi_carta'),
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}/>
        <Tab.Screen name={t('mis_cartas')} component={ChartStack} options={{
        title: t('mis_cartas'),
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}/>

      </Tab.Navigator>
    );
  };

  
const AuthStack = () => {
  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0); 

  useEffect(() => {
    const backAction = () => {
      if (currentPage === 0) {
        return true;
      } else if (currentPage === 1) {
        pagerRef.current.setPage(0);
        return true;
      } else if (currentPage === 2) {
        pagerRef.current.setPage(1);
        return true;
      }
      return false; 
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [currentPage]);

  return (
    <View style={{ flex: 1 }}>
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle='dark-content'/>
    <PagerView
      ref={pagerRef}
      style={{ flex: 1 }}
      initialPage={0}
      onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
    >
      <View key="1" style={{ flex: 1 }}>
        <SignUpScreen goToLogin={() => pagerRef.current.setPage(1)} />
      </View>
      <View key="2" style={{ flex: 1 }}>
        <LogInScreen gotoForgot={() => pagerRef.current.setPage(2)} />
      </View>
      <View key="3" style={{ flex: 1 }}>
        <ForgotPasswordScreen />
      </View>
    </PagerView>
    </View>
  );
};

const HomeStack = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
        ...TransitionPresets.SlideFromRightIOS, 
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

  const MainApp = () => {
    const { theme } = useContext(ThemeContext);
    const MyTheme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.theme,
        background: theme.background,
      },
    };
    const { reloadKey } = useCasa();
    const [initialRoute, setInitialRoute] = useState(null);
    const [startInMyChart, setStartInMyChart] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
      const checkFirstTime = async (user) => {
        if (!user) {
          setInitialRoute("Home");
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().firstTime) {
          setInitialRoute("Profile");
          setStartInMyChart(true);

          await updateDoc(userRef, { firstTime: false });
        } else {
          setInitialRoute("Home");
        }
      };

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        checkFirstTime(user);
      });

      return () => unsubscribe();
    }, []);

    // Effect to handle navigation from initialNotificationData once the navigationRef is ready
    useEffect(() => {
      if (navigationRef.isReady() && initialNotificationData) {
        console.log('Navigating from initialNotificationData:', initialNotificationData.screen);
        navigationRef.navigate(initialNotificationData.screen, initialNotificationData.params || {});
        // Clear the initial notification data after navigating
        setInitialNotificationData(null);
      }
    }, [initialNotificationData, navigationRef]);

    if (initialRoute === null) return null;
    

    return (
      <NavigationContainer ref={navigationRef} key={reloadKey} theme={MyTheme}>
      <Tab.Navigator 
      initialRouteName={initialRoute}
      swipeEnabled={true}
           screenOptions={{
            
    lazy: true,
    unmountOnBlur: true,
            tabBarHideOnKeyboard: true,
             tabBarButton: (props) => (
               <Pressable {...props} android_ripple={{ color: 'transparent' }} />
             ),
             tabBarStyle: [{ 
              position: 'absolute',
               alignSelf: 'center',
               flexDirection: 'row',
               backgroundColor: theme.menuBackground,
               borderRadius: 50,
               paddingRight: 25,
               paddingLeft: 10,
               paddingTop: 7.5,
               height: hp('8.5%'),
               marginHorizontal: 15,
               borderWidth: RFValue(.5),
               borderColor: theme.menuBorder,
               bottom: hp('3%'),
               shadowColor: theme.shadow,
               shadowOffset: { width: 0, height: 1 },
               shadowOpacity: .1,
               shadowRadius: 50,
              }, null],
             tabBarActiveTintColor: '#5488E3',
             tabBarInactiveTintColor: theme.secondary,
             headerShown: false
           }}
         >
<Tab.Screen 
  name="Home" 
  component={HomeStack} 
  options={{
    title: 'Home',
       ...TransitionPresets.FadeTransition,
    tabBarIcon: ({ color, size, focused }) => (
      <View style={{ flex:1, width: wp('22%'),  height: height*0.3, gap: 5}}>
      <HomeIcon size={size} fill={focused ? color : theme.secondary} />
      <Text 
        style={{
          fontSize: RFValue(10),
          textAlign: 'center',
          fontFamily: 'Effra_Medium',
          color: focused ? color : theme.secondary,
        }}
      >
        {t('inicio')}
      </Text>
    </View>
  ),
  tabBarLabel: () => null, 
}} />
           <Tab.Screen 
  name="Profile"
  component={MyDataTabs} 
  options={{
       ...TransitionPresets.FadeTransition,
    title: 'Perfil',
    tabBarIcon: ({ color, size, focused }) => (
      <View style={{ flex:1, width: wp('22%'), height: height*0.3, gap: 5}}>
        <ProfileIcon size={size} fill={focused ? color : theme.secondary} />
        <Text 
          style={{
            fontSize: RFValue(10),
            textAlign: 'center',
            fontFamily: 'Effra_Medium',
            color: focused ? color : theme.secondary,
          }}
        >
         {t('perfil')}
        </Text>
      </View>
    ),
    tabBarLabel: () => null,
  }} 
/>

            <Tab.Screen 
  name="Calculate" 
  component={CalculateScreen} 
  options={{
    unmountOnBlur: true, 
    title: 'Calcular',
       ...TransitionPresets.FadeTransition,
    tabBarIcon: ({ color, size, focused }) => (
      <View style={{ flex:1, width: wp('22%'), height: height*0.3, gap: 5}}>
      <CalculateIcon size={size} fill={focused ? color : theme.secondary} />
      <Text 
        style={{
          fontSize: RFValue(10),
          textAlign: 'center',
          fontFamily: 'Effra_Medium',
          color: focused ? color : theme.secondary,
        }}
      >
         {t('calcular')}
      </Text>
    </View>
  ),
  tabBarLabel: () => null,
}} />
            <Tab.Screen 
              name="Efemerides" 
              component={EfemeridesTabs} 
              options={{
                title: 'Efemérides',
                   ...TransitionPresets.FadeTransition,
                tabBarIcon: ({ color, size, focused }) => (
                  <View style={{ flex:1, width: wp('22%'), height: height*0.3, gap: 5}}>
                  <EphemerisIcon size={size} fill={focused ? color : theme.secondary} />
                  <Text 
                    style={{
                      fontSize: RFValue(10),
                      textAlign: 'center',
                      fontFamily: 'Effra_Medium',
                      color: focused ? color : theme.secondary,
                    }}
                  >
                     {t('efemerides')}
                  </Text>
                </View>
              ),
              tabBarLabel: () => null,
            }} />
          </Tab.Navigator>
          
          </NavigationContainer>
    )
  }
  const MainContent = () => {
    const { theme } = useContext(ThemeContext);
  
    return (
      <>
        <View style={{ flex: 1 }}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={theme.background === 'white' ? 'dark-content' : 'light-content'}/>
            {isLoggedIn ? <MainApp /> : <AuthStack />}
        </View>
      </>
    );
  };
  

  return (
    <SafeAreaProvider>
    <ThemeProvider>
    <LanguageProvider>
    <UserProvider>
    <CasaProvider>
        <ErrorBoundary>
          <ToastProvider>
            <NotificationProvider>
              <MainContent/>
            </NotificationProvider>
          </ToastProvider>
        </ErrorBoundary>
    </CasaProvider>
  </UserProvider>
  </LanguageProvider>
  </ThemeProvider>
  </SafeAreaProvider>
  );
};


export default App;