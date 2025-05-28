import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { View, Text,TextInput, FlatList, StyleSheet, Dimensions, Easing, Animated, ScrollView, Alert, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, } from 'react-native';
import { auth, db, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, increment } from '../config/firebaseConfig';
import Svg, { Circle, Line, G, Image, Text as SvgText, Polygon,Path, Defs, Marker } from 'react-native-svg';
import { useCasa } from '../contexts/CasaContext';
import { useFonts } from 'expo-font';
import cities from '../data/cities.json';
import {LinearGradient} from 'expo-linear-gradient';
import EditIcon from "../../assets/icons/EditIcon";
import ShareIcon from "../../assets/icons/ShareIcon";
import AddIcon from "../../assets/icons/AddIcon";
import SaveIcon from "../../assets/icons/SaveIcon";
import { useToast } from "../contexts/ToastContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import ShareCalculatedChartModal from "../modals/ShareCalculatedChartModal";
import EditCalculatedChartModal from "../modals/EditCalculatedChartModal";
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import LunaLIcon from "../../assets/icons/LunaLIcon";
import LunaMIcon from "../../assets/icons/LunaMIcon";
import LunaCIcon from "../../assets/icons/LunaCIcon";
import LunaNIcon from "../../assets/icons/LunaNIcon";
import countryTranslations from '../utils/countryTranslations'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize"; 

