import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text,TouchableOpacity, TextInput, ScrollView,StatusBar, FlatList, KeyboardAvoidingView,Platform,TouchableWithoutFeedback,Keyboard, Dimensions, Image, StyleSheet, Animated } from "react-native";
import { signUpUser } from "../config/firebaseConfig"; 
import {LinearGradient} from 'expo-linear-gradient';
import { Button } from 'react-native-elements';
import DateTimePicker from "@react-native-community/datetimepicker";
import cities from '../data/cities.json';
import DatePicker from "react-native-date-picker";
import {Picker} from '@react-native-picker/picker';
import colors from '../utils/colors';
import { SelectList } from "react-native-dropdown-select-list";
import SeeIcon from '../../assets/icons/SeeIcon'
import NoSeeIcon from '../../assets/icons/NoSeeIcon'
import { useToast } from "../contexts/ToastContext";
import { useTranslation } from "react-i18next";
import AddIcon from '../../assets/icons/AddIcon';
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');
import { ThemeContext } from '../contexts/ThemeContext';
import countryTranslations from '../utils/countryTranslations'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";

const SignUpScreen = ({ goToLogin }) => {  
    const { theme } = useContext(ThemeContext);
  const { t, i18n  } = useTranslation();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");  
  const [lastName, setLastName] = useState("");  
   const [latitud, setLatitud] = useState('');
    const [longitud, setLongitud] = useState('');
  const [birthDate, setBirthDate] = useState(""); 
  const [birthTime, setBirthTime] = useState("");
  const [birthCountry, setBirthCountry] = useState("");  
  const [birthCity, setBirthCity] = useState(""); 
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [showTimePicker, setShowTimePicker] = useState(false); 
  const [fechaMostrada, setFechaMostrada] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [focusedField, setFocusedField] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState({ country: false, city: false });
const [searchTextCountry, setSearchTextCountry] = useState("");
    const [countries, setCountries] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
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
    setFilteredCountries(sortedCountries); 
  }, [i18n.language]);
  
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
    setSearchTextCountry(i18n.language === 'es' ? countryTranslations[country] || country : country); // Establece el texto del input al nombre del país seleccionado
    setSearchText(""); 
    toggleDropdown("country");
  };
  
