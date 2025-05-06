import React, { useState, useContext, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Appearance , useColorScheme , Text, Modal, Switch, TextInput, BackHandler, Dimensions, Easing,StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import {  
  auth, 
  reauthenticateUser,
  updateUserPassword,
  signOutUser , 
  updateUserNotifications,
  deleteUserAccount 
} from '../config/firebaseConfig';
import MaskedView from '@react-native-masked-view/masked-view';
import { Button } from 'react-native-elements';
import { useToast } from "../contexts/ToastContext";
import { getApp } from 'firebase/app';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import EditIcon from "../../assets/icons/EditIcon";
import EditInfoModal from '../modals/EditInfoModal';
import LogOutModal from '../modals/LogOutModal';
import {LinearGradient} from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useCasa } from '../contexts/CasaContext'; 
import {Picker} from '@react-native-picker/picker';
import colors from '../utils/colors';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import cities from '../data/cities.json';
import { useUser } from '../contexts/UserContext';
import AddIcon from '../../assets/icons/AddIcon';
import ArrowIcon from '../../assets/icons/ArrowIcon';
import { SelectList } from "react-native-dropdown-select-list";
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');
import AnimatedSwitch from '../components/AnimatedSwitch';
import { LanguageContext } from '../contexts/LanguageContext';


const ProfileScreen = ({navigation}) => {
  const { showToast } = useToast();
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', backAction);
  
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, []) 
  );
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [savedTheme, setSavedTheme] = useState(null);
  
  useEffect(() => {
    const getStoredTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      setSavedTheme(storedTheme);
    };
  
    getStoredTheme();
  }, []);
  
  const handleThemeChange = async (mode) => {
    await toggleTheme(mode);
    setSavedTheme(mode);
  };
  
  const isDarkSelected = savedTheme === 'dark';
  const isLightSelected = savedTheme === 'light';
  const isAutoSelected = savedTheme === null;


  const styles = createStyles(theme);
  const { userData, updateUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    birthDate: "",
    birthTime: "",
    birthCity: "",
    birthCountry: "",});
  const { t, i18n  } = useTranslation();
  const { language, changeLanguage } = useContext(LanguageContext);
  const [tempFormData, setTempFormData] = useState(formData);
  const [modalVisible, setModalVisible] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isDarkModeOpen, setIsDarkModeOpen] = useState(false);
  const [isSystemOpen, setIsSystemOpen] = useState(false);
  const [isSystemOptionsOpen, setIsSystemOptionsOpen] = useState(false);
  const emailHeight = useSharedValue(0);
  const passwordHeight = useSharedValue(0);
  const deleteHeight = useSharedValue(0);
  const systemHeight = useSharedValue(0);
  const languageHeight = useSharedValue(0);
  const darkModeHeight = useSharedValue(0);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { sistemaCasas, setSistemaCasas } = useCasa(); 
  const progress = useSharedValue(0);
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isEnabled, setIsEnabled] = useState(userData.notifications);

  useEffect(() => {
    setIsEnabled(userData.notifications); 
  }, [userData]);

  const toggleSwitch = async () => {
    const newNotificationStatus = !isEnabled;
    setIsEnabled(newNotificationStatus); 

    try {
      await updateUserNotifications(newNotificationStatus); 
    } catch (error) {
      console.error('Error al actualizar notificaciones:', error);
      setIsEnabled(isEnabled); 
    }
  };

  const countries = useMemo(() => {
    return Object.keys(cities); 
  }, [cities]);

const [fechaMostrada, setFechaMostrada] = useState('');


  useEffect(() => {
    if (userData) {
      const initialData = {
        name: userData.name || "",
        lastName: userData.lastName || "",
        birthDate: userData.birthDate || "",
        birthTime: userData.birthTime || "",
        birthCountry: userData.birthCountry || "",
        birthCity: userData.birthCity || "",
      };
      setFormData(initialData);
      setTempFormData(initialData);
    }
  }, [userData]); 
  
  const handleChange = (key, value) => {
    setTempFormData((prev) => ({ ...prev, [key]: value }));
  };
  
  const handleSubmit = async () => {
    try {
      setFormData(tempFormData);
      await updateUser(tempFormData);
      handleCloseModal();
      showToast({ message: t("toast.Actualizados"), type: "success" });
    } catch (error) {
      showToast({ message: t("toast.Ups"), type: "error" });
    }
  };
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


