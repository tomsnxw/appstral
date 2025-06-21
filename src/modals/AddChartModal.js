import React, { useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import { View, TouchableWithoutFeedback, Text, TextInput, Animated,TouchableOpacity, FlatList, KeyboardAvoidingView,Keyboard, StyleSheet, PanResponder, Platform, Alert,Dimensions, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import { auth, db, addDoc, collection, increment,doc,getDoc, updateDoc } from '../config/firebaseConfig';
import Svg, { Circle, Line, G, Image, Text as SvgText } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import {LinearGradient} from 'expo-linear-gradient';
import { Button } from 'react-native-elements';
import cities from '../data/cities.json';
import {Picker} from '@react-native-picker/picker';
import CrossIcon from "../../assets/icons/CrossIcon";
import CheckIcon from "../../assets/icons/CheckIcon";
import AlertIcon from "../../assets/icons/AlertIcon";
import AddIcon from '../../assets/icons/AddIcon';
import colors from '../utils/colors';
import { SelectList } from 'react-native-dropdown-select-list';
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window'); 
import CustomToast from "../components/CustomToast";
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import countryTranslations from '../utils/countryTranslations'
import { useUser } from '../contexts/UserContext';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";

const AddChartModal =  ({handleCloseAddModal, visible, navigation})  => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const { t, i18n  } = useTranslation();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState(''); 
  const [fecha, setFecha] = useState(''); 
  const [fechaMostrada, setFechaMostrada] = useState(''); 
  const [hora, setHora] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [loading, setLoading] = useState(false);
  const [pais, setPais] = useState('');
  const { userData } = useUser();
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [showTimePicker, setShowTimePicker] = useState(false); 
  const [translateY, setTranslateY] = useState(new Animated.Value(height));  
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [focusedField, setFocusedField] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState({ country: false, city: false });
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
const [searchTextCountry, setSearchTextCountry] = useState("");
  const [searchText, setSearchText] = useState(""); 
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
    setFilteredCountries(sortedCountries); // Inicializa filteredCountries con todos los países
  }, [i18n.language]);

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
    setPais(country);
    setCiudad(null);
    setLatitud(null);
    setLongitud(null);
    setCitiesList(cities[country] || []);
    setFilteredCities(cities[country] || []);
    setSearchTextCountry(i18n.language === 'es' ? countryTranslations[country] || country : country); 
    setSearchText(""); 
    toggleDropdown("country");
  };

  const obtenerCoordenadasCiudad = (city) => {
    const ciudadSeleccionada = citiesList.find((item) => item.label === city);
    if (ciudadSeleccionada) {
      setLatitud(ciudadSeleccionada.lat);
      setLongitud(ciudadSeleccionada.lng);
    }
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

  

  const progress = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 100) {
          handleCloseAddModal();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true
          }).start();
        }
      }
    })
  ).current;

  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"], 
  });
  const guardarNuevaCarta = async () => {
    if (!auth.currentUser) {
      showToast({ message: t("toast.Ups"), type: "error" });
      return;
    }
  
    if (!nombre || !apellido || !fecha || !hora || !pais || !ciudad) {
      showToast({ message: t("toast.Completar"), type: "alert" });
      return;
    }
  
    const [birthYear, birthMonth, birthDay] = fecha.split('-');
    if (birthYear < 1699 || birthYear > 2100) {
      showToast({ message: t("toast.Fecha_Invalida"), type: "alert" });
      return;
    }
    if (birthMonth < 1 || birthMonth > 12) {
      showToast({ message: t("toast.Fecha_Invalida"), type: "alert" });
      return;
    }
    if (birthDay < 1 || birthDay > 31) {
      showToast({ message: t("toast.Fecha_Invalida"), type: "alert" });
      return;
    }
  
    const [hours, minutes] = hora.split(':');
    if (parseInt(hours) < 0 || parseInt(hours) > 23) {
      showToast({ message: t("toast.Hora_Invalida"), type: "alert" });
      return;
    }
    if (parseInt(minutes) < 0 || parseInt(minutes) > 59) {
      showToast({ message: t("toast.Hora_Invalida"), type: "alert" });
      return;
    }
  
    setLoading(true);
    progress.setValue(0);
  
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  
    try {
      const userCartasRef = collection(db, "users", auth.currentUser.uid, "cartas");
      const docRef = await addDoc(userCartasRef, {
        nombre,
        apellido,
        fecha,
        hora,
        pais,
        ciudad,
        latitud,
        longitud,
        creado: new Date(),
        especial: false, // Asumo que las cartas agregadas por este medio no son especiales
      });
  
      // Decrementar extraCharts si el usuario no es premium
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userDocRef);
      const userData = userSnap.data();
  
      if (userData?.membresia !== 'estelar' && userData?.extraCharts > 0) {
        await updateDoc(userDocRef, {
          extraCharts: increment(-1),
        });
      }
  
      const cartaData = { nombre, apellido, fecha, hora, pais, ciudad, latitud, longitud, id: docRef.id };
      handleCloseAddModal();
      setTimeout(() => {
        navigation.navigate("ChartDetails", { cartaId: docRef.id });
      }, 300);
    } catch (error) {
      showToast({ message: t("toast.No_Agregado"), type: "error" });
      console.error(error);
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
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        });
      } else {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsModalVisible(false); 
        });
      }
    }, [visible]);
  
    const [toast, setToast] = useState(null);
  
    const showToast = ({ message, type }) => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
    };
  

    
       useEffect(() => {
        if (fecha) {
          const [year, month, day] = fecha.split('-');
          setFechaMostrada(i18n.language === "en" ? `${year}/${month}/${day}` : `${day}/${month}/${year}`);
        }
      }, [fecha, i18n.language]);
    

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
      };
  return (
    <KeyboardAvoidingView behavior='none' >
    <Modal animationType="none" transparent={true} statusBarTranslucent={true} visible={isModalVisible} onRequestClose={handleCloseAddModal}>
           <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
               <Animated.View  style={[styles.modalContainer,{ opacity: fadeAnim }]}>
               
                <Animated.View style={{...styles.modalContent, transform: [{ translateY }], }}  {...panResponder.panHandlers}>
            <LinearGradient style={styles.modalContent} colors={[theme.sheetGradientTop, theme.sheetGradientBottom]} >
                <View style={styles.modalSlider}/>
                <TouchableWithoutFeedback onPress={() => {}}>
       
        <View style={styles.modalForm}>
        <Text style={styles.modalTitle}>{t('Agregar_Carta')}</Text>
       <TextInput
         style={[styles.modalInput, focusedField === 'nombre' ? styles.focusedText : styles.defaultText]}
         placeholderTextColor={theme.secondary}
         value={nombre}
         onChangeText={setNombre}
         placeholder={t('Nombre')}
       />
       <TextInput
         style={[styles.modalInput, focusedField === 'apellido' ? styles.focusedText : styles.defaultText]}
         placeholderTextColor={theme.secondary}
         value={apellido}
         onChangeText={setApellido}
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
             value={hora}
             keyboardType="numeric"
             placeholder="HH:MM"
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
      value={searchTextCountry} // Usa el nuevo estado para el valor del TextInput
      onChangeText={handleCountrySearch} // Llama a la nueva función de búsqueda
      onFocus={() => { // Abre el dropdown cuando se enfoca el input
        if (!dropdownVisible.country) {
          toggleDropdown("country");
        }
      }}
      placeholder={t('Seleccion_Pais')}
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
              value={ciudad}
              onFocus={() => pais && toggleDropdown("city")}
              onChangeText={handleCitySearch}
              editable={!!pais}
            />
      </TouchableOpacity>
            {dropdownVisible.city && pais && (
  <View
    style={[
      styles.dropdownBox,
      { maxHeight: 100, overflow: 'hidden' }
    ]}
  >
    <FlatList
                  data={filteredCities}
                  keyExtractor={(item) => item.value}
                  ListEmptyComponent={<Text style={styles.dropdownTextStyles}>{t('No_Resultados')}</Text>}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                      setCiudad(item.label);
                      obtenerCoordenadasCiudad(item.label);
                      toggleDropdown("city");
                    }}>
                      <Text style={styles.dropdownTextStyles}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          
          </View>
 
         <TouchableOpacity  onPress={guardarNuevaCarta} style={styles.modalButtonContainer}>
                            <LinearGradient
                              colors={['#0098E7','#6E4FE5']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 0, y: 1 }}
                              style={styles.gradientBackground}
                            >
                               <View style={styles.progressContainer}>
                                              <Animated.View style={[styles.progressFill, { width: widthInterpolation }]} />
                                             <Text style={styles.modalButtonEditText}>{t('Agregar')}</Text>
                                            </View>
                            </LinearGradient>
                          </TouchableOpacity>
 
       <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseAddModal}>
           <AddIcon style={styles.modalCloseButtonIcon} />
         </TouchableOpacity>
     </View></TouchableWithoutFeedback>
     </LinearGradient>
             </Animated.View>
             
             </Animated.View></TouchableWithoutFeedback>
             
             {toast && <CustomToast message={toast.message} type={toast.type} />}
             </Modal></KeyboardAvoidingView>
   );
};

export default AddChartModal;