const handleCitySearch = (text) => {
  setBirthCity(text);
  if (text === "") {
    setFilteredCities(citiesList);
    return;
  }

  // Modificación aquí: usar startsWith para buscar solo desde el inicio
  let filtered = citiesList.filter(city =>
    city.label.toLowerCase().startsWith(text.toLowerCase())
  );

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
      if (birthDate) {
        const [year, month, day] = birthDate.split('-');
    
        if (i18n === "en") {
          setFechaMostrada(`${day}/${month}/${year}`); 
        } else {
          setFechaMostrada(`${day}/${month}/${year}`); 
        }
      }
    }, [birthDate, i18n]);
    
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

    const handleSignUp = async () => {
      console.log("Valores de campos:", { email, password, name, lastName, birthDate, birthTime, birthCountry, birthCity });
      if (isLoading) return;
    
      const areFieldsComplete = email && password && name && lastName && birthDate && birthTime && birthCountry && birthCity;
      if (!areFieldsComplete) {
        showToast({ message: t("toast.Completar"), type: "alert" });
        return;
      }
    
      if (!birthCity) {
        showToast({ message: t("toast.Ciudad"), type: "alert" });
        return;
      }
      if (password.length < 6) {
        showToast({ message: t("toast.Min_Contraseña"), type: "alert" });
        return;
      }
    
      const [birthYear, birthMonth, birthDay] = birthDate.split('-');
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
    
      const [hours, minutes] = birthTime.split(':');
      if (parseInt(hours) < 0 || parseInt(hours) > 23) {
        showToast({ message: t("toast.Hora_Invalida"), type: "alert" });
        return;
      }
      if (parseInt(minutes) < 0 || parseInt(minutes) > 59) {
        showToast({ message: t("toast.Hora_Invalida"), type: "alert" });
        return;
      }
    
      setIsLoading(true);
      progress.setValue(0);
    
      Animated.timing(progress, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();
    
      try {
        const user = await signUpUser(email, password, name, lastName, birthDate, birthTime, birthCountry, birthCity);
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          showToast({ message: t("toast.Registrado"), type: "alert" });
        } else {
          showToast({ message: t("toast.Ups"), type: "error" });
        }
      }
    
      setIsLoading(false);
      Animated.timing(progress, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    };
    
  
  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"], 
  });
  

  return (

<LinearGradient colors={["#ccfbe7", "#e1eff5", "#f3c3f5"]} style={styles(theme).gradient}>

<View style={styles(theme).footer}>
      <Image source={require('../../assets/images/signupStars.png')} style={styles(theme).Image}  />
      <Text style={[ styles(theme).footerText,{ color: dropdownVisible.country || dropdownVisible.city ? "transparent" : "#333333" }]}>{t("Footer")}</Text>

    </View>
    <View style={styles(theme).headerContainer}>
      <Text style={styles(theme).title}>{t("Registrar_Titulo")}</Text>
      <Text style={styles(theme).subtitle}>{t("Registrar_Subtitulo")}</Text>
    </View>
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ height: height }}
  >
   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
   <ScrollView 
      contentContainerStyle={styles(theme).scrollContainer} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      scrollEnabled={!dropdownVisible.country && !dropdownVisible.city}
    >  
          
          <View style={styles(theme).form}>
            <View style={[styles(theme).inputContainer, focusedField === 'name' ? styles(theme).focusedBorder : styles(theme).defaultBorder]}>
            <TextInput placeholderTextColor={'#808080'}
        style={[styles(theme).input, focusedField === 'name' ? styles(theme).focusedText : styles(theme).defaultText]}
              placeholder={t("Nombre")}
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />
            </View>
            <View style={[styles(theme).inputContainer, focusedField === 'lastName' ? styles(theme).focusedBorder : styles(theme).defaultBorder]}>
            <TextInput  placeholderTextColor={'#808080'}
          style={[styles(theme).input, focusedField === 'lastName' ? styles(theme).focusedText : styles(theme).defaultText]}
              placeholder={t("Apellido")}
              value={lastName}
              onChangeText={setLastName}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
            />
</View>
          <Text style={styles(theme).text}>{t('Fecha_Nacimiento')}</Text>
          <View style={[styles(theme).inputContainer, focusedField === 'fecha' ? styles(theme).focusedBorder : styles(theme).defaultBorder]}>
          
                <TextInput
                  style={[styles(theme).inputDateTime, focusedField === 'fecha' ? styles(theme).focusedText : styles(theme).defaultText]}
                  value={fechaMostrada}
                  placeholderTextColor='#808080'
                   keyboardType="numeric"
                  placeholder={i18n.language === "en" ? "YYYY/MM/DD" : "DD/MM/YYYY"}
                  onChangeText={handleFechaChange}
                  onFocus={() => setFocusedField('fecha')}
                    onBlur={() => setFocusedField(null)}
                />
                </View>
                <Text style={styles(theme).text}>{t('Hora_Nacimiento')}</Text>
                <View style={[styles(theme).inputContainer, focusedField === 'hora' ? styles(theme).focusedBorder : styles(theme).defaultBorder]}>
          
                <TextInput
                  style={[styles(theme).inputDateTime, focusedField === 'hora' ? styles(theme).focusedText : styles(theme).defaultText]}
                  value={birthTime}
                  placeholderTextColor='#808080'
                  keyboardType="numeric"
                  placeholder="HH:MM"
                  onChangeText={handleHoraChange}
                  onFocus={() => setFocusedField('hora')}
                    onBlur={() => setFocusedField(null)}
                />
          </View>