useEffect(() => {
  if (formData.birthDate) {
    const [year, month, day] = formData.birthDate.split('-');
    setFechaMostrada(`${day}-${month}-${year}`);
  }
}, [formData.birthDate]);

const handleFechaChange = (text) => {
  let formattedText = text.replace(/[^0-9]/g, ''); 
  
  if (i18n.language === "en") {
    if (formattedText.length > 4) {
      formattedText = `${formattedText.slice(0, 4)}/${formattedText.slice(4)}`;
    }
    if (formattedText.length > 7) {
      formattedText = `${formattedText.slice(0, 7)}/${formattedText.slice(7, 10)}`;
    }
  } else {
    if (formattedText.length > 2) {
      formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2)}`;
    }
    if (formattedText.length > 5) {
      formattedText = `${formattedText.slice(0, 5)}/${formattedText.slice(5, 9)}`;
    }
  }
  
  setFechaMostrada(formattedText);
  setTempFormData((prev) => ({
    ...prev,
    birthDate: formattedText}))
  
  if (formattedText.length === 10) {
    const parts = formattedText.split('/');
    if (parts.length === 3) {
      const [part1, part2, part3] = parts;
      if (i18n.language === "en") {
        setFecha(`${part1}-${part2}-${part3}`);
      } else {
        setFecha(`${part3}-${part2}-${part1}`);
      }
    }
  } else {
    setFecha('');
  }
};

const handleHoraChange = (text) => {
  let formattedText = text.replace(/[^0-9]/g, ''); 
  
  if (formattedText.length > 2) {
    formattedText = `${formattedText.slice(0, 2)}:${formattedText.slice(2, 4)}`;
  }
  
  setHora(formattedText);
  setTempFormData((prev) => ({
    ...prev,
    birthTime: formattedText,
  }));
};
    const filterCitiesByCountry = (selectedCountry) => {
      if (!selectedCountry) {
        setFilteredCities([]);
        return;
      }
      const filtered = cities[selectedCountry] 
        .map(city => ({
          ...city,
          label: city.label 
        }));
    
      setFilteredCities(filtered);
    };
  
  const convertirAMayusculas = (ciudad) => {
    return ciudad
      .split(' ') 
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()) 
      .join(' '); 
  };

    const toggleEmail = () => {
      setIsEmailOpen(!isEmailOpen);
      setIsPasswordOpen(false);
      setIsSystemOpen(false);
      setIsDeleteOpen(false);
      setIsLanguageOpen(false);
      setIsDarkModeOpen(false);
      emailHeight.value = withTiming(isEmailOpen ? 0 : 55, { duration: 300 });
      passwordHeight.value = withTiming(0, { duration: 300 });
      systemHeight.value = withTiming(0, { duration: 300 });
      deleteHeight.value = withTiming(0, {duration: 200})
      languageHeight.value = withTiming(0, { duration: 300 });
      darkModeHeight.value = withTiming(0, { duration: 300 });
    };
  
    const toggleEmailEdit = () => {
      setIsPasswordOpen(false);
      setIsSystemOpen(false);
      setIsDeleteOpen(false);
      setIsLanguageOpen(false);
      setIsDarkModeOpen(false);
      emailHeight.value = withTiming(emailHeight.value === 215 ? 55 : 215, { duration: 300 });
      passwordHeight.value = withTiming(0, { duration: 300 });
      systemHeight.value = withTiming(0, { duration: 300 });
      deleteHeight.value = withTiming(0, { duration: 200 });
      languageHeight.value = withTiming(0, { duration: 300 });
      darkModeHeight.value = withTiming(0, { duration: 300 });
    };
    
    const toggleSystem = () => {
      setIsSystemOpen(!isSystemOpen);
      setIsEmailOpen(false);
      setIsPasswordOpen(false);
      setIsDeleteOpen(false);
      setIsLanguageOpen(false);
      setIsDarkModeOpen(false);
      systemHeight.value = withTiming(isSystemOpen ? 0 : 55, { duration: 200 });
      emailHeight.value = withTiming(0, { duration: 200 });
      passwordHeight.value = withTiming(0, { duration: 200 });
      deleteHeight.value = withTiming(0, {duration: 200})
      languageHeight.value = withTiming(0, { duration: 300 });
      darkModeHeight.value = withTiming(0, { duration: 300 });
    };

    const toggleSystemOptions = () => {
      const isOpen = systemHeight.value === 220;
      setIsSystemOptionsOpen(!isOpen);
    
      setIsEmailOpen(false);
      setIsPasswordOpen(false);
      setIsDeleteOpen(false);
      setIsLanguageOpen(false);
      setIsDarkModeOpen(false);
    
      systemHeight.value = withTiming(isOpen ? 55 : 220, { duration: 300 });
      emailHeight.value = withTiming(0, { duration: 200 });
      passwordHeight.value = withTiming(0, { duration: 200 });
      deleteHeight.value = withTiming(0, { duration: 200 });
      languageHeight.value = withTiming(0, { duration: 300 });
      darkModeHeight.value = withTiming(0, { duration: 300 });
    };
    

    const togglePassword = () => {
      setIsPasswordOpen(!isPasswordOpen);
      setIsEmailOpen(false);
      setIsSystemOpen(false);
      setIsDeleteOpen(false);
      setIsLanguageOpen(false);
      setIsDarkModeOpen(false);
      passwordHeight.value = withTiming(isPasswordOpen ? 0 : 165, { duration: 300 });
      emailHeight.value = withTiming(0, { duration: 300 });
      systemHeight.value = withTiming(0, { duration: 300 });
      deleteHeight.value = withTiming(0, {duration: 200})
      languageHeight.value = withTiming(0, { duration: 300 });
      darkModeHeight.value = withTiming(0, { duration: 300 });
    };

 

    const toggleDelete = () => {
      setIsDeleteOpen(!isDeleteOpen);
      setIsEmailOpen(false);
      setIsPasswordOpen(false);
      setIsSystemOpen(false);
      setIsLanguageOpen(false);
      setIsDarkModeOpen(false);
      deleteHeight.value = withTiming(isDeleteOpen ? 0 : 120, { duration: 300 });
      emailHeight.value = withTiming(0, { duration: 300 });
      passwordHeight.value = withTiming(0, { duration: 300 });
      systemHeight.value = withTiming(0, { duration: 300 });
      languageHeight.value = withTiming(0, { duration: 300 });
      darkModeHeight.value = withTiming(0, { duration: 300 });
    };

    const toggleLanguage = () => {
      setIsLanguageOpen(!isLanguageOpen);
      setIsDeleteOpen(false);
      setIsEmailOpen(false);
      setIsPasswordOpen(false);
      setIsSystemOpen(false);
      setIsDarkModeOpen(false);
      languageHeight.value = withTiming(isLanguageOpen ? 0 : height*0.07, { duration: 300 });
      emailHeight.value = withTiming(0, { duration: 300 });
      passwordHeight.value = withTiming(0, { duration: 300 });
      systemHeight.value = withTiming(0, { duration: 300 });
      deleteHeight.value = withTiming(0, { duration: 300 });
      darkModeHeight.value = withTiming(0, { duration: 300 });
    };

    const toggleDarkMode = () => {
      setIsDarkModeOpen(!isDarkModeOpen);
      setIsDeleteOpen(false);
      setIsEmailOpen(false);
      setIsPasswordOpen(false);
      setIsSystemOpen(false);
      setIsLanguageOpen(false);
      darkModeHeight.value = withTiming(isDarkModeOpen ? 0 : 75, { duration: 300 });
      emailHeight.value = withTiming(0, { duration: 300 });
      passwordHeight.value = withTiming(0, { duration: 300 });
      systemHeight.value = withTiming(0, { duration: 300 });
      deleteHeight.value = withTiming(0, { duration: 300 });
      languageHeight.value = withTiming(0, { duration: 300 });

    };


  
    const animatedEmailStyle = useAnimatedStyle(() => ({
      height: emailHeight.value,
      overflow: 'hidden',
    }));
  
    const animatedPasswordStyle = useAnimatedStyle(() => ({
      height: passwordHeight.value,
      overflow: 'hidden',
    }));

    const animatedSystemStyle = useAnimatedStyle(() => ({
      height: systemHeight.value,
      overflow: 'hidden',
    }));

    const animatedDeleteStyle = useAnimatedStyle(() => ({
      height: deleteHeight.value,
      overflow: 'hidden',
    }));

    const animatedLanguageStyle = useAnimatedStyle(() => ({
      height: languageHeight.value,
      overflow: 'hidden',
    }));

    const animatedDarkStyle = useAnimatedStyle(() => ({
      height: darkModeHeight.value,
      overflow: 'hidden',
    }));
  
  
   const handleEmailUpdate = async () => {
    try {
      if (!currentPassword) {
        showToast({ message: t("toast.Contraseña_Actual"), type: "alert" });
        return;
      }
      await reauthenticateUser(currentPassword);
      await auth.currentUser.updateEmail(email);
      await updateUser({ email });
      showToast({ message: t("toast.Correo_Actualizado"), type: "success" });
    } catch (error) {
      showToast({ message: t("toast.Ups"), type: "error" });
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (!currentPassword || !newPassword) {
        showToast({ message: t("toast.Contraseña_Nueva"), type: "alert" });
        return;
      }
      await reauthenticateUser(currentPassword);
      await updateUserPassword(newPassword);
      showToast({ message: t("toast.Contraseña_Actualizada"), type: "success" });
    } catch (error) {
      showToast({ message: t("toast.Ups"), type: "error" });
    }
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    requestAnimationFrame(() => {
      setShowLogoutModal(true);
    });
  };
  
  
  const confirmarLogout = async () => {
    try {
      await signOutUser(); 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setShowLogoutModal(false); 
    }
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`, 
  }));
  

  const handleDeleteConfirmation = async () => {
    if (!currentPassword) {
      Alert.alert("Error", "Por favor, ingresa tu contraseña.");
      return;
    }

    try {
      await deleteUserAccount(currentPassword);
      Alert.alert("Éxito", "Cuenta eliminada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la cuenta. Verifica tu contraseña.");
    }
  };


  const opcionesCasas = [
    { label: t("profile.Placidus"), value: "P" },
    { label: t("profile.Topocéntrico"), value: "T" },
    { label: t("profile.Koch"), value: "K" },
    { label: t("profile.Casas iguales"), value: "E" },
    { label: t("profile.Signos enteros"), value: "W" },
  ];
  const sistemaSeleccionado = opcionesCasas.find(op => op.value === sistemaCasas);
  
  const birthDateTime = new Date(`${formData.birthDate}T${formData.birthTime}:00`);


  return (
    <View style={{ height: height, backgroundColor: theme.background }}>
    
    <LogOutModal
      visible={showLogoutModal}
      onConfirm={confirmarLogout}
      onCancel={() => setShowLogoutModal(false)}
      t={t}
    />
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ height: height*1.1, gap: 15 }}>
      {userData?.premium ?
      <View style={styles.ProfileInfoContainer}>
      <View style={styles.ProfileNameContainer}>
      <Text style={[styles.ProfileName,{color: '#7EBCEC'}]} numberOfLines={1} ellipsizeMode="tail">{formData.name} {formData.lastName}</Text>  
                <TouchableOpacity onPress={handleOpenModal}>
  <EditIcon style={{ width: height*.022, height: height*.022, margin:'auto',marginBottom: 3, fill:'#808080' }} />
  </TouchableOpacity>
  </View>
                <Text style={styles.PremiumInfo}>{userData?.membresia === 'estelar' && t("membresy.estelarTitle")}{userData?.membresia === 'solar' && t("membresy.solarTitle")}</Text>

<Text style={styles.ProfileInfo}>
{i18n.language === 'es' 
     ? birthDateTime.toLocaleDateString('es-AR', {
       day: '2-digit',
       month: '2-digit',
       year: 'numeric',
       }).replace(/\//g, '/')
     : formData.birthDate.replace(/-/g, '/') }
</Text>
<Text style={styles.ProfileInfo}>{formData.birthTime}</Text>
<Text style={styles.ProfileInfo}>{formData.birthCity}</Text>
     </View>
     :
      <View style={styles.ProfileInfoContainer}>
     
      <View style={styles.ProfileNameContainer}>
       
  <Text style={styles.ProfileName} numberOfLines={1} ellipsizeMode="tail">{formData.name} {formData.lastName}</Text>  
  <TouchableOpacity onPress={handleOpenModal}>
  <EditIcon style={{ width: height*.022, height: height*.022, margin:'auto',marginBottom: 3, fill:'#808080' }} />
  </TouchableOpacity>
  </View>
  
<Text style={styles.ProfileInfo}>
{i18n.language === 'es' 
      ? birthDateTime.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        }).replace(/\//g, '/')
      : formData.birthDate.replace(/-/g, '/') }
</Text>
<Text style={styles.ProfileInfo}>{formData.birthTime}</Text>
<Text style={styles.ProfileInfo}>{formData.birthCity}</Text>
      </View>}





      <View style={styles.changeEmailContainer}>