const CalculateScreen = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const { showToast } = useToast();
    const [faseLunar, setFaseLunar] = useState(null);
  const [isPressable, setIsPressable] = useState(false);
 const [isCartaGuardada, setIsCartaGuardada] = useState(false);
  const { t, i18n  } = useTranslation();
  const {userData} = useUser();
  const [nombre, setNombre] = useState(''); 
  const [apellido, setApellido] = useState(''); 
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [resultado, setResultado] = useState(null);
  const [ascendente, setAscendente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorCiudad, setErrorCiudad] = useState('');
  const { sistemaCasas, setSistemaCasas } = useCasa();
  const [formEnviado, setFormEnviado]  = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [fechaMostrada, setFechaMostrada] = useState(''); 
  const AnimatedSvg = Animated.createAnimatedComponent(Svg);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedLine = Animated.createAnimatedComponent(Line);
  const AnimatedText = Animated.createAnimatedComponent(SvgText);
  const AnimatedG = Animated.createAnimatedComponent(G);
  const [showLunarTooltip, setShowLunarTooltip] = useState(false);
  useEffect(() => {
    if (showLunarTooltip) {
      const timer = setTimeout(() => {
        setShowLunarTooltip(false);
      }, 2000);
  
      return () => clearTimeout(timer);
    }
  }, [showLunarTooltip]);
  
  
  const renderLunarIcon = () => {
    const translations = {
      "Luna Nueva": { es: "Luna Nueva", en: "New Moon" },
      "Luna Creciente": { es: "Luna Creciente", en: "Waxing Crescent" },
      "Cuarto Creciente": { es: "Cuarto Creciente", en: "First Quarter" },
      "Gibosa Creciente": { es: "Gibosa Creciente", en: "Waxing Gibbous" },
      "Luna Llena": { es: "Luna Llena", en: "Full Moon" },
      "Gibosa Menguante": { es: "Gibosa Menguante", en: "Waning Gibbous" },
      "Cuarto Menguante": { es: "Cuarto Menguante", en: "Last Quarter" },
      "Luna Menguante": { es: "Luna Menguante", en: "Waning Crescent" },
    };
  
    const translatedFaseLunar = translations[faseLunar]?.[i18n.language] || faseLunar;
  
    const tooltipWidths = {
      "Luna Nueva": 80,
      "Luna Creciente": 100,
      "Cuarto Creciente": 110,
      "Gibosa Creciente": 120,
      "Luna Llena": 80,
      "Cuarto Menguante": 120,
      "Luna Menguante": 100,
      "Gibosa Menguante": 115,
    };
  
    const tooltipWidth = tooltipWidths[faseLunar] || 90;
    const isNorthernHemisphere = i18n.language === "en";
  
    const isCreciente = ["Luna Creciente", "Cuarto Creciente", "Gibosa Creciente"].includes(faseLunar);
    const isMenguante = ["Cuarto Menguante", "Luna Menguante", "Gibosa Menguante"].includes(faseLunar);
  
    const showCrecienteIcon = isNorthernHemisphere ? isMenguante : isCreciente;
    const showMenguanteIcon = isNorthernHemisphere ? isCreciente : isMenguante;
  
    return (
      <View style={{ alignItems: 'center', width: height * 0.04, transform: [{ translateY: 5 }] }}>
        <TouchableOpacity
          disabled={!isPressable}
          onPress={() => setShowLunarTooltip(!showLunarTooltip)}
        >
          {faseLunar === "Luna Nueva" && <LunaNIcon style={{ width: height * 0.02, height: height * 0.02 }} />}
          {showCrecienteIcon && <LunaCIcon style={{ width: height * 0.02, height: height * 0.02 }} />}
          {faseLunar === "Luna Llena" && <LunaLIcon style={{ width: height * 0.02, height: height * 0.02 }} />}
          {showMenguanteIcon && <LunaMIcon style={{ width: height * 0.02, height: height * 0.02 }} />}
        </TouchableOpacity>
  
        {showLunarTooltip && (
          <View
            style={{
              position: 'absolute',
              top: height * 0.02,
              backgroundColor: theme.black,
              paddingVertical: 4,
              paddingTop: 5,
              width: tooltipWidth,
              paddingHorizontal: 7,
              borderRadius: 5,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: height * 0.012,
                color: theme.white,
                fontFamily: 'Effra_Regular',
                textAlign: 'center',
              }}
            >
              {translatedFaseLunar}
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  

  const planetasOrden = {
    es: [
      "Sol", "Luna", "Mercurio", "Venus", "Marte", "Júpiter", "Saturno", 
      "Urano", "Neptuno", "Plutón", "Lilith", "Quirón", "Nodo Norte"
    ],
    en: [
      "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", 
      "Uranus", "Neptune", "Pluto", "Lilith", "Chiron", "North Node"
    ]
  };
  const currentPlanetsOrder = [
    ...planetasOrden[i18n.language].slice(0, 2),
    ...(!planetasOrden[i18n.language].includes(t("Ascendente")) ? [t("Ascendente")] : []),
    ...planetasOrden[i18n.language].slice(2)
  ];
  const scaleAnim = useRef(new Animated.Value(0.25)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rotatePlanetasAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const opacityAnimLine = useRef(new Animated.Value(0)).current;
  const fadeAnims = useRef(currentPlanetsOrder.map(() => new Animated.Value(0))).current;
  const [cartaData, setCartaData] = useState(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const progress = useRef(new Animated.Value(0)).current;
  const [isEdited, setIsEdited] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState({ country: false, city: false });
  const [countries, setCountries] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]); 
  const [searchTextCity, setSearchTextCity] = useState("");
const [searchTextCountry, setSearchTextCountry] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);

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
    setPais(country);
    setCiudad(null);
    setCitiesList(cities[country] || []);
    setFilteredCities(cities[country] || []);
    setSearchTextCountry(i18n.language === 'es' ? countryTranslations[country] || country : country); // Establece el texto del input al nombre del país seleccionado
    setSearchTextCity(""); 
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
    if (isEdited) {
      handleCalculate();
    }
  }, [isEdited]);

  const handleOpenShareModal = () => {
    const nuevaCartaData = {
      nombre,
      apellido,
      fecha,
      hora,
      latitud,
      longitud,
      ciudad,
      pais,
    };
  
    setCartaData(nuevaCartaData); 
    setShareModalVisible(true); 
  };
   
  const handleCloseShareModal = () => {
    setShareModalVisible(false);
  };

  const handleOpenEditModal = () => {
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
  };

 useEffect(() => {
  if (!loading && resultado) {
    const randomDelay = Math.random() * (2000 - 200) + 1250;

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 5000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(rotatePlanetasAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnimLine, {
        toValue: 1,
        duration: 750,
        delay: randomDelay,
        useNativeDriver: false,
      }),
    ]).start(() => {
      
      setIsPressable(true);
    });

    fadeAnims.forEach((fadeAnim, index) => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: (index * 300) + 2500,
        useNativeDriver: false,
      }).start();
    });
  }
}, [loading, resultado]);


     useEffect(() => {
      if (fecha) {
        const [year, month, day] = fecha.split('-');
        setFechaMostrada(i18n.language === "en" ? `${year}/${month}/${day}` : `${day}/${month}/${year}`);
      }
    }, [fecha, i18n.language]);
    

    const handleFechaChange = (calculateText) => {
      let formattedText = calculateText.replace(/[^0-9]/g, ''); 
      
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
  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"], 
  });
  
  const handleCalculate = async () => {
    if (!fecha || !hora || !nombre || !ciudad || !pais) {
      showToast({ message: t("toast.Completar"), type: "alert" });
      return;
    }
  
    const [birthYear, birthMonth, birthDay] = fecha.split('-');
    if (birthYear < 1699 || birthYear > 2100) {
      showToast({ message: t("toast.Fecha_Anio_Invalido"), type: "alert" });
      return;
    }
    if (birthMonth < 1 || birthMonth > 12) {
      showToast({ message: t("toast.Fecha_Mes_Invalido"), type: "alert" });
      return;
    }
    if (birthDay < 1 || birthDay > 31) {
      showToast({ message: t("toast.Fecha_Dia_Invalido"), type: "alert" });
      return;
    }
  
    const [hours, minutes] = hora.split(':');
    if (parseInt(hours) < 0 || parseInt(hours) > 23) {
      showToast({ message: t("toast.Hora_Invalida"), type: "alert" });
      return;
    }
    if (parseInt(minutes) < 0 || parseInt(minutes) > 59) {
      showToast({ message: t("toast.Minutos_Invalidos"), type: "alert" });
      return;
    }
  
    if (!latitud || !longitud || isNaN(latitud) || isNaN(longitud)) {
      console.error("Coordenadas inválidas:", { latitud, longitud });
      setErrorCiudad("Las coordenadas de la ciudad no son válidas.");
      showToast({ message: t("toast.Coordenadas"), type: "error" });
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
      const response = await fetch("https://appstralbackend-production.up.railway.app/calcular_carta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: `${fecha}T${hora}`,
          lat: latitud,
          lon: longitud,
          lang: i18n.language,
          sistema_casas: sistemaCasas
        })
      });
  
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
  
      const data = await response.json();
      console.log(longitud, latitud);
      console.log(data);
      setResultado(data);
      setAscendente(data.ascendente);
      setFormEnviado(true);
      setFaseLunar(data.fase_lunar);
      setEditModalVisible(false);
      setIsCartaGuardada(false);
    } catch (error) {
      console.error("Error al calcular la carta:", error);
      showToast({ message: t("toast.Ups"), type: "error" });
    }
  
    setLoading(false);
    Animated.timing(progress, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  
 const [fontsLoaded] = useFonts({
        'Astronomicon': require('../../assets/fonts/Astronomicon.ttf'), 
      });


      const deleteChart = () => {
        setFormEnviado(false);
        setNombre('');
        setApellido('');
        setFecha('');
        setFechaMostrada('');
        setHora('');
        setLatitud('');
        setLongitud('');
        setCiudad('');
        setSearchTextCountry(''); 
        setSearchTextCity(''); 
        setPais('');
        setResultado(null);
        setAscendente(null);
        setLoading(false);
        progress.setValue(0);
      };
      
      const simbolosPlanetas = i18n.language === 'es' ? { 
        "Sol": "Q",
        "Luna": "R", 
        "Mercurio": "S",
        "Venus": "T", 
        "Marte": "U",
        "Júpiter": "V", 
        "Saturno": "W",
        "Urano": "X",   
        "Neptuno": "Y",
        "Plutón": "Z",  
        "Lilith": "z",  
        "Quirón": "q",  
        "Nodo Norte": "g",  
      } : {
        "Sun": "Q",
        "Moon": "R", 
        "Mercury": "S",
        "Venus": "T", 
        "Mars": "U",
        "Jupiter": "V", 
        "Saturn": "W",
        "Uranus": "X",   
        "Neptune": "Y",
        "Pluto": "Z",  
        "Lilith": "z",  
        "Chiron": "q",  
        "North Node": "g",  
      };

      
      const [tooltip, setTooltip] = useState({ visible: false, sign: '', position: { x: 0, y: 0 } });
      const [selectedSign, setSelectedSign] = useState(null); 
      const timeoutRef = useRef(null);
      const [selectedPlanet, setSelectedPlanet] = useState(null);
    
      const handlePressIn = (signo, index, textPos) => {
        setSelectedSign(signo);
        setTooltip({ 
          visible: true, 
          position: { x: textPos.x - width * 0.05, y: textPos.y + height * 0.01 }, 
          sign: signosZodiacales[index] 
        });
      
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      
        timeoutRef.current = setTimeout(() => {
          setTooltip({ visible: false, position: { x: 0, y: 0 }, sign: "" });
          setSelectedSign(null);
          timeoutRef.current = null;
        }, 2000);
      };
    
const renderItem = ({ item, index }) => {
  let signo, grado, minutos, casa, simbolo, retrogrado;
  const ascendente = resultado.casas['1'];

  if (item === t("Ascendente") && ascendente) {
    signo = ascendente.signo;
    grado = ascendente.grado;
    minutos = ascendente.minutos;
    simbolo = 'c';
    retrogrado = false;
  } else {
    const cuerpoData = resultado.planetas[item];
    if (!cuerpoData) return null;
    ({ signo, grado, minutos, casa, retrógrado: retrogrado } = cuerpoData);
    simbolo = simbolosPlanetas[item] || '';
  }

  if (!signo || grado === undefined || minutos === undefined) return null;

  const gradoDisplay = grado === 0 ? '0' : grado;
  const minutosDisplay = minutos === 0 ? '0' : minutos;
  const retrogradoDisplay = retrogrado && item !== "Nodo Norte" ? " Rx" : "";
  const isSelected = selectedPlanet === item;
  const textColor = isSelected ? theme.focusedItem : theme.tertiary;
  const getOrdinal = (number) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const remainder = number % 100;
    return number + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
  };
  const casaOrdinal = (i18n.language === 'en' && casa) ? getOrdinal(casa) : casa;

  return (
    <TouchableOpacity onPress={() => setSelectedPlanet(isSelected ? null : item)}>
      <Animated.View style={{ opacity: fadeAnims[index] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp('2.5%'), marginVertical: 'auto', paddingVertical: hp('.75%') }}>
          <Text style={{ color: textColor, fontFamily: 'Astronomicon', fontSize: RFValue(13), marginBottom: 'auto', transform: [{ translateY: hp('0.25%') }] }}>
            {simbolo}
          </Text>
          <Text style={{ fontSize: RFValue(12), fontFamily: 'Effra_Regular', color: textColor, paddingBottom: hp('0.5%'), borderColor: theme.primaryBorder, borderBottomWidth: hp(0.1), width: '100%' }}>
            {item === t("Ascendente")
              ? (i18n.language === 'en'
                  ? `Ascendant in ${signo} at ${gradoDisplay}° ${minutosDisplay}'`
                  : `Ascendente en ${signo} a ${gradoDisplay}° ${minutosDisplay}'`)
              : t('planet_house_position', { planet: item, sign: signo, degree: grado, casa: casaOrdinal, minutes: minutos, retro: retrogrado ? ' Rx' : '' })}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
    
    const signosSimbolos = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'
    ];

    const signosZodiacales = [
      t("signos.aries"),
      t("signos.taurus"),
      t("signos.gemini"),
      t("signos.cancer"),
      t("signos.leo"),
      t("signos.virgo"),
      t("signos.libra"),
      t("signos.scorpio"),
      t("signos.sagittarius"),
      t("signos.capricorn"),
      t("signos.aquarius"),
      t("signos.pisces")
    ];

    const renderCirculoZodiacal = () => {
      if (!resultado) return null;
      const SVG_SIZE = width * 0.96;
      const RADIO = SVG_SIZE / 2.5;
      const CENTER = { x: SVG_SIZE / 2, y: SVG_SIZE / 2 };
      const ANGLE_PER_SIGN = 360 / 12;
      const LINE_LENGTH = RADIO + 10;
      const DISTANCIA_PLANETAS = RADIO * 0.8;
      const DISTANCIA_INNERCIRCLE = RADIO * 0.68;
      const DISTANCIA_ASPECTOS = RADIO * 0.675;
      const DISTANCIA_SIGNOS = RADIO + 21;
      const PERIMETRO = 2 * Math.PI * RADIO;
      const CANTIDAD_LINEAS = 12; 
      const LONGITUD_LINEA = PERIMETRO * 0.0775; 
      const LONGITUD_ESPACIO = (PERIMETRO / CANTIDAD_LINEAS) - LONGITUD_LINEA; 
      const ASCENDENTROTATION = -ascendente;
      
    
      const distanciasCasas = [
        resultado.distancia_ascendente_casa2 || 0,
        resultado.distancia_ascendente_casa3 || 0,
        resultado.distancia_ascendente_casa4 || 0,
        resultado.distancia_ascendente_casa5 || 0,
        resultado.distancia_ascendente_casa6 || 0,
        
      ].map(distancia => -distancia);
      const planetas = Object.keys(resultado.planetas);
      const simbolosPlanetas = i18n.language === 'es' ? {
        "Sol": "Q",
        "Luna": "R", 
        "Mercurio": "S",
        "Venus": "T", 
        "Marte": "U",
        "Júpiter": "V", 
        "Saturno": "W",
        "Urano": "X",   
        "Neptuno": "Y",
        "Plutón": "Z",  
        "Lilith": "z",  
        "Quirón": "q",  
        "Nodo Norte": "g",  
      } : {
        "Sun": "Q",
        "Moon": "R", 
        "Mercury": "S",
        "Venus": "T", 
        "Mars": "U",
        "Jupiter": "V", 
        "Saturn": "W",
        "Uranus": "X",   
        "Neptune": "Y",
        "Pluto": "Z",  
        "Lilith": "z",  
        "Chiron": "q",  
        "North Node": "g",  
      };    
    
            
            const rotateInterpolate = rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['200deg', '0deg']
            });
            const rotatePlanetasInterpolate = rotatePlanetasAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['-400deg', '0deg'] 
            });
    
      const calcularDiferenciaAngular = (a1, a2) => {
        let dif = Math.abs(a1 - a2);
        return dif > 180 ? 360 - dif : dif;
      };
    
    
      const calcularPosicion = (angulo, distancia) => ({
        x: CENTER.x + distancia * Math.cos((angulo * Math.PI) / 180),
        y: CENTER.y + distancia * Math.sin((angulo * Math.PI) / 180),
        angle: angulo,
      });
    
      
      const angulosCasas = [
        (resultado.distancia_ascendente_casa2 + 0) / 2,
        (resultado.distancia_ascendente_casa2 + resultado.distancia_ascendente_casa3) / 2,
        (resultado.distancia_ascendente_casa3 + resultado.distancia_ascendente_casa4) / 2,
        (resultado.distancia_ascendente_casa4 + resultado.distancia_ascendente_casa5) / 2,
        (resultado.distancia_ascendente_casa5 + resultado.distancia_ascendente_casa6) / 2,
        (resultado.distancia_ascendente_casa6 + 180) / 2,
      ];
      
      const posicionesCasas = angulosCasas.flatMap((angulo, index) => {
        const posCasa = calcularPosicion(-angulo, RADIO - 85);
        const posCasaOpuesta = calcularPosicion(-(angulo + 180), RADIO - 85);
        return [
          { numero: index + 7, pos: posCasa },
          { numero: index + 1, pos: posCasaOpuesta },
        ];
      });
      
    const renderizarLineasAspectos = (planeta1Data, index) => { // Renombré 'planeta1' a 'planeta1Data' para mayor claridad
        const nombrePlaneta1 = planeta1Data.nombre; // Asumiendo que planeta1Data.nombre contiene el nombre del planeta
        const orbesUsuario = userData.orbes; // Acceso a los orbes del usuario
    
        return [...planetas.slice(index + 1), t("Ascendente")].flatMap((otroCuerpoNombre) => {
            // ... (Tu lógica existente para filtrar por selectedPlanet se mantiene igual) ...
            if (selectedPlanet) {
                if (selectedPlanet === t("Ascendente")) {
                    if (nombrePlaneta1 !== t("Ascendente") && otroCuerpoNombre !== t("Ascendente")) {
                        return null;
                    }
                } else {
                    if (nombrePlaneta1 !== selectedPlanet && otroCuerpoNombre !== selectedPlanet) {
                        return null;
                    }
                }
            }
    
            let signo2, grado2, minutos2;
            if (otroCuerpoNombre === t("Ascendente")) {
                ({ signo: signo2, grado: grado2, minutos: minutos2 } = resultado.casas["1"]);
            } else {
                ({ signo: signo2, grado: grado2, minutos: minutos2 } = resultado.planetas[otroCuerpoNombre]);
            }
    
            const planetSignoIndex2 = signosZodiacales.indexOf(signo2);
            const posicion1 = calcularPosicion(planeta1Data.angle, DISTANCIA_ASPECTOS);
            const posicion2 = calcularPosicion(
                (-planetSignoIndex2 * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (grado2 + minutos2 / 60) * (ANGLE_PER_SIGN / 30),
                DISTANCIA_ASPECTOS
            );
    
            const diferenciaAngular = calcularDiferenciaAngular(planeta1Data.angle, posicion2.angle);
    
            // --- Lógica para determinar el orbe a usar ---
            let orbeMaximo;
    
            const esLuminaria = (p) => p === "Sol" || p === "Luna" || p === "Sun" || p === "Moon";
            const esInterno = (p) => ["Mercurio", "Venus", "Marte", "Júpiter", "Saturno", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"].includes(p);
            const esExterno = (p) => ["Urano", "Neptuno", "Plutón", "Uranus", "Neptune", "Pluto"].includes(p);
    
            // Determinamos las categorías de ambos cuerpos celestes
            const categoriaPlaneta1 = esLuminaria(nombrePlaneta1) ? 'luminarias' : esInterno(nombrePlaneta1) ? 'internos' : esExterno(nombrePlaneta1) ? 'externos' : 'otros';
            const categoriaOtroCuerpo = esLuminaria(otroCuerpoNombre) ? 'luminarias' : esInterno(otroCuerpoNombre) ? 'internos' : esExterno(otroCuerpoNombre) ? 'externos' : 'otros';
    
            // Usamos el orbe más permisivo (el mayor) entre los dos cuerpos
            orbeMaximo = Math.max(
                orbesUsuario[categoriaPlaneta1] || 0, // Asegura que no sea undefined si una categoría no existe
                orbesUsuario[categoriaOtroCuerpo] || 0
            );
    
            // Si el Ascendente está involucrado, podrías tener una lógica específica para él,
            // por ejemplo, usar el orbe de 'otros' o un orbe fijo si lo prefieres para puntos cardinales.
            // Aquí asumo que el Ascendente caería en 'otros' por defecto si no es un planeta.
            if (nombrePlaneta1 === t("Ascendente")) {
                orbeMaximo = Math.max(orbeMaximo, orbesUsuario.otros || 0); // O podrías definir un orbe específico para el Ascendente
            } else if (otroCuerpoNombre === t("Ascendente")) {
                orbeMaximo = Math.max(orbeMaximo, orbesUsuario.otros || 0);
            }
            // --- Fin de la lógica del orbe ---
    
            const aspectos = [
                { angulo: 90, color: "#d194ff" },
                { angulo: 30, color: "#ffe278" },
                { angulo: 60, color: "#8acfff" },
                { angulo: 120, color: "#8acfff" },
                { angulo: 150, color: "#ffe278" },
                { angulo: 180, color: "#d194ff" },
            ];
    
            return aspectos.map(({ angulo, color }) =>
                // Aquí se usa el orbeMaximo calculado dinámicamente
                Math.abs(diferenciaAngular - angulo) < orbeMaximo ? (
                    <AnimatedLine key={`Line-${nombrePlaneta1}-${otroCuerpoNombre}-${angulo}`}
                        x1={posicion1.x} y1={posicion1.y}
                        x2={posicion2.x} y2={posicion2.y}
                        stroke={color} strokeWidth="1.25"
                        opacity={opacityAnimLine}
                    />
                ) : null
            ).filter(Boolean);
        });
    };
    
    const calcularPosicionAjustada = (planetas, index, ASCENDENTROTATION) => { 
      const DISTANCIA_BASE = DISTANCIA_PLANETAS;
      const UMBRAL_ANGULO = 7; 
    
      const getAngulo = (nombrePlaneta) => {
        const { signo, grado, minutos } = resultado.planetas[nombrePlaneta];
        const signoIndex = signosZodiacales.indexOf(signo);
        return (-signoIndex * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (grado + minutos / 60) * (ANGLE_PER_SIGN / 30);
      };
    
      const angulos = planetas.map(p => getAngulo(p));
      const anguloActual = angulos[index];
    
      let grupoIndices = [];
      for (let i = 0; i < planetas.length; i++) {
        if (calcularDiferenciaAngular(anguloActual, angulos[i]) < UMBRAL_ANGULO) {
          grupoIndices.push(i);
        }
      }
    
      grupoIndices.sort((a, b) => a - b);
      const posicionEnGrupo = grupoIndices.indexOf(index);
      const cantidadEnGrupo = grupoIndices.length;
    
      let DISTANCIA_EXTRA_TOTAL;
      if (cantidadEnGrupo <= 3) {
        DISTANCIA_EXTRA_TOTAL = 10;
      } else {
        DISTANCIA_EXTRA_TOTAL = 25;
      }
    
      let distancia;
      if (cantidadEnGrupo === 1) {
        distancia = DISTANCIA_BASE; 
      } else {
        const paso = DISTANCIA_EXTRA_TOTAL / (cantidadEnGrupo - 1);
        const offset = -DISTANCIA_EXTRA_TOTAL * (1 / 4) + paso * posicionEnGrupo;
    
        distancia = DISTANCIA_BASE + offset;
      }
    
      return calcularPosicion(anguloActual, distancia);
    };
    
    
    
      return (
                    <Animated.View style={{ transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }], opacity: opacityAnim }}>
        
          <AnimatedSvg width={SVG_SIZE} height={SVG_SIZE}>
            
         
    
            <Circle cx={CENTER.x} cy={CENTER.y} r={RADIO} stroke={theme.tertiary} strokeWidth="2" fill="none" strokeDasharray={`${LONGITUD_LINEA},${LONGITUD_ESPACIO}`} transform={`rotate(${-ASCENDENTROTATION + 1}, ${CENTER.x}, ${CENTER.y})`}/>
          
            {signosSimbolos.map((signo, index) => {
              const angle = (-index * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION;
              const textPos = calcularPosicion(angle - ANGLE_PER_SIGN / 2, DISTANCIA_SIGNOS);
              const linePos = calcularPosicion(angle, LINE_LENGTH);
    
              const isSelected = selectedSign === signo;
              const textColor = isSelected ? theme.primary : theme.tertiary;
    
              return (
                 <G key={signo}>
                  
                      <AnimatedText
                        x={textPos.x}
                        y={textPos.y}
                        fontSize={height * 0.035}
                        textAnchor="start"
                        alignmentBaseline="middle"
                        fontFamily="Astronomicon"
                        fill={textColor}
                        transform={`rotate(${angle + 75}, ${textPos.x}, ${textPos.y})`}
                      >
                        {signo}
                      </AnimatedText>
                      
                      <Circle 
                        cx={textPos.x} 
                        cy={textPos.y} 
                        r={height * 0.035} 
                        fill='none' 
                        stroke='none'
                        strokeWidth="1.5"
                        onPressIn={() => handlePressIn(signo, index, textPos)}
                      />
                
                    </G>
                  );
                })}
     
    {distanciasCasas.map((angleCasa, index) => (
    <Line key={index}
    x1={CENTER.x + RADIO * Math.cos(angleCasa * (Math.PI / 180))}
    y1={CENTER.y + RADIO * Math.sin(angleCasa * (Math.PI / 180))}
    x2={CENTER.x + RADIO * Math.cos((angleCasa + 180) * (Math.PI / 180))}
    y2={CENTER.y + RADIO * Math.sin((angleCasa + 180) * (Math.PI / 180))}
    stroke={theme.tertiary} strokeWidth=".75"
    />
    ))}
    
    
    
    
    <Defs>
    <Marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" orient="auto" markerWidth="10" markerHeight="10">
    <Path d="M0,0 L8,5 L0,10 z" fill={selectedPlanet === t("Ascendente") ? theme.focusedItem : theme.tertiary} />
    </Marker>
    </Defs>
    <Line  markerEnd="url(#arrow)"  x1={CENTER.x + RADIO} y1={CENTER.y} x2={CENTER.x - RADIO} y2={CENTER.y} stroke={selectedPlanet === t("Ascendente") ? theme.focusedItem : theme.tertiary} strokeWidth="1.5" />
    
            <Animated.View style={{ transform: [{ rotate: rotatePlanetasInterpolate }] }}>
    
              <AnimatedSvg width={SVG_SIZE} height={SVG_SIZE}>
    
                
                {planetas.map((planeta, index) => {
                  const { signo, grado, minutos, retrógrado, estacionario } = resultado.planetas[planeta];
                  const planetSignoIndex = signosZodiacales.indexOf(signo);
                  const posicion = calcularPosicionAjustada(planetas, index, ASCENDENTROTATION);
                  const isSelected = planeta === selectedPlanet;
                  const planetaColor = isSelected ? theme.focusedItem : theme.tertiary; 
    
                  
                  return (
                    <G key={planeta}>
                      
    {renderizarLineasAspectos({ nombre: planeta, angle: posicion.angle }, index)} 
                      <AnimatedText x={posicion.x} y={posicion.y} fontSize={height*.022} textAnchor="start" alignmentBaseline="middle" fill={planetaColor} fontFamily="Astronomicon">
                        {simbolosPlanetas[planeta]}
                      </AnimatedText>
                      {planeta !== "Nodo Norte" && planeta !== "North Node" && (
                       <>
                         {estacionario && !retrógrado && (
                           <SvgText
                             x={posicion.x + 7.5}
                             y={posicion.y + 10}
                             fontSize={height * 0.008}
                             textAnchor="start"
                             alignmentBaseline="middle"
                             fill={planetaColor}
                             fontFamily="Effra_SemiBold"
                           >
                             st
                           </SvgText>
                         )}
                         {retrógrado && !estacionario && (
                           <SvgText
                             x={posicion.x + 7.5}
                             y={posicion.y + 10}
                             fontSize={height * 0.008}
                             textAnchor="start"
                             alignmentBaseline="middle"
                             fill={planetaColor}
                             fontFamily="Effra_SemiBold"
                           >
                             Rx
                           </SvgText>
                         )}
                         {retrógrado && estacionario && (
                           <SvgText
                             x={posicion.x + 7.5}
                             y={posicion.y + 10}
                             fontSize={height * 0.008}
                             textAnchor="start"
                             alignmentBaseline="middle"
                             fill={planetaColor}
                             fontFamily="Effra_SemiBold"
                           >
                             stRx
                           </SvgText>
                         )}
                       </>
                     )}
                    </G>
                  );
                })}     
    <G>
    {posicionesCasas.map(({ numero, pos }, index) => (
      <React.Fragment key={numero}>
        <AnimatedCircle  
          
          cx={pos.x} 
          cy={pos.y} 
          r={width*0.015}
          fill={theme.tertiary} 
        />
        <AnimatedG >
          <SvgText  
            x={pos.x} 
            y={pos.y} 
            fontFamily="Effra_Regular" 
            fontSize={height*0.01}
            textAnchor="middle" 
            alignmentBaseline="middle" 
            fill={theme.background}
          >
            {numero}
          </SvgText>
        </AnimatedG>
      </React.Fragment>
    ))}
    </G>
              </AnimatedSvg>
              </Animated.View>
              <AnimatedCircle cx={CENTER.x} cy={CENTER.y} r={DISTANCIA_INNERCIRCLE} stroke={theme.tertiary} fill="none" strokeWidth="1.5" />
    
          </AnimatedSvg>
          
          {tooltip.visible && (
          <View style={{
            position: 'absolute',
            top: tooltip.position.y,
            left: tooltip.position.x,
            backgroundColor: theme.black,
            padding: 5,
            paddingBottom: 3,
            paddingHorizontal: 7,
            borderRadius: 5,
            elevation: 5,
          }}>
            <Text style={{color: theme.background,fontFamily: 'Effra_Regular', fontSize: height*0.012}}>{tooltip.sign}</Text>
          </View>
        )}
        </Animated.View>
    
          
      );
    };
const guardarNuevaCarta = async () => {
  if (!auth.currentUser) {
    showToast({ message: t("toast.Auth"), type: "error" });
    return;
  }

  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      showToast({ message: t("toast.Auth"), type: "error" });
      return;
    }

    const userData = userSnap.data();

    const cartasRef = collection(db, "users", auth.currentUser.uid, "cartas");
    const cartasSnap = await getDocs(cartasRef);

    const cartasNormales = cartasSnap.docs.filter(doc => !doc.data().especial);
    const totalCartas = cartasNormales.length;

    if (!userData.premium && totalCartas >= 3) {
      if (userData.extraCharts > 0) {
      } else {
        showToast({
          message: "toast.No_More_Charts",
          type: "alert"
        });
        return;
      }
    }

    // Guarda la nueva carta
    await addDoc(cartasRef, {
      nombre,
      apellido,
      fecha,
      hora,
      pais,
      ciudad,
      creado: new Date(),
    });

    if (!userData.premium && userData.extraCharts > 0) {
      await updateDoc(userRef, {
        extraCharts: increment(-1) // decrementa en 1 el campo 'extraCharts'
      });
      showToast({ message: t("toast.Guardado"), type: "success" }); // Mensaje específico
    } else {
      showToast({ message: t("toast.Guardado"), type: "success" });
    }
setIsCartaGuardada(true);
  } catch (error) {
    showToast({ message: t("toast.No_Agregado"), type: "error" });
    console.error(error);
  }
};

  return (
    <View style={styles.calculateContainer}>

      {!formEnviado ? ( 
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, backgroundColor: theme.background }} scrollEnabled={!dropdownVisible.country} keyboardShouldPersistTaps="handled">
  
        <View style={{justifyContent: 'space-between',
        gap: 15,marginHorizontal: 'auto',
         paddingBottom: height*0.15}}>
            
          <Text style={styles.calculateFormTitle}>{t('Calcular_Titulo')}</Text>
        <View style={[styles.inputContainer, focusedField === 'nombre' ? styles.focusedBorder : styles.defaultBorder]}>
        <TextInput
          style={[styles.CalculateInput, focusedField === 'nombre' ? styles.focusedText : styles.defaultText]}
          placeholderTextColor={theme.secondary}
          placeholder={t('Nombre')}
          value={nombre}
          onChangeText={setNombre}
          onFocus={() => setFocusedField('nombre')}
          onBlur={() => setFocusedField(null)}
        />
        </View>
        <View style={[styles.inputContainer, focusedField === 'apellido' ? styles.focusedBorder : styles.defaultBorder]}>
        <TextInput
          style={[styles.CalculateInput, focusedField === 'apellido' ? styles.focusedText : styles.defaultText]}
          placeholderTextColor={theme.secondary}
          placeholder={t('Apellido')}
          value={apellido}
          onChangeText={setApellido}
          onFocus={() => setFocusedField('apellido')}
          onBlur={() => setFocusedField(null)}
        />
</View>
<Text style={styles.calculateText}>{t('Fecha_Nacimiento')}</Text>
<View style={[styles.inputContainer, focusedField === 'fecha' ? styles.focusedBorder : styles.defaultBorder]}>

      <TextInput
        style={[styles.inputDateTime, focusedField === 'fecha' ? styles.focusedText : styles.defaultText]}
        value={fechaMostrada}
        placeholderTextColor={theme.secondary}
        keyboardType="numeric"
        placeholder={i18n.language === "en" ? "YYYY/MM/DD" : "DD/MM/YYYY"}
        onChangeText={handleFechaChange}
        onFocus={() => setFocusedField('fecha')}
          onBlur={() => setFocusedField(null)}
      />
      </View>
      <Text style={styles.calculateText}>{t('Hora_Nacimiento')}</Text>
      <View style={[styles.inputContainer, focusedField === 'hora' ? styles.focusedBorder : styles.defaultBorder]}>

      <TextInput
      placeholderTextColor={theme.secondary}
        style={[styles.inputDateTime, focusedField === 'hora' ? styles.focusedText : styles.defaultText]}
        value={hora}
        keyboardType="numeric"
        placeholder="HH:MM"
        onChangeText={handleHoraChange}
        onFocus={() => setFocusedField('hora')}
          onBlur={() => setFocusedField(null)}
      />
</View>

  <View style={styles.pickerPlaceContainer}>
    <TouchableOpacity
      style={[styles.inputContainer,dropdownVisible.country ? styles.focusedBorder : styles.defaultBorder]} onPress={() => toggleDropdown("country")}>
      <TextInput
        style={[
          styles.CalculateInput,
          dropdownVisible.country ? styles.focusedText : styles.defaultText
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
      styles.dropdownBox,
      { maxHeight: 100, overflow: 'hidden' }
    ]}
  ><ScrollView nestedScrollEnabled={true}>
          {filteredCountries.length > 0 ? ( // Muestra la lista de países filtrados
            filteredCountries.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => handleCountrySelect(item)}
              >
                <Text style={styles.dropdownTextStyles}>{i18n.language === 'es' ? countryTranslations[item] || item : item}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.dropdownTextStyles}>{t('No_Resultados')}</Text>
          )}
        </ScrollView>
      </View>
    )}
