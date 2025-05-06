import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Alert, FlatList, StyleSheet, Dimensions, Easing, Animated,Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Svg, { Circle, Line, G, Text as SvgText,Path, Defs, Marker } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { useCasa } from '../contexts/CasaContext';
import cities from '../data/cities.json'; 
import {LinearGradient} from 'expo-linear-gradient';
import EditIcon from "../../assets/icons/EditIcon";
import ShareIcon from "../../assets/icons/ShareIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import {auth, doc, db, updateDoc, deleteDoc,getDoc } from '../config/firebaseConfig';
import SpecialChartIcon from "../../assets/icons/SpecialChartIcon";
import SpecialDetailsIcon from "../../assets/icons/SpecialDetailsIcon";
import colors from '../utils/colors';
import EditChartModal from '../modals/EditChartModal';
import DeleteChartModal from '../modals/DeleteChartModal';
import { useToast } from "../contexts/ToastContext";
import ShareChartModal from '../modals/ShareChartModal';
import SpecialChartModal from '../modals/SpecialChartModal';
import SunIcon from "../../assets/icons/SunIcon";
import { useTranslation } from 'react-i18next';
import SolarPremiumModal from '../modals/SolarPremiumModal';
import { useUser } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import LunaLIcon from "../../assets/icons/LunaLIcon";
import LunaMIcon from "../../assets/icons/LunaMIcon";
import LunaCIcon from "../../assets/icons/LunaCIcon";
import LunaNIcon from "../../assets/icons/LunaNIcon";
import ConfirmEditModal from '../modals/ConfirmEditModal';

const { height: height, width: width } = Dimensions.get('screen');