<View style={[styles(theme).inputContainer, focusedField === 'email' ? styles(theme).focusedBorder : styles(theme).defaultBorder]}>
<TextInput  placeholderTextColor={'#808080'}
        style={[styles(theme).input, focusedField === 'email' ? styles(theme).focusedText : styles(theme).defaultText]}
              placeholder={t("Correo")}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
            </View>
            <View style={[styles(theme).inputContainer, focusedField === 'password' ? styles(theme).focusedBorder : styles(theme).defaultBorder]}>
  <TextInput  placeholderTextColor={'#808080'}
    style={[styles(theme).input, focusedField === 'password' ? styles(theme).focusedText : styles(theme).defaultText]}
    placeholder={t("Contraseña")}
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!passwordVisible}
    onFocus={() => setFocusedField('password')}
    onBlur={() => setFocusedField(null)}
  />
  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
    {passwordVisible ? (
      <NoSeeIcon style={[styles(theme).passwordIcon, focusedField === 'password' ? styles(theme).focusedPassword : styles(theme).defaultPassword]} />
    ) : (
      <SeeIcon style={[styles(theme).passwordIcon, focusedField === 'password' ? styles(theme).focusedPassword : styles(theme).defaultPassword]} />
    )}
  </TouchableOpacity>
</View>
  <View style={styles(theme).pickerPlaceContainer}>
    <TouchableOpacity
      style={[
        styles(theme).inputContainer,
        dropdownVisible.country ? styles(theme).focusedBorder : styles(theme).defaultBorder
      ]}
      onPress={() => toggleDropdown("country")}
    >
      <TextInput
        style={[
          styles(theme).input,
          dropdownVisible.country ? styles(theme).focusedText : styles(theme).defaultText
        ]}
        placeholder={t('Seleccion_Pais')} 
        placeholderTextColor={'#808080'}
        value={searchTextCountry} // Usa el nuevo estado para el valor del TextInput
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
      styles(theme).dropdownBox,
      { maxHeight: 100, overflow: 'hidden' }
    ]}
  ><ScrollView nestedScrollEnabled={true}>
          {filteredCountries.length > 0 ? ( // Muestra la lista de países filtrados
            filteredCountries.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => handleCountrySelect(item)}
              >
                <Text style={styles(theme).dropdownTextStyles}>{i18n.language === 'es' ? countryTranslations[item] || item : item}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles(theme).dropdownTextStyles}>{t('No_Resultados')}</Text>
          )}
        </ScrollView>
      </View>
    )}
  </View>
<View style={styles(theme).pickerPlaceContainer}>
<TouchableOpacity disabled={!birthCountry} style={[styles(theme).inputContainer, dropdownVisible.city ? styles(theme).focusedBorder : styles(theme).defaultBorder]} onPress={() => toggleDropdown("city")}>
<TextInput 
      style={[
        styles(theme).input,
        dropdownVisible.city ? styles(theme).focusedText : styles(theme).defaultText,
      ]}
      placeholder={t('Seleccion_Ciudad')}
      placeholderTextColor={'#808080'}
      value={birthCity}
      onFocus={() => {
        if (birthCountry && !dropdownVisible.city) {
          toggleDropdown("city");
        }
      }}
      onChangeText={handleCitySearch}
      editable={!!birthCountry}
    />
  </TouchableOpacity>

  {dropdownVisible.city && birthCountry && (
  <View
    style={[
      styles(theme).dropdownBox,
      { maxHeight: 100, overflow: 'hidden' }
    ]}
  >
    <ScrollView nestedScrollEnabled={true}>
      {filteredCities.length > 0 ? (
        filteredCities.map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => {
              setBirthCity(item.label);
              toggleDropdown("city");
            }}
          >
            <Text style={styles(theme).dropdownTextStyles}>{item.label}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles(theme).dropdownTextStyles}>{t('No_Resultados')}</Text>
      )}
    </ScrollView>
  </View>
)}