<TouchableOpacity onPress={toggleEmail} >
        <Text style={styles.profileButtonText}>{t("profile.Correo")}</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.changeEmailForm, animatedEmailStyle]}>
          <View style={styles.profileEmailText}>
        <Text style={styles.ProfileEmail}>{userData.email}</Text>
        <TouchableOpacity style={{ width: height*.019, height: height*.0575}} onPress={toggleEmailEdit}>
  <EditIcon style={{ width: height*.019, height: height*.019, margin:'auto', fill:'#808080' }} />
  </TouchableOpacity></View>
        <View style={styles.changePasswordForm}>
        <View style={styles.inputProfileContainer}>
        <TextInput
          style={{color: theme.secondaryBorder, fontSize: width * 0.035, marginVertical:5, marginTop: 15,fontFamily: 'Effra_Light',}}
          placeholderTextColor={ theme.secondaryBorder}
          value={email}
          onChangeText={setEmail}
          placeholder={t("profile.Nuevo_Correo")}
        /></View>
         <View style={styles.inputProfileContainer}>
        <TextInput
          style={{ color: theme.secondaryBorder, fontSize: width * 0.035, marginVertical: 5, marginTop: 20, fontFamily: 'Effra_Light',}}
          placeholderTextColor= {theme.secondaryBorder}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder={t("profile.Actual_Contraseña")}
        /></View>
        
         <TouchableOpacity style={{width: 115, height: 40, marginVertical: 15, borderRadius: 100, marginHorizontal: 'auto', marginRight: 25, overflow: "hidden", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: 'white', backgroundColor: theme.alwaysBlack,}} onPress={handleEmailUpdate} disabled={loading}>
  <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center",}}>
    <Animated.View style={{position: "absolute", left: 0, height: "100%", backgroundColor: "#666666", animatedStyle}} />
    <Text style={{ fontSize: width*0.03,
    color: theme.alwaysWhite,
    fontFamily: 'Effra_Regular', transform: [{ translateY: 1 }]}}>{t("profile.Cambiar")}</Text>
  </View>