</View>
<View style={styles.pickerPlaceContainer}>
<TouchableOpacity style={[styles.inputContainer, dropdownVisible.city ? styles.focusedBorder : styles.defaultBorder]}>
  <TextInput
    style={[styles.CalculateInput, dropdownVisible.city ? styles.focusedText : styles.defaultText]}
    placeholder={t('Seleccion_Ciudad')}
    placeholderTextColor={theme.secondary}
    value={ciudad}
    onFocus={() => {
      if (pais && !dropdownVisible.city) {
        toggleDropdown("city"); 
      }
    }}
    onChangeText={handleCitySearch} 
    editable={!!pais}
  />
</TouchableOpacity>
  {dropdownVisible.city && pais && (
  <View
    style={[
      styles.dropdownBox,
      { maxHeight: 125, overflow: 'hidden' }
    ]}
  >
    <ScrollView nestedScrollEnabled={true}>
      {filteredCities.length > 0 ? (
        filteredCities.map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => {
              obtenerCoordenadasCiudad(item.label);
              setCiudad(item.label);
              toggleDropdown("city");
            }}
          >
            <Text style={styles.dropdownTextStyles}>{item.label}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.dropdownTextStyles}>{t('No_Resultados')}</Text>
      )}
    </ScrollView>
  </View>
)}
    </View>
         <TouchableOpacity  onPress={handleCalculate} style={styles.calculateButtonContainer}>
           <LinearGradient
             colors={['#0098E7','#6E4FE5']}
             start={{ x: 0, y: 0 }}
             end={{ x: 0, y: 1 }}
             style={styles.gradientBackground}
           >
              <View style={styles.progressContainer}>
                             <Animated.View style={[styles.progressFill, { width: widthInterpolation }]} />
                            <Text style={styles.calculateButtonText}>{t('Calcular')}</Text>
                           </View>
           </LinearGradient>
         </TouchableOpacity>
        </View>
        </ScrollView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
       ) : (
        <SafeAreaView style={styles.calculateContainer}>

        <View style={styles.ChartDetailsHeader}>
        <View style={styles.chartTitleContainer}>
           <View style={{flexDirection: 'row'}}>
          <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.ChartTitleText}>{nombre} {apellido}</Text>
          {faseLunar && renderLunarIcon()}
          </View>
          <View style={[styles.chartOptions, { opacity: isPressable ? 1 : 0.3 }]}>
            {!isCartaGuardada && (// Solo muestra el botón si la carta NO ha sido guarda
    <TouchableOpacity disabled={!isPressable} onPress={guardarNuevaCarta}>
      <SaveIcon style={{ width: 16, height: 16, margin:'auto', fill:theme.secondary }} />
    </TouchableOpacity>
  )}

         
          <TouchableOpacity disabled={!isPressable} style={{ padding: 1 }} onPress={handleOpenEditModal}>
            <EditIcon style={{ width: 16, height: 16, margin:'auto', fill:theme.secondary }} />
          </TouchableOpacity>
          <TouchableOpacity style={{transform:[{rotate: '45deg'}]}} disabled={!isPressable} onPress={deleteChart}>
            <AddIcon style={{ width: 15, height: 15, margin:'auto', fill:theme.secondary }} />
          </TouchableOpacity>
          </View>
        </View>
        <View style={styles.ChartInfo}>
        <Text style={styles.ChartInfoText}>
        {fecha && hora ? i18n.language === 'es'
    ? new Date(`${fecha}T${hora}:00`).toLocaleDateString(
        'es-AR',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }
      ).replace(/\//g, '/')
    : `${fecha}`.replace(/-/g, '/') 
  : fecha}
