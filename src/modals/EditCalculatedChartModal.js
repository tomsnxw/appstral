import React, { useState, useRef,useEffect, useMemo, useContext } from 'react';
import { View, Text, TextInput,TouchableOpacity,TouchableWithoutFeedback, FlatList, Dimensions, Modal, Animated, Alert } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { Button } from 'react-native-elements';
import cities from '../data/cities.json';
import colors from '../utils/colors';
import AddIcon from '../../assets/icons/AddIcon';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window'); 
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import { useTranslation } from 'react-i18next';
import countryTranslations from '../utils/countryTranslations'

const EditCalculatedChartModal = ({ handleCloseEditModal, visible, nombre, setNombre, apellido, setApellido,setIsEdited, fecha, setFecha,  hora, setHora, ciudad, setCiudad, pais, setPais, handleCalculate }) => {
const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const [tempNombre, setTempNombre] = useState(nombre || "");
    const [tempApellido, setTempApellido] = useState(apellido || "");
    const [tempFecha, setTempFecha] = useState(fecha || "");
    const [tempHora, setTempHora] = useState(hora || "");
    const [tempPais, setTempPais] = useState(pais || "");
const [tempCiudad, setTempCiudad] = useState(ciudad || "");    
    const [loading, setLoading] = useState(true);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [showTimePicker, setShowTimePicker] = useState(false); 
  const [fechaMostrada, setFechaMostrada] = useState('');
  const [translateY, setTranslateY] = useState(new Animated.Value(height));  
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
  const [isModalVisible, setIsModalVisible] = useState(false); 
const [focusedField, setFocusedField] = useState(null);
const progress = useRef(new Animated.Value(0)).current;
   const [dropdownVisible, setDropdownVisible] = useState({ country: false, city: false });
   const [countries, setCountries] = useState([]);
   const [citiesList, setCitiesList] = useState([]);
   
   const [searchText, setSearchText] = useState("");
   const { t, i18n  } = useTranslation();  
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
          setTempFecha(`${part1}-${part2}-${part3}`);
        } else {
          setTempFecha(`${part3}-${part2}-${part1}`);
        }
      }
    } else {
      setTempFecha(''); 
    }
  };

      const handleHoraChange = (text) => {
        let formattedText = text.replace(/[^0-9]/g, ''); 
        
        if (formattedText.length > 2) {
          formattedText = `${formattedText.slice(0, 2)}:${formattedText.slice(2, 4)}`;
        }
        
        setHora(formattedText);
      };

  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"], 
  });


  const handleEdit = async () => {
    setLoading(true);
    progress.setValue(0);
  
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false, 
    }).start(() => {
      progress.setValue(0);
      setLoading(false);
      setIsEdited(true);
    });
  
    try {
      setNombre(tempNombre || "");
      setApellido(tempApellido || "");
      setFecha(tempFecha || "");
      setHora(tempHora || "");
      setPais(tempPais || "");
      setCiudad(tempCiudad || "");
  
      await handleCalculate();
    } catch (error) {
      showToast({ message: t("toast.Ups"), type: "error" });
      setLoading(false);
    }};
   const dropdownAnim = {
      country: useRef(new Animated.Value(0)).current,
      city: useRef(new Animated.Value(0)).current
    };
  
    useEffect(() => {
      setCountries(Object.keys(cities)); 
    }, []);
  
    useEffect(() => {
      if (tempPais && cities[tempPais]) {
        setCitiesList(cities[tempPais]);
        setFilteredCities(cities[tempPais]);
      }
    }, [tempPais]);
  
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
    
      const regex = new RegExp(text, "i"); 
      let filtered = citiesList.filter(city => regex.test(city.label));
    
      if (text.toLowerCase() === "caba") {
        const cabaOption = { label: "Ciudad de Buenos Aires", value: "CABA" };
        if (!filtered.some(city => city.label === cabaOption.label)) {
          filtered = [cabaOption, ...filtered];
        }
      }
    
      setFilteredCities(filtered);
    };
    return (
<Modal animationType="none" transparent={true} statusBarTranslucent={true} visible={isModalVisible} onRequestClose={handleCloseEditModal}>
               <TouchableWithoutFeedback onPress={handleCloseEditModal}>
                  <Animated.View  style={[styles.modalContainer,{ opacity: fadeAnim }]}>
                  
               <Animated.View style={{...styles.modalContent, transform: [{ translateY }], }}>
               <LinearGradient style={styles.modalContent} colors={[theme.sheetGradientTop, theme.sheetGradientBottom]} >
                   <View style={styles.modalSlider}/>
                   <TouchableWithoutFeedback onPress={() => {}}>
          
           <View style={styles.modalForm}>
           <Text style={styles.modalTitle}>{t('Editar_Carta')}</Text>
          <TextInput
            style={[styles.modalInput, focusedField === 'nombre' ? styles.focusedText : styles.defaultText]}
            value={tempNombre}
            onChangeText={setTempNombre}
            placeholder={t('Nombre')}
          />
          <TextInput
            style={[styles.modalInput, focusedField === 'nombre' ? styles.focusedText : styles.defaultText]}
            value={tempApellido}
            onChangeText={setTempApellido}
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
              <TouchableOpacity style={styles.modalInput} onPress={() => toggleDropdown("country")}>
              <TextInput style={styles.input} editable={false}>
  {tempPais
    ? (i18n.language === 'es' ? (countryTranslations[tempPais] || tempPais) : tempPais)
    : t('Seleccion_Pais')}
</TextInput>
              </TouchableOpacity>
        
              {dropdownVisible.country && (
              <Animated.View style={[styles.dropdownBox,{maxHeight: 150, minHeight: 35, height: dropdownAnim.country.interpolate({ inputRange: [0, 1], outputRange: [0, Math.min(countries.length * 35, 130)] }),},]}>
                  <FlatList
                    data={countries}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleCountrySelect(item)}>
                        <Text style={styles.dropdownTextStyles}>{i18n.language === 'es' ? countryTranslations[item] || item : item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </Animated.View>
              )}
        </View>
        <View style={styles.pickerPlaceContainer}>
        <TouchableOpacity style={styles.modalInput}>
              <TextInput
              placeholderTextColor={theme.secondary}
                style={styles.input} 
                placeholder= {tempCiudad || t('Seleccion_Ciudad')}
                value={ciudad}
                onFocus={() => {
                  if (pais && !dropdownVisible.city) {toggleDropdown("city");} }}
                onChangeText={handleCitySearch}
                editable={!!tempPais}
              />
        </TouchableOpacity>
              {dropdownVisible.city && tempPais && (
              <Animated.View style={[styles.dropdownBox,{maxHeight: 150, minHeight: 35, height: dropdownAnim.city.interpolate({ inputRange: [0, 1], outputRange: [0, Math.min(filteredCities.length * 35, 130)] }),},]}>
                  <FlatList
                    data={filteredCities}
                    keyExtractor={(item) => item.value}
                    ListEmptyComponent={<Text style={styles.dropdownTextStyles}>{t('No_Resultados')}</Text>}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => {
                        setTempCiudad(item.label);
                        toggleDropdown("city");
                      }}>
                        <Text style={styles.dropdownTextStyles}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </Animated.View>
              )}
            
            </View>
          <TouchableOpacity  onPress={handleEdit} style={styles.modalButtonContainer}>
                               <LinearGradient
                                 colors={['#0098E7','#6E4FE5']}
                                 start={{ x: 0, y: 0 }}
                                 end={{ x: 0, y: 1 }}
                                 style={styles.gradientBackground}
                               >
                                  <View style={styles.progressContainer}>
                                                 <Animated.View style={[styles.progressFill, { width: widthInterpolation }]} />
                                                <Text style={styles.modalButtonEditText}>Editar</Text>
                                               </View>
                               </LinearGradient>
                             </TouchableOpacity>
    
    
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseEditModal}>
              <AddIcon style={styles.modalCloseButtonIcon} />
            </TouchableOpacity>
                    </View>
                    </TouchableWithoutFeedback>
                    </LinearGradient>
        </Animated.View></Animated.View></TouchableWithoutFeedback>
        </Modal>
      );
    
};

  
  
export default EditCalculatedChartModal;