</TouchableOpacity>
      </View></Animated.View>
      </View>
     <View style={styles.changePasswordContainer}>
    <TouchableOpacity onPress={togglePassword}>
        <Text style={styles.profileButtonText}>{t("profile.Contraseña")}</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.changePasswordForm, animatedPasswordStyle]}>

        <View style={styles.changePasswordForm}>
        <View style={styles.inputProfileContainer}>
        <TextInput style={{color:  theme.secondaryBorder, fontSize: width * 0.035, marginVertical:5, marginTop: 20, fontFamily: 'Effra_Light'}}
          placeholderTextColor={ theme.secondaryBorder}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder={t("profile.Actual_Contraseña")}
          secureTextEntry
        /></View>
         <View style={styles.inputProfileContainer}>
        <TextInput style={{color: theme.secondaryBorder, fontSize: width * 0.035, marginVertical:5, marginTop: 20, fontFamily: 'Effra_Light'}} placeholderTextColor= {theme.secondaryBorder} value={newPassword} onChangeText={setNewPassword}  placeholder={t("profile.Nueva_Contraseña")}  secureTextEntry
        /></View>
        
                 <TouchableOpacity style={{width: 115, height: 40, marginVertical: 15, borderRadius: 100, marginHorizontal: 'auto', marginRight: 25, overflow: "hidden", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: 'white', backgroundColor: theme.alwaysBlack,}} onPress={handleEmailUpdate} disabled={loading}>
  <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center",}}>
    <Animated.View style={{position: "absolute", left: 0, height: "100%", backgroundColor: "#666666", animatedStyle}} />
    <Text style={{ fontSize: width*0.035, color: theme.alwaysWhite, fontFamily: 'Effra_Regular', transform: [{ translateY: 1 }]}}>{t("profile.Cambiar")}</Text>

  </View>
