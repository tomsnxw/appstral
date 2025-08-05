import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, ActivityIndicator,RefreshControl, Dimensions, Animated,BackHandler , FlatList, Easing, ScrollView, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import Svg, { Circle, Line, G, Text as SvgText, Path, Defs, Marker } from 'react-native-svg';
import cities from '../data/cities.json'; 
import { useCasa } from '../contexts/CasaContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../contexts/UserContext';
import ResetIcon from '../../assets/icons/ResetIcon'
import ShareIcon from "../../assets/icons/ShareIcon";
import ShareMyChartModal from '../modals/ShareMyChartModal';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');
import { useToast } from "../contexts/ToastContext";
import SolarPremiumModal from '../modals/SolarPremiumModal';
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";
const { width: screenWidth } = Dimensions.get('window');

const MyTransitsScreen = ({navigation}) => {
 const {userData} = useUser();
 
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
const { theme } = useContext(ThemeContext);
const styles = createStyles(theme);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPressable, setIsPressable] = useState(false);
  const [error, setError] = useState(null);
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [errorCiudad, setErrorCiudad] = useState('');
  const [ascendente, setAscendente] = useState(0);
  const { sistemaCasas, setSistemaCasas } = useCasa();
  const [extraThings, setExtraThings] = useState(true);
  const AnimatedSvg = Animated.createAnimatedComponent(Svg);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedLine = Animated.createAnimatedComponent(Line);
  const AnimatedText = Animated.createAnimatedComponent(SvgText);
  const AnimatedG = Animated.createAnimatedComponent(G);
  const { t, i18n  } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const { showToast } = useToast();
  const [showLunarTooltip, setShowLunarTooltip] = useState(false);
  const [planetasDelMomento, setPlanetasDelMomento] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const initialDate = new Date();
  const [fechaTransito, setFechaTransito] = useState(initialDate);
  const [modo, setModo] = useState('dia'); 
    const formattedDate = fechaTransito.toLocaleDateString(i18n.language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });


      const scrollViewRef = useRef(null);
    const natalListRef = useRef(null);
    const transitListRef = useRef(null);

    const scrollToPage = (pageIndex) => {
        scrollViewRef.current.scrollTo({
            x: pageIndex * screenWidth, 
            y: 0,
            animated: true,
        });
    };
  
  useEffect(() => {
    if (showLunarTooltip) {
      const timer = setTimeout(() => {
        setShowLunarTooltip(false);
      }, 2000);
  
      return () => clearTimeout(timer);
    }
  }, [showLunarTooltip]);
  
  const handleOpenModal = () => {
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

const planetasOrden = {
    es: [
        "Sol", "Luna", "Ascendente", "Mercurio", "Venus", "Marte", "Júpiter", "Saturno",
        "Urano", "Neptuno", "Plutón", "Lilith", "Quirón", "Nodo Norte", "Medio Cielo"
    ],
    en: [
        "Sun", "Moon", "Ascendant", "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
        "Uranus", "Neptune", "Pluto", "Lilith", "Chiron", "North Node", "Midheaven"
    ]
};

const currentPlanetsOrder = [
    ...planetasOrden[i18n.language].slice(0, 2),
    ...(!planetasOrden[i18n.language].includes(t("Ascendente")) ? [t("Ascendente")] : []),
    ...planetasOrden[i18n.language].slice(2)
];

let orderedPlanetasDelMomento = [];
if (planetasDelMomento) {
    const transitPlanetsOrderBase = planetasOrden[i18n.language].filter(planet =>
        ![t("Ascendente"), t("Medio Cielo")].includes(planet)
    );

    orderedPlanetasDelMomento = transitPlanetsOrderBase.filter(planetName =>
        Object.keys(planetasDelMomento).includes(planetName)
    );

    Object.keys(planetasDelMomento).forEach(planetName => {
        if (!orderedPlanetasDelMomento.includes(planetName)) {
            orderedPlanetasDelMomento.push(planetName);
        }
    });
}

  const scaleAnim = useRef(new Animated.Value(0.25)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rotatePlanetasAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const opacityAnimLine = useRef(new Animated.Value(0)).current;
 const fadeAnims = useRef(currentPlanetsOrder.map(() => new Animated.Value(0))).current;

 useEffect(() => {
  if (!loading && resultado) {
    const randomDelay = Math.random() * (1350 - 130) + 250;

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 3350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(rotatePlanetasAnim, {
        toValue: 1,
        duration: 1350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnimLine, {
        toValue: 1,
        duration: 500,
        delay: randomDelay,
        useNativeDriver: false,
      }),
    ]).start(() => {
      
      setIsPressable(true);
    });

    fadeAnims.forEach((fadeAnim, index) => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        delay: (index * 200) + 1000,
        useNativeDriver: false,
      }).start();
    });
  }
}, [loading, resultado]);

      const [fontsLoaded] = useFonts({
        'Astronomicon': require('../../assets/fonts/Astronomicon.ttf'),
      });
    
      const obtenerCoordenadasCiudad = () => {
        if (!userData?.birthCity || !userData?.birthCountry) return;
      
        const ciudadBuscada = userData.birthCity.trim().toLowerCase();
        const paisSeleccionado = userData.birthCountry.trim();
      
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
        if (userData?.birthCity && userData?.birthCountry) {
          obtenerCoordenadasCiudad();
        }
      }, [userData?.birthCity, userData?.birthCountry]);
      
    const fetchPlanetPositions = async () => {
        if (!latitud || !longitud) {
            setError('Las coordenadas no están disponibles.');
            setLoading(false);
            return;
        }

        const fechaHora = `${userData?.birthDate}T${userData?.birthTime}`;

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
            setAscendente(response.data.ascendente);
            setLoading(false);
        } catch (err) {
            console.error("Error al obtener la carta natal:", err);
            setError('Hubo un error al obtener las posiciones planetarias de la carta natal.');
            setLoading(false);
        }
    };

  const fetchCurrentPlanetPositions = async () => {
    const fechaHoraParaBackend = fechaTransito.toISOString().slice(0, 19); 

    try {
      const response = await axios.get(
        'https://appstralbackend-production.up.railway.app/astros_hoy',
        {
          params: {
            fecha: fechaHoraParaBackend, 
            lang: i18n.language,
          },
        }
      );
      setPlanetasDelMomento(response.data.planetas);
    } catch (err) {
      console.error('Error al obtener los planetas del momento:', err);
    }
  };

    useEffect(() => {
    if (userData?.birthDate && userData?.birthTime && latitud && longitud) {
      fetchPlanetPositions();
    }
  }, [userData?.birthDate, userData?.birthTime, latitud, longitud]);

  useEffect(() => {
    fetchCurrentPlanetPositions();
  }, [fechaTransito, i18n.language]);

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
        "Ascendente": "c",
        "Medio Cielo": 'd'  
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
        "Ascendant": "c",
        "MidHeaven": 'd'  
      };

      
  const [tooltip, setTooltip] = useState({ visible: false, sign: '', position: { x: 0, y: 0 } });
  const [selectedSign, setSelectedSign] = useState(null); 
  const timeoutRef = useRef(null);
