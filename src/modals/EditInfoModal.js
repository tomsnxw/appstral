import React, { useState, useRef, useMemo, useEffect, useContext } from 'react';
import { View, Text,Animated, TextInput,TouchableOpacity,TouchableWithoutFeedback, PanResponder, StyleSheet, KeyboardAvoidingView, Keyboard, Modal, FlatList, Dimensions } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { Button } from 'react-native-elements';
import cities from '../data/cities.json';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import colors from '../utils/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SelectList } from "react-native-dropdown-select-list";
import AddIcon from '../../assets/icons/AddIcon';
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');
import { useUser } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import { useToast } from "../contexts/ToastContext";
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import countryTranslations from '../utils/countryTranslations'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize"; 

const EditInfoModal = ({ visible, handleCloseModal}) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const { showToast } = useToast();
  const { t, i18n  } = useTranslation();
  const [translateY, setTranslateY] = useState(new Animated.Value(height));  
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [focusedField, setFocusedField] = useState(null);
  const { userData, updateUser } = useUser();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthCountry, setBirthCountry] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [fechaMostrada, setFechaMostrada] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState({ country: false, city: false });
  const [countries, setCountries] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredCities, setFilteredCities] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTextCountry, setSearchTextCountry] = useState("");
  
  const dropdownAnim = {
    country: useRef(new Animated.Value(0)).current,
    city: useRef(new Animated.Value(0)).current
  };

  useEffect(() => {
    const sortedCountries = Object.keys(cities)
      .sort((a, b) => {
        const nameA = i18n.language === 'es' ? countryTranslations[a] || a : a;
        const nameB = i18n.language === 'es' ? countryTranslations[b] || b : b;
        return nameA.localeCompare(nameB);
      });

    setCountries(sortedCountries);
    setFilteredCountries(sortedCountries); 
  }, [i18n.language]);