</TouchableOpacity>
      </View></Animated.View>
      </View>
      <View style={styles.changeSystem}>
      <TouchableOpacity onPress={toggleSystem}>
      <Text style={styles.profileButtonText}>{t("profile.Sistema")}</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.changeSystemForm, animatedSystemStyle]}>
      
      <TouchableOpacity style={{ height: height*0.045, flexDirection: 'row', borderWidth: 1,  borderColor: theme.secondary, borderRadius: 50, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center', marginHorizontal: 'auto', marginVertical: 10,width: width*.8}} onPress={toggleSystemOptions}>
              <TextInput style={{flex: 1, fontSize: width * 0.035, lineHeight: height*0.017, fontFamily: 'Effra_Regular',marginHorizontal: 5, color: theme.secondary,}} editable={false}>
              {sistemaSeleccionado?.label || 'Seleccionar sistema de casas'}
              </TextInput>
              {isSystemOptionsOpen ? (
  <AddIcon
    style={{
      transform: [{ rotate: '45deg' }], 
      width: height * 0.016,
      height: height * 0.016,
      margin: 'auto',
      fill: theme.secondary,
    }}
  />
) : (
  <ArrowIcon
    style={{
      transform: [{ rotate: '0deg' }],
      width: height * 0.016,
      height: height * 0.016,
      margin: 'auto',
      fill: theme.secondary,
    }}
  />
)}
</TouchableOpacity>
      
        <View style={{borderWidth: 1, borderColor: theme.secondary, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, width: width*.75, paddingVertical: 10, gap: 7.5, marginHorizontal: 'auto'}}>
      {opcionesCasas.map((opcion) => (
      <TouchableOpacity
        key={opcion.value}
        onPress={() => setSistemaCasas(opcion.value)}
        style={[
          styles.buttonPickerItem,
          sistemaCasas === opcion.value && {opacity: .25},
        ]}
      >
        <Text style={{color: theme.secondary, fontSize: width * 0.03}}>{opcion.label}</Text>
      </TouchableOpacity>
    ))}
    </View>
      </Animated.View>
      </View>

      <TouchableOpacity  onPress={() => navigation.navigate('MembresyScreen')}>
        <Text style={styles.profileButtonText}>{t("profile.Membresia")}</Text>
      </TouchableOpacity>
      <View style={styles.changeLanguage}>
    <TouchableOpacity onPress={toggleDarkMode}>
      <Text style={styles.profileButtonText}>
        {t("profile.Modo")}
      </Text>
    </TouchableOpacity>

    <Animated.View style={[styles.changeLanguageForm, animatedDarkStyle]}>
      <View style={[styles.switchSelector, { backgroundColor: theme.background }]}>
      <TouchableOpacity
  style={styles.switchOption}
  onPress={() => handleThemeChange(null)}>
  <View style={styles.radioButton}>
    {isAutoSelected && <View style={styles.innerSwitchCircle} />}
  </View>
  <Text style={styles.switchText}>Auto</Text>
</TouchableOpacity>
        {/* Opción Dark */}
        <TouchableOpacity
          style={styles.switchOption}
          onPress={() => handleThemeChange('dark')}
        >
          <View style={styles.radioButton}>
            {isDarkSelected && <View style={styles.innerSwitchCircle} />}
          </View>
          <Text style={styles.switchText}>{t("profile.Encendido")}</Text>
        </TouchableOpacity>

        {/* Opción Light */}
        <TouchableOpacity
          style={styles.switchOption}
          onPress={() => handleThemeChange('light')}
        >
          <View style={styles.radioButton}>
            {isLightSelected && <View style={styles.innerSwitchCircle} />}
          </View>
          <Text style={styles.switchText}>{t("profile.Apagado")}</Text>
        </TouchableOpacity>

      </View>
    </Animated.View>
  </View>
      <View style={styles.changeLanguage}>
      <TouchableOpacity onPress={toggleLanguage}>
        <Text style={styles.profileButtonText}>
          {i18n.language === 'en' ? 'Language' : 'Idioma'}
        </Text>
      </TouchableOpacity>
      <Animated.View style={[styles.changeLanguageForm, animatedLanguageStyle]}>
      <View style={styles.switchSelector}>
      <TouchableOpacity 
        onPress={() => changeLanguage("en")} 
        style={styles.switchOption} 
        disabled={language === "en"}
      >
        <View style={styles.radioButton}>
          {language === "en" && <View style={styles.innerSwitchCircle} />}
        </View>
        <Text style={styles.switchText}>English</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => changeLanguage("es")} 
        style={styles.switchOption} 
        disabled={language === "es"}
      >
        <View style={styles.radioButton}>
          {language === "es" && <View style={styles.innerSwitchCircle} />}
        </View>
        <Text style={styles.switchText}>Español</Text>
      </TouchableOpacity>
    </View>
</Animated.View>
    </View>
    <TouchableOpacity  onPress={() => navigation.navigate('PolicyScreen')}>
        <Text style={styles.profileButtonText}>{t("profile.Politica")}</Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => navigation.navigate('TermsScreen')}>
        <Text style={styles.profileButtonText}>{t("profile.Terminos")}</Text>
      </TouchableOpacity>


      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginRight: 25}}>
        <Text style={styles.profileButtonText}>{t("profile.Notificaciones")}</Text>
        <AnimatedSwitch isEnabled={isEnabled} onToggle={toggleSwitch} />
    
      </View>


      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.profileButtonText}>{t("profile.Cerrar")}</Text>
      </TouchableOpacity>
      <View style={styles.changePasswordContainer}>
    <TouchableOpacity onPress={toggleDelete}>
        <Text style={styles.buttonRedText}>{t("profile.Eliminar_Cuenta")}</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.changePasswordForm, animatedDeleteStyle]}>

        <View style={styles.changePasswordForm}>
        <View style={styles.inputProfileContainer}>
        <TextInput style={{color:  theme.secondaryBorder, fontSize: width*0.035, marginVertical:5, marginTop: 10, fontFamily: 'Effra_Light'}}
          placeholderTextColor={ theme.secondaryBorder}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder={t("profile.Contraseña_Eliminar")}
          secureTextEntry
        /></View>
        
         <TouchableOpacity style={{
    width: 115,
    height: 40,
    marginVertical: 15,
    borderRadius: 100,
    marginHorizontal: 'auto',
    marginRight: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: theme.alwaysBlack,}} onPress={handleDeleteConfirmation} disabled={loading}>
  <View style={{    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",}}>
    <Animated.View style={{position: "absolute",
    left: 0, 
    height: "100%",
    backgroundColor: "#666666", animatedStyle}} />
    <Text style={{ fontSize: width * 0.0355,
    color: theme.alwaysWhite,
    fontFamily: 'Effra_Regular', transform: [{ translateY: 1 }]}}>{t("profile.Eliminar")}</Text>
  </View>
</TouchableOpacity>
      </View></Animated.View>
      </View>
    
      </ScrollView>
      <EditInfoModal
        visible={modalVisible}
        handleCloseModal={handleCloseModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleFechaChange={handleFechaChange}
        handleHoraChange={handleHoraChange}
        tempFormData={tempFormData}
        filteredCities={filteredCities}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        showTimePicker={showTimePicker}
        setShowTimePicker={setShowTimePicker}
        fechaMostrada={fechaMostrada} 
        filterCitiesByCountry={filterCitiesByCountry}
        convertirAMayusculas={convertirAMayusculas}
        countries={countries}
      />

      <LinearGradient pointerEvents="none" colors={['transparent', theme.shadowBackground, theme.shadowBackground, theme.shadowBackground]} style={{  position: 'absolute',bottom: (height - wHeight) - height*0.05, left: 0,right: 0,height: (height - wHeight) + height*0.2 , zIndex: 1}}/>
    

    </View>
  );
};


export default ProfileScreen;