const ChartDetails = ({ route, navigation }) => {
  
  const [solarPremiumModalVisible, setSolarPremiumModalVisible] = useState(false);
  const handleCloseSolarPremiumModal = () => {
    setSolarPremiumModalVisible(false);
  };
 const {userData} = useUser();

const handleSolarRevo = () => {
  if (userData.premium) {
    navigation.navigate("SolarRevo", { cartaId });
  } else {
    setSolarPremiumModalVisible(true);
  }
};
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const { cartaId } = route.params || {}; 
  const { showToast } = useToast();
  const [faseLunar, setFaseLunar] = useState(null);
  const [isPressable, setIsPressable] = useState(false);
  const [cartaData, setCartaData] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [ascendente, setAscendente] = useState(null);
  const [error, setError] = useState('');
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [errorCiudad, setErrorCiudad] = useState('');
  const { sistemaCasas, setSistemaCasas } = useCasa();
  const AnimatedSvg = Animated.createAnimatedComponent(Svg);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedLine = Animated.createAnimatedComponent(Line);
  const AnimatedText = Animated.createAnimatedComponent(SvgText);
  const AnimatedG = Animated.createAnimatedComponent(G);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [specialChartVisible, setSpecialChartVisible] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const { t, i18n  } = useTranslation();
  const [showLunarTooltip, setShowLunarTooltip] = useState(false);
  const [confirmEditModalVisible, setConfirmEditModalVisible] = useState(false);
  const fetchCarta = async () => {
    if (!cartaId) return;
    setLoading(true);
  
    try {
      const cartaRef = doc(db, 'users', auth.currentUser.uid, 'cartas', cartaId);
      const cartaSnap = await getDoc(cartaRef);
  
      if (cartaSnap.exists()) {
        setCartaData(cartaSnap.data());
      } else {
        console.log('No existe la carta');
      }
    } catch (error) {
      console.error('Error obteniendo la carta:', error);
    }
  };

  
    useEffect(() => {
    fetchCarta();
  }, [cartaId]);

    useEffect(() => {
    if (cartaData) {
      setNombre(cartaData.nombre);
      setApellido(cartaData.apellido || '');
      setFecha(cartaData.fecha);
      setHora(cartaData.hora);
      setCiudad(cartaData.ciudad);
      setPais(cartaData.pais || '');
    }
  }, [cartaData]);

  useEffect(() => {
    if (isEdited) {
      fetchCarta();
      setIsEdited(false); 
    }
  }, [isEdited]);

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
  
  
    const handleOpenShareModal = () => {
      setShareModalVisible(true);
    };
  
    const handleCloseShareModal = () => {
      setShareModalVisible(false);
    };

    const handleOpenEditModal = () => {
      if (!userData?.premium && cartaData?.editado) {
        return;
      }
    
      if (!userData?.premium && !cartaData?.editado) {
        setConfirmEditModalVisible(true);
        return;
      }
    
      setEditModalVisible(true);
    };
  
    const handleCloseEditModal = () => {
      setEditModalVisible(false);
    };

    const handleOpenSpecialChartModal = () => {
      setSpecialChartVisible(true);
    };
  
    const handleCloseSpecialChartModal = () => {
      setSpecialChartVisible(false);
    };
  
  const planetasOrden = {
    es: [
      "Sol", "Luna", "Ascendente", "Mercurio", "Venus", "Marte", "Júpiter", "Saturno", 
      "Urano", "Neptuno", "Plutón", "Lilith", "Quirón", "Nodo Norte"
    ],
    en: [
      "Sun", "Moon", "Ascendant", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", 
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

 
  
      
  const [fontsLoaded] = useFonts({
    'Astronomicon': require('../../assets/fonts/Astronomicon.ttf'), 
  });

      const obtenerCoordenadasCiudad = () => {
        if (!cartaData?.ciudad || !cartaData?.pais) return;
      
        const ciudadBuscada = cartaData.ciudad.trim().toLowerCase();
        const paisSeleccionado = cartaData.pais.trim();
      
        const ciudadesPais = cities[paisSeleccionado];
      
        if (ciudadesPais) {
          const ciudad = ciudadesPais.find((city) =>
            city.label.toLowerCase().includes(ciudadBuscada)
          );
      
          if (ciudad) {
            setLatitud(ciudad.lat);
            setLongitud(ciudad.lng);
            setErrorCiudad('');
          } else {
            setErrorCiudad('No se encontraron coordenadas para esta ciudad.');
            setLatitud(null);
            setLongitud(null);
          }
        } else {
          setErrorCiudad('No se encontraron ciudades para este país.');
          setLatitud(null);
          setLongitud(null);
        }
      };
      
      useEffect(() => {
        if (cartaData?.ciudad && cartaData?.pais) {
          obtenerCoordenadasCiudad();
        }
      }, [cartaData?.ciudad, cartaData?.pais]);
      
      const fetchPlanetPositions = async () => {
        if (!latitud || !longitud) {
          setError('Las coordenadas no están disponibles.');
          setLoading(false);
          return;
        }
      
        const fechaHora = `${cartaData?.fecha}T${cartaData?.hora}`;
      
        try {
          setLoading(true);
          const response = await axios.get('https://appstralbackend-production.up.railway.app/mi_carta', {
            params: {
              fecha: fechaHora,
              lat: latitud,
              lon: longitud,
              lang: i18n.language,
              sistema_casas: sistemaCasas, 
            },
          });
      
          setResultado(response.data);
          setFaseLunar(response.data.fase_lunar);
          setAscendente(response.data.ascendente);
          setLoading(false);
        } catch (err) {
          setError('Hubo un error al obtener las posiciones planetarias');
          setLoading(false);
        }
      };
      

      useEffect(() => {
        if (cartaData?.fecha && cartaData?.hora && latitud && longitud) {
          fetchPlanetPositions();
        }
      }, [cartaData?.fecha, cartaData?.hora, latitud, longitud]);

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
      position: { x: textPos.x - width * 0.07, y: textPos.y + height * 0.01 }, 
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
           <View style={{ flexDirection: 'row', alignItems: 'center',gap: 10, marginVertical: 'auto', paddingVertical: height*0.01  }}>
            <Text style={{ color: textColor, fontFamily: 'Astronomicon', fontSize: width * 0.04, marginBottom: 'auto', transform: [{ translateY: width * 0.0025 }] }}>
              {simbolo}
            </Text>
            <Text style={{ fontSize: width * 0.035, fontFamily: 'Effra_Regular', color: textColor, paddingBottom: 5, borderColor: theme.primaryBorder, borderBottomWidth: height * .000325, width: '100%' }}>
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
  
  const renderizarLineasAspectos = (planeta1, index) => {
    return [...planetas.slice(index + 1), t("Ascendente")].flatMap((otroCuerpo) => {
        if (selectedPlanet === t("Ascendente")) {
            if (planeta1.nombre !== t("Ascendente") && otroCuerpo !== t("Ascendente")) {
                return null;
            }
        } else {
            if (otroCuerpo === t("Ascendente")) {
                return null;
            }
            if (selectedPlanet && planeta1.nombre !== selectedPlanet && otroCuerpo !== selectedPlanet) {
                return null;
            }
        }

        let signo2, grado2, minutos2;
        if (otroCuerpo === t("Ascendente")) {
            ({ signo: signo2, grado: grado2, minutos: minutos2 } = resultado.casas["1"]);
        } else {
            ({ signo: signo2, grado: grado2, minutos: minutos2 } = resultado.planetas[otroCuerpo]);
        }

        const planetSignoIndex2 = signosZodiacales.indexOf(signo2);
        const posicion1 = calcularPosicion(planeta1.angle, DISTANCIA_ASPECTOS);
        const posicion2 = calcularPosicion(
            (-planetSignoIndex2 * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (grado2 + minutos2 / 60) * (ANGLE_PER_SIGN / 30),
            DISTANCIA_ASPECTOS
        );

        const diferenciaAngular = calcularDiferenciaAngular(planeta1.angle, posicion2.angle);
        const aspectos = [
            { angulo: 90, color: "#d194ff" },
            { angulo: 30, color: "#ffe278" },
            { angulo: 60, color: "#8acfff" },
            { angulo: 120, color: "#8acfff" },
            { angulo: 150, color: "#ffe278" },
            { angulo: 180, color: "#d194ff" },
        ];

        return aspectos.map(({ angulo, color }) =>
            Math.abs(diferenciaAngular - angulo) < 5 ? (
                <AnimatedLine key={`Line-${planeta1.nombre}-${otroCuerpo}-${angulo}`}
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
    DISTANCIA_EXTRA_TOTAL = 30;
  }

  let distancia;
  if (cantidadEnGrupo === 1) {
    distancia = DISTANCIA_BASE; 
  } else {
    const paso = DISTANCIA_EXTRA_TOTAL / (cantidadEnGrupo - 1);
    const offset = -DISTANCIA_EXTRA_TOTAL * (1 / 6) + paso * posicionEnGrupo;

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
                  
                  {renderizarLineasAspectos(posicion, planeta, index)}
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
       
const [showAlert, setShowAlert] = useState(false);
const eliminarCarta = async () => {
  setShowAlert(true); 
};

const confirmarEliminacion = async () => {
  try {
    const cartaRef = doc(db, 'users', auth.currentUser.uid, 'cartas', cartaId);
    await deleteDoc(cartaRef);
    setResultado(null);
    setAscendente(null);
    navigation.goBack();
  } catch (error) {
    showToast({ message: t("toast.Ups"), type: "error" });
    console.error(error);
  } finally {
    setShowAlert(false);
  }
};
      
        if (loading) {
          return (
           <View style={{height:height, backgroundColor: theme.background,justifyContent: 'center', alignItems: 'center', }}>
            <ActivityIndicator size="large" color="#ab89e9"/></View>
          );
        }

        const fechaTime = new Date(`${fecha}T${hora}:00`);



        
  return (
     <View style={{margin: 'auto',
      marginTop: height*.125,
    height: height,
    width: width,
    backgroundColor: theme.background}}>
    {cartaData?.especial ? (
        <View style={styles.specialChartDetailsHeader}>
            <View style={styles.chartTitleContainer}>
            <View style={{flexDirection: 'row'}}>
                  <SpecialChartIcon style={{ width: width*0.05,height: width*0.05, marginVertical: 'auto', marginHorizontal: 0, fill: theme.secondary, transform: [{translateX: - width*0.06}]}} />
                
                    <Text numberOfLines={1} ellipsizeMode="tail"  style={[styles.specialChartTitleText, { color: '#7ebcec', transform: [{translateX: - width*0.02}]  }]}>
                      {nombre} {apellido}
                    </Text>
                    {faseLunar && renderLunarIcon()}</View>
                    <View style={styles.specialChartOptions}>
          <TouchableOpacity disabled={!isPressable} onPress={handleOpenShareModal}>
          <ShareIcon style={{ width: 16, height: 16, margin: 0, marginVertical:'auto', fill:theme.tertiary }} />
          </TouchableOpacity>
          <TouchableOpacity disabled={!isPressable} style={{ padding: 1 }} onPress={handleOpenSpecialChartModal}>
          <SpecialDetailsIcon  style={{ width: 16, height: 16, margin: 0, marginVertical:'auto', fill: '#6cbcf0' }} />
          </TouchableOpacity>
          </View>
          </View>
        <View style={styles.ChartInfo}>
        <Text style={styles.ChartInfoText}>
  {new Date(`${fecha}T${hora}:00-03:00`).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '/')}
</Text>
        <View style={styles.chartInfoSeparator} />
        <Text style={styles.ChartInfoTime}>{hora}</Text>
        <View style={styles.chartInfoSeparator} />
        <Text style={styles.ChartInfoText}>{ciudad}</Text>
        </View>
        </View> ):(
        <View style={styles.ChartDetailsHeader}>
        <View style={styles.chartTitleContainer}>
              <View style={{flexDirection: 'row'}}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.ChartTitleText}>{nombre} {apellido}</Text>
{faseLunar && renderLunarIcon()}
        </View>

         <View style={[styles.chartOptions, { opacity: isPressable ? 1 : 0.3 }]}>
         <TouchableOpacity disabled={!isPressable} onPress={handleSolarRevo}>
  <SunIcon style={{ width: 21, height: 21, margin: 'auto' }} fill={userData.premium ? '#6cbcf0' : "#999999"} />          
</TouchableOpacity>
          <TouchableOpacity disabled={!isPressable} onPress={handleOpenShareModal}>
          <ShareIcon style={{ width: 16, height: 16, margin:'auto', fill:theme.tertiary }} />
          </TouchableOpacity>
          {!cartaData?.editado && (
  <TouchableOpacity disabled={!isPressable} onPress={handleOpenEditModal}>
    <EditIcon style={{ width: 16, height: 16, margin: 'auto', fill: theme.tertiary }} />
  </TouchableOpacity>
)}


  {userData.premium && (
    <>
    <TouchableOpacity disabled={!isPressable} onPress={() => eliminarCarta()}>
      <DeleteIcon  style={{ width: 16, height: 16, margin:'auto', fill: '#ff3b3b' }} />
    </TouchableOpacity>
    </>)}
          </View>
        </View>
        <View style={styles.ChartInfo}>
        <Text style={styles.ChartInfoText}>
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
</Text>
        <View style={styles.chartInfoSeparator} />
        <Text style={styles.ChartInfoTime}>{hora}</Text>
        <View style={styles.chartInfoSeparator} />
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.ChartInfoText}>{ciudad}</Text>
        </View>
        </View>)}
        <View style={styles.resultCircle}>{renderCirculoZodiacal()}</View>
       {resultado && (
           <FlatList
           data={currentPlanetsOrder}
           renderItem={renderItem}
           keyExtractor={(item) => item}
           contentContainerStyle={styles.chartResultList}
           ListFooterComponent={<View style={styles.chartResultListSpace} />}
         />
        )}
           <LinearGradient pointerEvents="none" colors={['transparent', theme.shadowBackground, theme.shadowBackground, theme.shadowBackground]} style={{  position: 'absolute',bottom: 0, left: 0,right: 0,height: height*0.375, zIndex: 1}}/>

          
           {shareModalVisible && ( <ShareChartModal
        route={{ params: { cartaId: cartaId} }}
        visible={shareModalVisible}
        selectedPlanet={selectedPlanet}
        handleCloseShareModal={handleCloseShareModal}
      />)}
    {cartaData && (
      <EditChartModal
      visible={editModalVisible}
      route={{ params: { cartaId: cartaId, cartaData: cartaData } }}
      handleCloseEditModal={handleCloseEditModal}
      setIsEdited={setIsEdited}
      />)}
<SpecialChartModal
              visible={specialChartVisible}
              handleCloseSpecialChartModal={handleCloseSpecialChartModal}
              setSpecialChartVisible={setSpecialChartVisible}
            />
         <SolarPremiumModal
              visible={solarPremiumModalVisible}
              handleCloseSolarPremiumModal={handleCloseSolarPremiumModal}
              setSolarPremiumModalVisible={setSolarPremiumModalVisible}
            />
            <ConfirmEditModal
                visible={confirmEditModalVisible}
                onConfirm={() => {
                setConfirmEditModalVisible(false);
                setEditModalVisible(true);}} onCancel={() => setConfirmEditModalVisible(false)}
                t={t}/>
            <DeleteChartModal
            visible={showAlert}
            t={t}
            onClose={() => setShowAlert(false)}
            onConfirm={confirmarEliminacion}/>
        </View>
        
  ) ;
};

export default ChartDetails;