</View>

 <TouchableOpacity style={styles(theme).button} onPress={handleSignUp} disabled={isLoading}>
              <View style={styles(theme).progressContainer}>
                <Animated.View style={[styles(theme).progressFill, { width: widthInterpolation }]} />
                <Text style={styles(theme).buttonText}>{t("Registrar_Boton")}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles(theme).navigate}>
              <Text style={styles(theme).loginText}>{t("Ingresar_Pregunta")}</Text>
              <TouchableOpacity onPress={goToLogin} >
                <Text style={styles(theme).loginButton}>{t("Ingresar_Link")}</Text>
              </TouchableOpacity>
            </View>
            </View>
            </ScrollView>
            
            </TouchableWithoutFeedback>

            </KeyboardAvoidingView>

            </LinearGradient>

  );
  
};
const styles = (theme) => StyleSheet.create({
  gradient:{
    height: height // 100% de la altura de la pantalla
  },
  headerContainer: {
    alignItems: "center",
    marginTop: hp('5.5%') // Aproximadamente 45 / 812 * 100%
  },
  form: {
    gap: hp('1.2%'), // Aproximadamente 10 / 812 * 100%
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: wp('5.3%'), // Aproximadamente 20 / 375 * 100%
  },
  title: {
    fontSize: RFValue(32), // Equivalente a height * 0.045
    fontFamily: 'Effra_Bold',
    textAlign: "center",
    lineHeight: RFValue(30), // Equivalente a height * 0.045
    maxWidth: wp('90%'), // 90% del ancho de la pantalla
    marginHorizontal: 'auto',
    color: '#333333'
  },
  subtitle: {
    fontSize: RFValue(22), // Equivalente a height * 0.03
    marginHorizontal: 'auto',
    fontFamily: 'Effra_Light',
    textAlign: "center",
    lineHeight: RFValue(30), // Equivalente a height * 0.04
    maxWidth: wp('80'), // 90% del ancho de la pantalla
    marginVertical: hp('0.6%') // Aproximadamente 5 / 812 * 100%
  },
  text: {
    fontSize: RFValue(12), // Equivalente a height * 0.015
    fontFamily: 'Effra_Regular',
    textAlign: "start",
    color: '#808080',
    paddingLeft: wp('2.7%'), // Aproximadamente 10 / 375 * 100%
  },
  inputContainer: {
    height: RFValue(30),
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: RFValue(50),
    paddingHorizontal: wp('4%'),
    justifyContent: 'space-between',
    alignItems:'center',
  },
  focusedBorder:{
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: RFValue(50),
  },
  defaultBorder:{
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: RFValue(50),
  },
  focusedText:{
    color: 'black',
  },
  defaultText:{
    color: '#808080',
  },
  crossIcon:{
    width: wp('3.2%'), // Aproximadamente 12 / 375 * 100%
    height: hp('1.5%'), // Aproximadamente 12 / 812 * 100%
    transform: [{ rotate: '45deg' }],
    marginVertical: 'auto',
  },
  passwordIcon:{
    width: wp('5.3%'), // Aproximadamente 20 / 375 * 100%
    height: hp('2.5%'), // Aproximadamente 20 / 812 * 100%
    marginVertical: 'auto',
  },
  focusedPassword:{
    fill:'black'
  },
  defaultPassword:{
    fill:'#808080'
  },
  datePicker: {
    height: hp('4.6%'), // Equivalente a height * 0.045
    borderColor: '#808080',
    backgroundColor: 'transparent',
    borderWidth: 1,
    padding: 0,
    width: "100%",
    borderRadius: RFValue(50),
    fontFamily: 'Effra_Regular',
    fontSize: RFValue(15),
    margin: 'auto'
  },
  inputDateTime: {
    display:'flex',
    fontSize: RFValue(12), 
    height: RFValue(32),
    fontFamily: 'Effra_Regular',
    marginHorizontal: 'auto',
    textAlign:'center',
    color: '#808080',
    paddingHorizontal: wp('25%'),
  },
  dropdownBox:{
    borderBottomRightRadius: RFValue(20),
    borderBottomLeftRadius: RFValue(20),
    borderWidth: 1,
    marginTop: hp('1%'), // Aproximadamente 15 / 812 * 100%
    marginHorizontal: wp('2.7%'), // Aproximadamente 10 / 375 * 100%
    borderColor: '#808080',
    color: '#808080',
    fontSize: RFValue(16),
    fontFamily: 'Effra_Regular',
  },
  dropdownList:{
    width: wp('83%'), // 83% del ancho de la pantalla
    alignSelf: 'center',
    maxHeight: hp('20%'), // 20% de la altura de la pantalla
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 0,
    borderBottomLeftRadius: RFValue(20),
    borderBottomRightRadius: RFValue(20),
  },
  inputStyles:{
    color: '#808080',
    fontFamily: 'Effra_Regular',
    fontSize: RFValue(13), // Equivalente a height * 0.016
    lineHeight: RFValue(14), // Equivalente a height * 0.017
  },
  dropdownTextStyles:{
    color: '#808080',
    fontSize: RFValue(13), // Equivalente a height * 0.016
    fontFamily: 'Effra_Regular',
    paddingHorizontal: wp('4%'), // Aproximadamente 15 / 375 * 100%
    paddingVertical: hp('0.6%') // Aproximadamente 5 / 812 * 100%
  },
  modalInput: {
    height: RFValue(36),  // Equivalente a height * 0.045
    paddingHorizontal: wp('4%'), // Aproximadamente 15 / 375 * 100%
    borderRadius: RFValue(20),
    borderWidth: 1,
    borderColor: '#808080',
    color: '#808080',
    fontSize: RFValue(13), // Equivalente a height * 0.016
    fontFamily: 'Effra_Regular',
  },
  input: {
    paddingHorizontal: wp('0.5%'),
    borderRadius: RFValue(20),
    textAlign: 'left',
    height: '125%',
    color: '#808080',
    fontSize: RFValue(13),
    fontFamily: 'Effra_Regular',
    width: '90%',
  },
  titleDatePicker: {
    color: '#808080',
    fontSize: RFValue(13), // Equivalente a height * 0.016
    fontFamily: 'Effra_Regular',
    padding: 0,
    margin: 0,
  },
  navigate: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: RFValue(5) // Usamos RFValue para la separación entre elementos
  },
  button: {
    width: wp('30%'), // 40% del ancho de la pantalla
    height: hp('4%'), // 4% de la altura de la pantalla
    borderRadius: RFValue(100),
    marginHorizontal: 'auto',
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  progressContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    height: "100%",
    backgroundColor: "#666666",
  },
  buttonText: {
    fontSize: RFValue(13), 
    color: '#FFFFFF', 
    fontFamily: 'Effra_Regular',
    transform: [{ translateY: RFValue(-1) }]
  },
  loginText:{
    fontSize: RFValue(14),
    color: '#333333',
    fontFamily: 'Effra_Light',
  },
  loginButton:{
    color: '#A358B5',
    fontSize: RFValue(14), // Equivalente a height * 0.017
    fontFamily: 'Effra_Medium',
  },
  footerText:{
    fontSize: wp('3%'), // 3% del ancho de la pantalla
    fontFamily: 'Effra_Light',
    bottom: hp('12%'), // 6% de la altura de la pantalla
    marginHorizontal: 'auto',
    position:'absolute'
  },
  footer:{
    position: "absolute",
    bottom: hp('-4%'), // Equivalente a height * -0.04
    width: wp('100%'), // 100% del ancho de la pantalla
    height: hp('25%'), // 25% de la altura de la pantalla
    alignItems: "center",
    justifyContent: "center",
  },
  Image:{
    width: "100%",
    height: "100%",
    opacity: 0.5
  }
});
export default SignUpScreen;