useEffect(() => {
    if (birthCountry) {
      setSearchTextCountry(i18n.language === 'es' ? countryTranslations[birthCountry] || birthCountry : birthCountry);
    } else {
      setSearchTextCountry(""); 
    }
  }, [birthCountry, i18n.language, countryTranslations]); // Dependencies ensure it runs when these values change

    const toggleDropdown = (type) => {
      setDropdownVisible((prev) => {
        const newState = { country: false, city: false };
        newState[type] = !prev[type];
        return newState;
      });
    
      Animated.timing(dropdownAnim.country, {
        toValue: type === "country" ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    
      Animated.timing(dropdownAnim.city, {
        toValue: type === "city" ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };
  
    const handleCountrySelect = (country) => {
      setBirthCountry(country);
      setBirthCity(null);
      setCitiesList(cities[country] || []);
      setFilteredCities(cities[country] || []);
      setSearchText(""); 
      toggleDropdown("country");
    };

const handleCitySearch = (text) => {
  setCiudad(text);
  if (text === "") {
    setFilteredCities(citiesList);
    return;
  }

  let filtered = citiesList.filter(city => {
    const palabras = city.label.toLowerCase().split(" ");
    return palabras.some(palabra => palabra.startsWith(text.toLowerCase()));
  });

  if (text.toLowerCase() === "caba") {
    const cabaOption = { label: "Ciudad de Buenos Aires", value: "CABA" };
    if (!filtered.some(city => city.label === cabaOption.label)) {
      filtered = [cabaOption, ...filtered];
    }
  }

  setFilteredCities(filtered);
};


  const handleCountrySearch = (text) => {
    setSearchTextCountry(text);
    if (text === "") {
      setFilteredCountries(countries);
      return;
    }

    const filtered = countries.filter(countryCode => {
      const countryName = i18n.language === 'es' ? countryTranslations[countryCode] || countryCode : countryCode;
      return countryName.toLowerCase().startsWith(text.toLowerCase());
    });
    setFilteredCountries(filtered);
  };
  
  
  useEffect(() => {
    if (userData && isModalVisible) {
      setName(userData.name || '');
      setLastName(userData.lastName || '');
      setBirthDate(userData.birthDate || '');
      setBirthTime(userData.birthTime || '');
      setBirthCountry(userData.birthCountry || '');
      setBirthCity(userData.birthCity || '');
    }
  }, [userData, isModalVisible]);
  
 useEffect(() => {
        if (userData.birthDate) {
          const [year, month, day] = userData.birthDate.split('-');
          setFechaMostrada(i18n.language === "en" ? `${year}/${month}/${day}` : `${day}/${month}/${year}`);
        }
      }, [userData.birthDate, i18n.language]);

      const progress = useRef(new Animated.Value(0)).current;


const widthInterpolation = progress.interpolate({
  inputRange: [0, 1],
  outputRange: ["0%", "100%"], 
});


      const handleSubmit = async () => {
        setLoading(true); 
        progress.setValue(0);
      
        Animated.timing(progress, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }).start();
      
        try {
          await updateUser({
            name,
            lastName,
            birthDate,
            birthTime,
            birthCountry,
            birthCity,
          });
          handleCloseModal();
          showToast({ message: t("toast.Actualizados"), type: "success" });
        } catch (error) {
          console.error(error);
          showToast({ message: t("toast.Ups"), type: "error" });
        } finally {
          setLoading(false); 
          progress.setValue(0); 
        }
      };
      



  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsModalVisible(false); 
      });
    }
  }, [visible]);

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
    
    if (formattedText.length === 10) {
      const parts = formattedText.split('/');
      if (parts.length === 3) {
        const [part1, part2, part3] = parts;
        if (i18n.language === "en") {
          setBirthDate(`${part1}-${part2}-${part3}`);
        } else {
          setBirthDate(`${part3}-${part2}-${part1}`);
        }
      }
    } else {
      setBirthDate(''); 
    }
  };


  const handleHoraChange = (text) => {
    let formattedText = text.replace(/[^0-9]/g, ''); 
    
    if (formattedText.length > 2) {
      formattedText = `${formattedText.slice(0, 2)}:${formattedText.slice(2, 4)}`;
    }
    
    setBirthTime(formattedText);
  };

  return (
       <KeyboardAvoidingView behavior='none' >
       <Modal animationType="none" transparent={true} statusBarTranslucent={true} visible={isModalVisible} onRequestClose={handleCloseModal}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <Animated.View  style={[styles.modalContainer,{ opacity: fadeAnim }]}>
                  
                   <Animated.View style={{...styles.modalContent, transform: [{ translateY }], }} >
               <LinearGradient style={styles.modalContent} colors={[theme.sheetGradientTop, theme.sheetGradientBottom]} >
                   <View style={styles.modalSlider}/>
                   <TouchableWithoutFeedback onPress={() => {}}>
          
           <View style={styles.modalForm}>
           <Text style={styles.modalTitle}>{t('Editar_Datos')}</Text>
           <TextInput
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme.secondary}
            style={[styles.modalInput, focusedField === 'nombre' ? styles.focusedText : styles.defaultText]}
            placeholder={t('Nombre')}
          />
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor={theme.secondary}
            style={[styles.modalInput, focusedField === 'nombre' ? styles.focusedText : styles.defaultText]}
            placeholder={t('Apellido')}
          />
<Text style={styles.modalText}>{t('Fecha_Nacimiento')}</Text>
<TextInput
placeholderTextColor={theme.secondary}
  style={[styles.modalDateTimeInput, focusedField === 'fecha' ? styles.focusedText : styles.defaultText]}
  value={fechaMostrada}
  keyboardType="numeric"
  placeholder={i18n.language === "en" ? "YYYY/MM/DD" : "DD/MM/YYYY"}
  onChangeText={handleFechaChange}
  onFocus={() => setFocusedField('fecha')}
    onBlur={() => setFocusedField(null)}