</Text>
        <View style={styles.chartInfoSeparator} />
        <Text style={styles.ChartInfoTime}>{hora}</Text>
        <View style={styles.chartInfoSeparator} />
        <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.ChartInfoText}>
  {ciudad}
</Text>
        </View>
        </View>
        <View style={styles.resultCircle}>{renderCirculoZodiacal()}
          {loading && (
              <View style={{position: 'absolute', justifyContent: 'center', height: width * 0.95, width: width * 0.95}}>
                <ActivityIndicator size="large" color="#ab89e9" />
              </View>
            )}
        </View>
       {resultado && (
           <FlatList         
           data={currentPlanetsOrder}
           renderItem={renderItem}
           keyExtractor={(item) => item}
           contentContainerStyle={styles.chartResultList}
           ListFooterComponent={<View style={{height: height*0.225}} />}
         />
        )}
 {editModalVisible && (
      <EditCalculatedChartModal
        visible={editModalVisible}
        nombre={nombre}
        setNombre={setNombre}
        apellido={apellido}
        setApellido={setApellido}
        fecha={fecha}
        setFecha={setFecha}
        hora={hora}
        setHora={setHora}
        latitud={latitud}
        setLatitud={setLatitud}
        longitud={longitud}
        setLongitud={setLongitud}
        ciudad={ciudad}
        setCiudad={setCiudad}
        pais={pais}
        setPais={setPais}
        handleCalculate={handleCalculate} 
        handleCloseEditModal={handleCloseEditModal}
        setIsEdited={setIsEdited}
      />)}
{shareModalVisible && (
          <ShareCalculatedChartModal
          cartaData={cartaData}
        visible={shareModalVisible}
        selectedPlanet={selectedPlanet}

        handleCloseShareModal={handleCloseShareModal}
      />)}
           <LinearGradient pointerEvents="none" colors={['transparent', theme.shadowBackground, theme.shadowBackground, theme.shadowBackground]} style={{  position: 'absolute',bottom: 0, left: 0,right: 0, height: hp('12%'), zIndex: 1}}/>

        </SafeAreaView>
      )}


</View>
  );
};


export default CalculateScreen;