const [selectedNatalPlanet, setSelectedNatalPlanet] = useState(null);
const [selectedTransitPlanet, setSelectedTransitPlanet] = useState(null);

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

    const renderNatalItem = ({ item, index }) => {
    let signo, grado, minutos, casa, simbolo, retrogrado;
    const ascendente = resultado.casas['1'];
    const medioCielo = resultado.casas['10'];

    if (item === t("Ascendente") && ascendente) {
      signo = ascendente.signo;
      grado = ascendente.grado;
      minutos = ascendente.minutos;
      simbolo = 'c'; 
      retrogrado = false;
    } else if (item === t("Medio Cielo") && medioCielo) { 
      signo = medioCielo.signo;
      grado = medioCielo.grado;
      minutos = medioCielo.minutos;
      simbolo = 'd'; 
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
    const isSelected = selectedNatalPlanet === item;
    const textColor = isSelected ? theme.focusedItem : theme.tertiary;

    const getOrdinal = (number) => {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const remainder = number % 100;
      return number + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
    };

    const casaOrdinal = (i18n.language === 'en' && casa) ? getOrdinal(casa) : casa;

    return (
    <TouchableOpacity onPress={() => {setSelectedNatalPlanet(isSelected ? null : item);
      if (!isSelected) {setSelectedTransitPlanet(null);}}}>
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
                : item === t("Medio Cielo") // Display format for Midheaven
                ? (i18n.language === 'en'
                    ? `Midheaven in ${signo} at ${gradoDisplay}° ${minutosDisplay}'`
                    : `Medio Cielo en ${signo} a ${gradoDisplay}° ${minutosDisplay}'`)
                : t('planet_house_position', { planet: item, sign: signo, degree: grado, casa: casaOrdinal, minutes: minutos, retro: retrogrado ? ' Rx' : '' })}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

const renderTransitItem = ({ item, index }) => {
    const cuerpoData = planetasDelMomento[item];
    if (!cuerpoData) return null;
    const { signo, grado, minutos, retrógrado: retrogrado, estacionario } = cuerpoData;
    const simbolo = simbolosPlanetas[item] || '';

    if (!signo || grado === undefined || minutos === undefined) return null;

    const gradoDisplay = grado === 0 ? '0' : grado;
    const minutosDisplay = minutos === 0 ? '0' : minutos;
    const retrogradoDisplay = retrogrado && item !== "Nodo Norte" ? " Rx" : "";
    const estacionarioDisplay = estacionario && !retrogrado && item !== "Nodo Norte" ? " st" : "";
    const isSelected = selectedTransitPlanet === item;
    const textColor = isSelected ? theme.focusedItem : theme.secondary; 

    return (
    <TouchableOpacity onPress={() => {setSelectedTransitPlanet(isSelected ? null : item);
      if (!isSelected) { setSelectedNatalPlanet(null); }}}>
        <Animated.View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp('2.5%'), marginVertical: 'auto', paddingVertical: hp('.75%') }}>
            <Text style={{ color: textColor, fontFamily: 'Astronomicon', fontSize: RFValue(13), marginBottom: 'auto', transform: [{ translateY: hp('0.25%') }] }}>
              {simbolo}
                    </Text>
            <Text style={{ fontSize: RFValue(12), fontFamily: 'Effra_Regular', color: textColor, paddingBottom: hp('0.5%'), borderColor: theme.primaryBorder, borderBottomWidth: hp(0.1), width: '100%' }}>
                        {i18n.language === 'en'
                            ? `${item} in ${signo} at ${gradoDisplay}° ${minutosDisplay}'${retrogradoDisplay}${estacionarioDisplay}`
                            : `${item} en ${signo} a ${gradoDisplay}° ${minutosDisplay}'${retrogradoDisplay}${estacionarioDisplay}`}
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
        if (!resultado || !planetasDelMomento) return null;

        const SVG_SIZE = width * 0.96;
        const RADIO = SVG_SIZE / 2.5;
        const CENTER = { x: SVG_SIZE / 2, y: SVG_SIZE / 2 };
        const ANGLE_PER_SIGN = 360 / 12;
        const LINE_LENGTH = RADIO + 10;
        const DISTANCIA_ASC = RADIO * 0.65;
        const DISTANCIA_MC = RADIO * 0.61;
        const DISTANCIA_PLANETAS = RADIO * 0.75; 
        const DISTANCIA_PLANETAS_ACTUALES = RADIO * 0.83; 
        const DISTANCIA_ANGULARES = RADIO * 0.675;
        const DISTANCIA_INNERCIRCLE = RADIO * 0.65;
        const DISTANCIA_ASPECTOS_NATAL = RADIO * 0.65; 
        const DISTANCIA_ASPECTOS_TRANSITO = RADIO * 0.65; 
        const DISTANCIA_SIGNOS = RADIO + 18;
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

        const planetasYPuntosNatal = [
            ...Object.keys(resultado.planetas),
            t("Ascendente"),
            t("Medio Cielo")
        ];

        const simbolosPlanetas = i18n.language === 'es' ? {
            "Sol": "Q", "Luna": "R", "Mercurio": "S", "Venus": "T", "Marte": "U", "Júpiter": "V",
            "Saturno": "W", "Urano": "X", "Neptuno": "Y", "Plutón": "Z", "Lilith": "z",
            "Quirón": "q", "Nodo Norte": "g", "Ascendente": "c", "Medio Cielo": "d"
        } : {
            "Sun": "Q", "Moon": "R", "Mercury": "S", "Venus": "T", "Mars": "U", "Jupiter": "V",
            "Saturn": "W", "Uranus": "X", "Neptune": "Y", "Pluto": "Z", "Lilith": "z",
            "Chiron": "q", "North Node": "g", "Ascendant": "c", "Midheaven": "d"
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

        const renderizarLineasAspectos = () => {
            const lineasDeAspectos = [];

            const esLuminaria = (p) => p === "Sol" || p === "Luna" || p === "Sun" || p === "Moon";
            const esInterno = (p) => ["Mercurio", "Venus", "Marte", "Júpiter", "Saturno", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"].includes(p);
            const esExterno = (p) => ["Urano", "Neptuno", "Plutón", "Uranus", "Neptune", "Pluto"].includes(p);
            const esCardinal = (p) => p === t("Ascendente") || p === t("Medio Cielo");

            const getCategoria = (nombre) => {
                if (esLuminaria(nombre)) return 'luminarias';
                if (esInterno(nombre)) return 'internos';
                if (esExterno(nombre)) return 'externos';
                if (esCardinal(nombre)) return 'cardinales';
                return 'otros';
            };

            const aspectosDefinidos = [{
                angulo: 0, tipo: 'mayor', color: "#d194ff", nombre: "Conjunción"
            }, {
                angulo: 90, tipo: 'mayor', color: "#d194ff", nombre: "Cuadratura"
            }, {
                angulo: 180, tipo: 'mayor', color: "#d194ff", nombre: "Oposición"
            }, {
                angulo: 60, tipo: 'menor', color: "#8acfff", nombre: "Sextil"
            }, {
                angulo: 120, tipo: 'mayor', color: "#8acfff", nombre: "Trígono"
            }, {
                angulo: 30, tipo: 'menor', color: "#ffe278", nombre: "Semisextil"
            }, {
                angulo: 150, tipo: 'menor', color: "#ffe278", nombre: "Quincuncio"
            }];

    const hasSelectedPlanet = selectedNatalPlanet !== null || selectedTransitPlanet !== null;

    planetasYPuntosNatal.forEach((natalCuerpoNombre, natalIndex) => {
        let natalCuerpoData;
        if (natalCuerpoNombre === t("Ascendente")) {
            natalCuerpoData = resultado.casas["1"];
        } else if (natalCuerpoNombre === t("Medio Cielo")) {
            natalCuerpoData = resultado.casas["10"];
        } else {
            natalCuerpoData = resultado.planetas[natalCuerpoNombre];
        }

        if (!natalCuerpoData) return;

        const natalSignoIndex = signosZodiacales.indexOf(natalCuerpoData.signo);
        const natalAngulo = (-natalSignoIndex * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (natalCuerpoData.grado + natalCuerpoData.minutos / 60) * (ANGLE_PER_SIGN / 30);
        const posicionNatal = calcularPosicion(natalAngulo, DISTANCIA_ASPECTOS_NATAL);

        Object.keys(planetasDelMomento).forEach((transitoCuerpoNombre, transitoIndex) => {
            const transitoCuerpoData = planetasDelMomento[transitoCuerpoNombre];
            if (!transitoCuerpoData) return;

            const transitoSignoIndex = signosZodiacales.indexOf(transitoCuerpoData.signo);
            const transitoAngulo = (-transitoSignoIndex * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (transitoCuerpoData.grado + transitoCuerpoData.minutos / 60) * (ANGLE_PER_SIGN / 30);
            const posicionTransito = calcularPosicion(transitoAngulo, DISTANCIA_ASPECTOS_TRANSITO);

            const diferenciaAngular = calcularDiferenciaAngular(natalAngulo, transitoAngulo);

            const categoriaNatal = getCategoria(natalCuerpoNombre);
            const categoriaTransito = getCategoria(transitoCuerpoNombre);

            aspectosDefinidos.forEach(({ angulo, color, tipo }) => {
                let orbeMaximo;
                if (tipo === 'mayor') {
                    orbeMaximo = Math.max(
                        userData.mayores[categoriaNatal] || 0,
                        userData.mayores[categoriaTransito] || 0
                    );
                } else { 
                    orbeMaximo = Math.max(
                        userData.menores[categoriaNatal] || 0,
                        userData.menores[categoriaTransito] || 0
                    );
                }

                if (Math.abs(diferenciaAngular - angulo) < orbeMaximo) {
                    let shouldShowAspect = true;

                    if (hasSelectedPlanet) {
                        if (selectedNatalPlanet && selectedNatalPlanet !== natalCuerpoNombre) {
                            shouldShowAspect = false;
                        }
                        if (selectedTransitPlanet && selectedTransitPlanet !== transitoCuerpoNombre) {
                            shouldShowAspect = false;
                        }
                        if (selectedNatalPlanet && selectedTransitPlanet && selectedNatalPlanet !== natalCuerpoNombre && selectedTransitPlanet !== transitoCuerpoNombre) {
                            shouldShowAspect = false;
                        }
                        if (selectedNatalPlanet && !selectedTransitPlanet && natalCuerpoNombre !== selectedNatalPlanet) {
                             shouldShowAspect = false;
                        }
                        if (selectedTransitPlanet && !selectedNatalPlanet && transitoCuerpoNombre !== selectedTransitPlanet) {
                            shouldShowAspect = false;
                        }
                    }


                    if (shouldShowAspect) {
                        lineasDeAspectos.push(
                            <AnimatedLine key={`aspect-${natalCuerpoNombre}-${transitoCuerpoNombre}-${angulo}`}
                                x1={posicionNatal.x}
                                y1={posicionNatal.y}
                                x2={posicionTransito.x}
                                y2={posicionTransito.y}
                                stroke={color}
                                strokeWidth="1.25"
                                opacity={opacityAnimLine}
                            />
                        );
                    }
                }
            });
        });
    });

    return lineasDeAspectos;
};

        const calcularPosicionAjustada = (cuerpoNombre, index, ASCENDENTROTATION, todosLosCuerpos, baseDistance, dataOrigin) => {
            const UMBRAL_ANGULO = 7;

            const getAnguloDeCuerpo = (nombre, data) => {
                if (nombre === t("Ascendente")) {
                    const { signo, grado, minutos } = data.casas["1"];
                    const signoIndex = signosZodiacales.indexOf(signo);
                    return (-signoIndex * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (grado + minutos / 60) * (ANGLE_PER_SIGN / 30);
                } else if (nombre === t("Medio Cielo")) {
                    const { signo, grado, minutos } = data.casas["10"];
                    const signoIndex = signosZodiacales.indexOf(signo);
                    return (-signoIndex * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (grado + minutos / 60) * (ANGLE_PER_SIGN / 30);
                } else {
                    const { signo, grado, minutos } = data.planetas[nombre];
                    const signoIndex = signosZodiacales.indexOf(signo);
                    return (-signoIndex * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (grado + minutos / 60) * (ANGLE_PER_SIGN / 30);
                }
            };

            const anguloActual = getAnguloDeCuerpo(cuerpoNombre, dataOrigin);

            let grupoIndices = [];
            for (let i = 0; i < todosLosCuerpos.length; i++) {
                if (todosLosCuerpos[i] !== t("Ascendente") && todosLosCuerpos[i] !== t("Medio Cielo") &&
                    calcularDiferenciaAngular(anguloActual, getAnguloDeCuerpo(todosLosCuerpos[i], dataOrigin)) < UMBRAL_ANGULO) {
                    grupoIndices.push(i);
                }
            }

            if (!grupoIndices.includes(index) && cuerpoNombre !== t("Ascendente") && cuerpoNombre !== t("Medio Cielo")) {
                grupoIndices.push(index);
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
                distancia = baseDistance;
            } else {
                const paso = DISTANCIA_EXTRA_TOTAL / (cantidadEnGrupo - 1);
                const offset = -DISTANCIA_EXTRA_TOTAL * (1 / 4) + paso * posicionEnGrupo;
                distancia = baseDistance + offset;
            }

            return calcularPosicion(anguloActual, distancia);
        };

const calcularPosicionAjustadaActual = (cuerpoNombre, index, baseDistance) => {
    const UMBRAL_ANGULO = 7;

    const getAnguloDeCuerpoActual = (nombre, data) => {
        const { signo, grado, minutos } = data[nombre];
        const signoIndex = signosZodiacales.indexOf(signo);
        return (-signoIndex * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (grado + minutos / 60) * (ANGLE_PER_SIGN / 30);
    };

    const anguloActual = getAnguloDeCuerpoActual(cuerpoNombre, planetasDelMomento);

    let grupoIndices = [];
    const todosLosCuerposActuales = Object.keys(planetasDelMomento);

    for (let i = 0; i < todosLosCuerposActuales.length; i++) {
        if (calcularDiferenciaAngular(anguloActual, getAnguloDeCuerpoActual(todosLosCuerposActuales[i], planetasDelMomento)) < UMBRAL_ANGULO) {
            grupoIndices.push(i);
        }
    }

    if (!grupoIndices.includes(index)) {
        grupoIndices.push(index);
    }

    grupoIndices.sort((a, b) => a - b);
    const posicionEnGrupo = grupoIndices.indexOf(index);
    const cantidadEnGrupo = grupoIndices.length;

    let DISTANCIA_EXTRA_TOTAL_ACTUAL;
    if (cantidadEnGrupo <= 3) {
        DISTANCIA_EXTRA_TOTAL_ACTUAL = 10;
    } else {
        DISTANCIA_EXTRA_TOTAL_ACTUAL = 25;
    }

    let distancia;
    if (cantidadEnGrupo === 1) {
        distancia = baseDistance;
    } else {
        const paso = DISTANCIA_EXTRA_TOTAL_ACTUAL / (cantidadEnGrupo - 1);
        const offset = -DISTANCIA_EXTRA_TOTAL_ACTUAL * (1 / 4) + paso * posicionEnGrupo;
        distancia = baseDistance + offset;
    }

    return calcularPosicion(anguloActual, distancia);
};

        return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }], opacity: opacityAnim }}>

                <AnimatedSvg width={SVG_SIZE} height={SVG_SIZE}>

                    <Circle cx={CENTER.x} cy={CENTER.y} r={RADIO} stroke={theme.tertiary} strokeWidth="2" fill="none" strokeDasharray={`${LONGITUD_LINEA},${LONGITUD_ESPACIO}`} transform={`rotate(${-ASCENDENTROTATION + 1}, ${CENTER.x}, ${CENTER.y})`} />

                    {signosSimbolos.map((signo, index) => {
                        const angle = (-index * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION;
                        const textPos = calcularPosicion(angle - ANGLE_PER_SIGN / 2, DISTANCIA_SIGNOS);

                        const isSelected = selectedSign === signo;
                        const textColor = isSelected ? theme.primary : theme.tertiary;

                        return (
                            <G key={signo} onPressIn={() => handlePressIn(signo, index, textPos)} >
                                <AnimatedText
                                    x={textPos.x}
                                    y={textPos.y}
                                    fontSize={height * 0.03}
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
                                />
                            </G>
                        );
                    })}

                    {distanciasCasas.map((angleCasa, index) => {
                        const isICMCLine = index === 2;
                        const lineColor = (selectedNatalPlanet === t("Medio Cielo") && isICMCLine)
                            ? theme.focusedItem
                            : theme.tertiary;

                        return (
                            <Line
                                key={index}
                                x1={CENTER.x + RADIO * Math.cos(angleCasa * (Math.PI / 180))}
                                y1={CENTER.y + RADIO * Math.sin(angleCasa * (Math.PI / 180))}
                                x2={CENTER.x + RADIO * Math.cos((angleCasa + 180) * (Math.PI / 180))}
                                y2={CENTER.y + RADIO * Math.sin((angleCasa + 180) * (Math.PI / 180))}
                                stroke={lineColor}
                                strokeWidth={.75}
                                markerStart={isICMCLine ? "url(#arrow)" : ""}
                            />
                        );
                    })}

                    <Defs>
                        <Marker id="arrow" viewBox="0 0 10 10" refX="0" refY="5" orient="auto" markerWidth="12" markerHeight="12">
                            <Path d="M8,0 L0,5 L8,10 z" fill={selectedNatalPlanet === t("Medio Cielo") ? theme.focusedItem : theme.tertiary} />
                        </Marker>
                        <Marker id="arrowAC" viewBox="0 0 10 10" refX="7" refY="5" orient="auto" markerWidth="6" markerHeight="6">
                            <Path d="M0,0 L8,5 L0,10 z" fill={selectedNatalPlanet === t("Ascendente") ? theme.focusedItem : theme.tertiary} />
                        </Marker>
                    </Defs>
                    <Line markerEnd="url(#arrowAC)" x1={CENTER.x + RADIO} y1={CENTER.y} x2={CENTER.x - RADIO} y2={CENTER.y} stroke={selectedNatalPlanet === t("Ascendente") ? theme.focusedItem : theme.tertiary} strokeWidth="1.5" />

                    <Animated.View style={{ transform: [{ rotate: rotatePlanetasInterpolate }] }}>
                        <AnimatedSvg width={SVG_SIZE} height={SVG_SIZE}>

                            {renderizarLineasAspectos()}

                            {planetasYPuntosNatal.map((cuerpo, index) => {
                            let cuerpoData;
                            let isRetrogrado = false;
                            let isEstacionario = false;

                            if (cuerpo === t("Ascendente")) {
                                cuerpoData = resultado.casas["1"];
                            } else if (cuerpo === t("Medio Cielo")) {
                                cuerpoData = resultado.casas["10"];
                            } else {
                                cuerpoData = resultado.planetas[cuerpo];
                                isRetrogrado = cuerpoData.retrógrado;
                                isEstacionario = cuerpoData.estacionario;
                            }

                            if (!cuerpoData) return null;

let distanciaBase;
if (cuerpo === t("Ascendente")) {
    distanciaBase = DISTANCIA_ASC;
} else if (cuerpo === t("Medio Cielo")) {
    distanciaBase = DISTANCIA_MC;
} else {
    distanciaBase = DISTANCIA_PLANETAS;
}

const posicion = calcularPosicionAjustada(cuerpo, index, ASCENDENTROTATION, planetasYPuntosNatal, distanciaBase, resultado);
                            const isSelectedNatal = cuerpo === selectedNatalPlanet;
                            const circleFillColor = (cuerpo === t("Ascendente") || cuerpo === t("Medio Cielo"))
                                ? (isSelectedNatal ? theme.focusedItem : theme.tertiary) 
                                : 'none'; 

                            const symbolTextColor = (cuerpo === t("Ascendente") || cuerpo === t("Medio Cielo"))
                                ? theme.background
                                : (isSelectedNatal ? theme.focusedItem : theme.tertiary); 

                            const symbolFontSize = (cuerpo === t("Ascendente") || cuerpo === t("Medio Cielo")) ? RFValue(10) : RFValue(17);

                            return (
                                <G key={cuerpo + '-natal'} onPressIn={() => setSelectedNatalPlanet(cuerpo)} onPressOut={() => setSelectedNatalPlanet(null)}>
                                    {(cuerpo === t("Ascendente") || cuerpo === t("Medio Cielo")) && (
                                        <Circle
                                            cx={posicion.x}
                                            cy={posicion.y}
                                            r={RFValue(5.25)}
                                            fill={circleFillColor}
                                        />
                                    )}

                                    <AnimatedText
                                        x={posicion.x}
                                        y={posicion.y - ((cuerpo === t("Ascendente") || cuerpo === t("Medio Cielo")) ? .8 : 0)}
                                        fontSize={symbolFontSize}
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        fill={symbolTextColor} 
                                        fontFamily="Astronomicon"
                                    >
                                        {simbolosPlanetas[cuerpo]}
                                    </AnimatedText>

                                    {cuerpo !== "Nodo Norte" && cuerpo !== "North Node" && (
                                        <>
                                            {isEstacionario && !isRetrogrado && (
                                                <SvgText x={posicion.x + 4} y={posicion.y + 10} fontSize={height * 0.008} textAnchor="start" alignmentBaseline="middle" fill={symbolTextColor} fontFamily="Effra_Regular">st</SvgText>
                                            )}
                                            {isRetrogrado && !isEstacionario && (
                                                <SvgText x={posicion.x + 4} y={posicion.y + 10} fontSize={height * 0.008} textAnchor="start" alignmentBaseline="middle" fill={symbolTextColor} fontFamily="Effra_SemiBold">Rx</SvgText>
                                            )}
                                            {isRetrogrado && isEstacionario && (
                                                <SvgText x={posicion.x + 4} y={posicion.y + 10} fontSize={height * 0.008} textAnchor="start" alignmentBaseline="middle" fill={symbolTextColor} fontFamily="Effra_SemiBold">stRx</SvgText>
                                            )}
                                        </>
                                    )}
                                </G>
                            );
                        })}

                        {Object.keys(planetasDelMomento).map((cuerpoActual, index) => {
                            const currentCuerpoData = planetasDelMomento[cuerpoActual];
                            const isRetrogradoActual = currentCuerpoData.retrógrado;
                            const isEstacionarioActual = currentCuerpoData.estacionario;

                            const posicionActual = calcularPosicionAjustadaActual(cuerpoActual, index, DISTANCIA_PLANETAS_ACTUALES);

                            const isSelectedTransit = cuerpoActual === selectedTransitPlanet;
                            const transitSymbolColor = isSelectedTransit ? theme.focusedItem : theme.transitPlanetColor; 

                            return (
                                <G key={cuerpoActual + '-actual'} onPressIn={() => setSelectedTransitPlanet(cuerpoActual)} onPressOut={() => setSelectedTransitPlanet(null)}>
                                    <AnimatedText
                                        x={posicionActual.x}
                                        y={posicionActual.y}
                                        fontSize={RFValue(17)}
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        fill={transitSymbolColor} 
                                        fontFamily="Astronomicon"
                                    >
                                        {simbolosPlanetas[cuerpoActual]}
                                    </AnimatedText>

                                    {cuerpoActual !== "Nodo Norte" && cuerpoActual !== "North Node" && (
                                        <>
                                            {isEstacionarioActual && !isRetrogradoActual && (
                                                <SvgText x={posicionActual.x + 4} y={posicionActual.y + 10} fontSize={height * 0.008} textAnchor="start" alignmentBaseline="middle" fill={transitSymbolColor} fontFamily="Effra_Regular">st</SvgText>
                                            )}
                                            {isRetrogradoActual && !isEstacionarioActual && (
                                                <SvgText x={posicionActual.x + 4} y={posicionActual.y + 10} fontSize={height * 0.008} textAnchor="start" alignmentBaseline="middle" fill={transitSymbolColor} fontFamily="Effra_SemiBold">Rx</SvgText>
                                            )}
                                            {isRetrogradoActual && isEstacionarioActual && (
                                                <SvgText x={posicionActual.x + 4} y={posicionActual.y + 10} fontSize={height * 0.008} textAnchor="start" alignmentBaseline="middle" fill={transitSymbolColor} fontFamily="Effra_SemiBold">stRx</SvgText>
                                            )}
                                        </>
                                    )}
                                </G>
                            );
                        })}

                            {/* Números de las casas */}
                            <G>
                                {posicionesCasas.map(({ numero, pos }, index) => (
                                    <React.Fragment key={numero}>
                                        <AnimatedCircle
                                            cx={pos.x}
                                            cy={pos.y}
                                            r={RFValue(5)}
                                            fill={theme.tertiary}
                                        />
                                        <AnimatedG >
                                            <SvgText
                                                x={pos.x}
                                                y={pos.y}
                                                fontFamily="Effra_SemiBold"
                                                fontSize={RFValue(7)}
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
                    {/* Círculo interno */}
                    <AnimatedCircle cx={CENTER.x} cy={CENTER.y} r={DISTANCIA_INNERCIRCLE} stroke={theme.tertiary} fill="none" strokeWidth="1.5" />

                </AnimatedSvg>

                {/* Tooltip */}
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
                        <Text style={{ color: theme.background, fontFamily: 'Effra_Regular', fontSize: height * 0.012 }}>{tooltip.sign}</Text>
                    </View>
                )}
            </Animated.View>
        );
    };

        if (loading) {
          return (
           <View style={{height:height, backgroundColor: theme.background,justifyContent: 'center', alignItems: 'center', }}>
            <ActivityIndicator size="large" color="#ab89e9"/></View>
          );
        }

  const operaciones = {
    'minuto': { unit: 'Minutes', increment: 1, decrement: -1 },
    'hora': { unit: 'Hours', increment: 1, decrement: -1 },
    'dia': { unit: 'Date', increment: 1, decrement: -1 },
    'semana': { unit: 'Date', increment: 7, decrement: -7 },
    'mes': { unit: 'Month', increment: 1, decrement: -1 },
    'año': { unit: 'FullYear', increment: 1, decrement: -1 },
  };
  const cambiarModo = () => {
    setSelectedSign(null);
    setTooltip({ visible: false, sign: '', position: { x: 0, y: 0 } });
    const nextMode = {
      'minuto': 'hora',
      'hora': 'dia',
      'dia': 'semana',
      'semana': 'mes',
      'mes': 'año',
      'año': 'minuto',
    };
    setModo(nextMode[modo]);
  };
  
  const ajustarFecha = (operation) => {
    const { unit, increment, decrement } = operaciones[modo];
    setFechaTransito(new Date(fechaTransito[`set${unit}`](fechaTransito[`get${unit}`]() + (operation === 'sumar' ? increment : decrement))));
  };
  const sumar = () => {
    setSelectedSign(null);
    setTooltip({ visible: false, sign: '', position: { x: 0, y: 0 } });
    ajustarFecha('sumar');
  };
  
  const restar = () => {
    setSelectedSign(null);
    setTooltip({ visible: false, sign: '', position: { x: 0, y: 0 } });
    ajustarFecha('restar');
  };

  const handleRestar = () => restar();
  const handleSumar = () => sumar();
  const handleModoChange = () => cambiarModo();

    const resetFechaTransito = () => {
      setFechaTransito(initialDate);
    };

  return (
    <View style={styles.myChartContainer}>
    <View style={{ width: width*.9,
margin: 'auto',
paddingTop: hp('3%'),
marginTop: 0,
gap: 7.5}}>
    <View style={styles.chartTitle}>
          <Text numberOfLines={1} ellipsizeMode="tail"  style={{maxWidth: wp('80%'),
    color: theme.black,
    fontSize: RFValue(18),
    textAlign: 'left',
    fontFamily: 'Effra_Regular',
    alignContent: 'center',
    alignItems: 'center',}}>
  {i18n.language === 'es' ? 'Mis Tránsitos' : 'My Transits'}
</Text>
          <View style={[styles.chartOptions, { opacity: !loading ? 1 : 0.3 }]}>
            <TouchableOpacity onPress={handleOpenModal}>
          <ShareIcon style={{ width: 16, height: 16, margin:'auto', fill:'#999999' }} />          
          </TouchableOpacity>
        </View>
          </View></View>
    <View style={{justifyContent: 'center', alignSelf: 'center', height: wp('95%'), width: wp('95%'), }}>{renderCirculoZodiacal()}</View>
                 <Text style={{textTransform: 'uppercase',textAlign: 'center',fontFamily: 'Effra_Regular',color: theme.primary,fontSize: RFValue(12),alignSelf: 'center'}}>
                         {formattedDate}
                         </Text>
                   <View style={{ display: 'flex', flexDirection: 'row',gap: wp('2%'),marginVertical: hp('1%'), marginHorizontal: 'auto',}}>
             <TouchableOpacity style={{backgroundColor: 'transparent', borderRadius: 100,elevation: 0,shadowColor: 'transparent',borderColor: theme.secondaryBorder,borderWidth: 1,width: hp('4%'),height: hp('4%'),justifyContent: 'center', alignItems: 'center',}}  disabled={loading} onPress={handleRestar}>
               <Text style={styles.titleButton}>-</Text>
             </TouchableOpacity>
             
             <TouchableOpacity style={{backgroundColor: 'transparent',borderRadius: 50,elevation: 0,width: hp('13%'),height: hp('4%'),shadowColor: 'transparent', borderColor: theme.secondaryBorder,borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}  disabled={loading} onPress={handleModoChange}>
             <Text style={styles.titleModoButton}>
             {t(modo === 'hora' ? 'Hora' : 
               modo === 'minuto' ? 'Minuto' : 
               modo === 'semana' ? 'Semana' : 
               modo === 'mes' ? 'Mes' : 
               modo === 'año' ? 'Año' : 'Dia')}
           </Text>
             </TouchableOpacity>
             
             <TouchableOpacity style={{backgroundColor: 'transparent', borderRadius: 100,elevation: 0,shadowColor: 'transparent',borderColor: theme.secondaryBorder,borderWidth: 1,width: hp('4%'),height: hp('4%'),justifyContent: 'center', alignItems: 'center',}}  disabled={loading} onPress={handleSumar}>
               <Text style={styles.titleButton}>+</Text>
             </TouchableOpacity>
             <TouchableOpacity 
                 style={{backgroundColor: 'transparent', borderRadius: 100,elevation: 0,shadowColor: 'transparent',borderColor: theme.secondaryBorder,borderWidth: 1,width: hp('4%'),height: hp('4%'),justifyContent: 'center', alignItems: 'center',}} 
                 onPress={resetFechaTransito}
               >
                 <ResetIcon style={styles.resetIcon} />
               </TouchableOpacity>
           </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: hp('.75%'),  marginHorizontal: hp('5%')}}>
                <TouchableOpacity onPress={() => scrollToPage(0)} style={{ paddingHorizontal: wp('10%'), paddingVertical: hp('.75%'), borderRadius: 50, backgroundColor: selectedTab === 0 ? theme.activeButtonBg : theme.buttonBg }}>
                    <Text style={{ color: selectedTab === 0 ? theme.activeButtonText : theme.buttonText, fontFamily: 'Effra_Regular', fontSize: RFValue(12) }}>
                         {t('transit_planets')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => scrollToPage(1)} style={{ paddingHorizontal: wp('10%'), paddingVertical: hp('.75%'), borderRadius: 50, backgroundColor: selectedTab === 1 ? theme.activeButtonBg : theme.buttonBg }}>
                    <Text style={{ color: selectedTab === 1 ? theme.activeButtonText : theme.buttonText, fontFamily: 'Effra_Regular', fontSize: RFValue(12) }}>
                        {t('natal_planets')}
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled 
                showsHorizontalScrollIndicator={false}
                onScroll={event => { 
                    const contentOffsetX = event.nativeEvent.contentOffset.x;
                    const currentPage = Math.round(contentOffsetX / screenWidth);
                    setSelectedTab(currentPage);
                }}
                scrollEventThrottle={16} 
                style={{ flex: 1 }} 
            >


                <View style={{ width: screenWidth }}> 
                    {planetasDelMomento && (
                        <FlatList
                            ref={transitListRef} 
                            data={orderedPlanetasDelMomento}
                            renderItem={renderTransitItem}
                            keyExtractor={(item) => item + '-transit'}
                            contentContainerStyle={styles.chartResultList}
                            ListFooterComponent={<View style={styles.chartResultListSpace} />}
                        />
                    )}
                     {!planetasDelMomento && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: theme.text }}>{t('loading_transit_data')}</Text>
                        </View>
                    )}
                </View>
                                <View style={{ width: screenWidth }}>
                    {resultado && (
                        <FlatList
                            ref={natalListRef}
                            data={currentPlanetsOrder}
                            renderItem={renderNatalItem}
                            keyExtractor={(item) => item + '-natal'}
                            contentContainerStyle={styles.chartResultList}
                            ListFooterComponent={<View style={styles.chartResultListSpace} />}
                        />
                    )}
                    {!resultado && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: theme.text }}>{t('loading_natal_data')}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
           <LinearGradient pointerEvents="none" colors={['transparent', theme.shadowBackground, theme.shadowBackground, theme.shadowBackground]} style={{  position: 'absolute',bottom: 0, left: 0,right: 0, height: hp('20%'), zIndex: 1}}/>
{modalVisible && (<ShareMyChartModal
        visible={modalVisible}
        fechaTransito={fechaTransito}
        handleCloseModal={handleCloseModal}
        selectedNatalPlanet={selectedNatalPlanet}
        selectedTransitPlanet={selectedTransitPlanet}
      />)}
    </View>
     
  );
};


export default MyTransitsScreen;