/>
<Text style={styles.modalText}>{t('Hora_Nacimiento')}</Text>
<TextInput
  placeholderTextColor={theme.secondary}
  style={[styles.modalDateTimeInput, focusedField === 'hora' ? styles.focusedText : styles.defaultText]}
  keyboardType="numeric"
  placeholder="HH:MM"
  value={birthTime}
  onChangeText={handleHoraChange}
  onFocus={() => setFocusedField('hora')}
  onBlur={() => setFocusedField(null)}
/>
<View style={styles.pickerPlaceContainer}>
  <TouchableOpacity
    style={styles.modalInput}
    onPress={() => toggleDropdown("country")}
  >
    <TextInput
      placeholderTextColor={theme.secondary}
      style={{fontSize: RFValue(13), fontFamily: 'Effra_Regular', color: theme.secondary,}}
      placeholder={t('Seleccion_Ciudad')}
      value={searchTextCountry}
      onChangeText={handleCountrySearch} // Llama a la nueva función de búsqueda
      onFocus={() => { // Abre el dropdown cuando se enfoca el input
        if (!dropdownVisible.country) {
          toggleDropdown("country");
        }
      }}
    />
  </TouchableOpacity>

  {dropdownVisible.country && (
  <View
    style={[
      styles.dropdownBox,
      { maxHeight: 100, overflow: 'hidden' }
    ]}
  >
      <FlatList
        data={filteredCountries.length > 0 ? filteredCountries : []} // Usa filteredCountries
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCountrySelect(item)}>
            <Text style={styles.dropdownTextStyles}>
              {i18n.language === 'es' ? countryTranslations[item] || item : item}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => ( // Muestra mensaje si no hay resultados
          <Text style={styles.dropdownTextStyles}>{t('No_Resultados')}</Text>
        )}
      />
    </View>
  )}
</View>
        <View style={styles.pickerPlaceContainer}>
        <TouchableOpacity style={styles.modalInput}>
              <TextInput
              placeholderTextColor={theme.secondary}
                style={{fontSize: RFValue(13), fontFamily: 'Effra_Regular', color: theme.secondary,}} 
                placeholder={t('Seleccion_Ciudad')}
                value={birthCity}
                onFocus={() => {
                  if (birthCountry && !dropdownVisible.city) {toggleDropdown("city");} }}
                onChangeText={handleCitySearch}
                editable={!!birthCountry}
              />
        </TouchableOpacity>
              {dropdownVisible.city && birthCountry && (
              <Animated.View style={[styles.dropdownBox,{maxHeight: 150, minHeight: 35, height: dropdownAnim.city.interpolate({ inputRange: [0, 1], outputRange: [0, Math.min(filteredCities.length * 35, 130)] }),},]}>
                  <FlatList
                    data={filteredCities}
                    keyExtractor={(item) => item.value}
                    ListEmptyComponent={<Text style={styles.dropdownTextStyles}>{t('No_Resultados')}</Text>}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => {
                        setBirthCity(item.label);
                        toggleDropdown("city");
                      }}>
                        <Text style={styles.dropdownTextStyles}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </Animated.View>
              )}
            
            </View>
            <TouchableOpacity  onPress={handleSubmit} style={styles.modalButtonContainer}>
                                          <LinearGradient
                                            colors={['#0098E7','#6E4FE5']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 0, y: 1 }}
                                            style={styles.gradientBackground}
                                          >
                                             <View style={styles.progressContainer}>
                                                            <Animated.View style={[styles.progressFill, { width: widthInterpolation }]} />
                                                           <Text style={styles.modalButtonEditText}>{t('Editar')}</Text>
                                                          </View>
                                          </LinearGradient>
                                        </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
              <AddIcon style={styles.modalCloseButtonIcon} />
            </TouchableOpacity>
            </View></TouchableWithoutFeedback>
        </LinearGradient>
                </Animated.View>
                </Animated.View></TouchableWithoutFeedback>
                </Modal></KeyboardAvoidingView>
    );
    
};


  
export default EditInfoModal;
