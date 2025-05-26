import React, { useState, useEffect, useRef, useContext } from 'react';
import {auth, doc, db, updateDoc, deleteDoc,getDoc } from '../config/firebaseConfig';
import { View, Text, ActivityIndicator,RefreshControl, Dimensions, Animated, FlatList, Easing, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import Svg, { Circle, Line, G, Text as SvgText, Path, Defs, Marker } from 'react-native-svg';
import cities from '../data/cities.json'; 
import { useCasa } from '../contexts/CasaContext';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../utils/colors';
import { useUser } from '../contexts/UserContext';
import ShareIcon from "../../assets/icons/ShareIcon";
import ShareChartModal from '../modals/ShareChartModal';
import { useTranslation } from 'react-i18next';
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";

const SolarRevoScreen = ({ route, navigation }) => {
   const { theme } = useContext(ThemeContext);
    const {userData} = useUser();
  
   const styles = createStyles(theme);
  const { cartaId } = route.params || {}; 
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latitud, setLatitud] = useState(null);
    const [cartaData, setCartaData] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [pais, setPais] = useState('');
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
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
    const { t, i18n  } = useTranslation();
    const [fechaRepeticion, setFechaRepeticion] = useState(null);
    const [formattedDate, setFormattedDate] = useState('');
    const [formattedTime, setFormattedTime] = useState('');
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
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
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

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
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
      ]).start();

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
        if (!ciudad || !pais) return;
      
        const ciudadBuscada = ciudad.trim().toLowerCase();
        const paisSeleccionado = pais.trim();
      
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
        if (ciudad && pais) {
          obtenerCoordenadasCiudad();
        }
      }, [ciudad, pais]);
      
      
      const calculateLastBirthdayYear = (birthDate) => {
        const birth = new Date(birthDate);
        const birthMonth = birth.getMonth();
        const birthDay = birth.getDate();
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
      
        const lastBirthday = new Date(currentYear, birthMonth, birthDay);
      
        return currentDate >= lastBirthday ? currentYear : currentYear - 1;
      };
      
      
      const [year, setYear] = useState(() => calculateLastBirthdayYear(fecha));
      

      const fetchPlanetPositions = async () => {
        if (!latitud || !longitud) {
          setError('Las coordenadas no están disponibles.');
          setLoading(false);
          return;
        }
      
        const fechaHora = `${fecha}T${hora}`;
      
        try {
          setLoading(true);
          const response = await axios.get('https://appstralbackend-production.up.railway.app/revolucion_solar', {
            params: {
              fecha: fechaHora,
              lat: latitud,
              lon: longitud,
              lang: i18n.language,
              sistema_casas: sistemaCasas, 
              year_param: year,
            },
          });
      
          setResultado(response.data);
          setAscendente(response.data.ascendente);
          setFechaRepeticion(response.data.fecha_repeticion);
          setLoading(false);
        } catch (err) {
          setError('Hubo un error al obtener las posiciones planetarias');
          setLoading(false);
        }
      };
      
      useEffect(() => {
        if (fecha && hora && latitud && longitud) {
          fetchPlanetPositions();
        }
      }, [fecha, hora, latitud, longitud, year]);
      

      const handleYearChange = (increment) => {
        setYear((prevYear) => {
          const newYear = prevYear + increment;
          return newYear; 
        });
      };

      const formatDateAndTime = (fechaRepeticion) => {
        const date = new Date(fechaRepeticion);
      
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day} / ${month} / ${year}`;
      
        const hours = String(date.getHours()).padStart(2, '0'); 
        const minutes = String(date.getMinutes()).padStart(2, '0'); 
        const formattedTime = `${hours}:${minutes}`;
      
        return {
          formattedDate,
          formattedTime,
        };
      };
      

  useEffect(() => {
    if (fechaRepeticion && resultado) {
      const { formattedDate, formattedTime } = formatDateAndTime(fechaRepeticion);
      setFormattedDate(formattedDate);
      setFormattedTime(formattedTime);
    }
  }, [fechaRepeticion, resultado]);


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
          <Text style={{ fontSize: RFValue(12), fontFamily: 'Effra_Regular', color: textColor, paddingBottom: hp('0.5%'), borderColor: theme.primaryBorder, borderBottomWidth: hp('0.0325%'), width: '100%' }}>
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

  const renderizarLineasAspectos = (planeta1Data, index) => {
    const nombrePlaneta1 = planeta1Data.nombre;
    const orbesUsuario = userData.orbes;

    return [...planetas.slice(index + 1), t("Ascendente")].flatMap((otroCuerpoNombre) => {
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

      let orbeMaximo;

      const esLuminaria = (p) => p === "Sol" || p === "Luna" || p === "Sun" || p === "Moon";
      const esInterno = (p) => ["Mercurio", "Venus", "Marte", "Júpiter", "Saturno", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"].includes(p);
      const esExterno = (p) => ["Urano", "Neptuno", "Plutón", "Uranus", "Neptune", "Pluto"].includes(p);

      const categoriaPlaneta1 = esLuminaria(nombrePlaneta1) ? 'luminarias' : esInterno(nombrePlaneta1) ? 'internos' : esExterno(nombrePlaneta1) ? 'externos' : 'otros';
      const categoriaOtroCuerpo = esLuminaria(otroCuerpoNombre) ? 'luminarias' : esInterno(otroCuerpoNombre) ? 'internos' : esExterno(otroCuerpoNombre) ? 'externos' : 'otros';

      orbeMaximo = Math.max(
        orbesUsuario[categoriaPlaneta1] || 0,
        orbesUsuario[categoriaOtroCuerpo] || 0
      );

      if (nombrePlaneta1 === t("Ascendente")) {
        orbeMaximo = Math.max(orbeMaximo, orbesUsuario.otros || 0);
      } else if (otroCuerpoNombre === t("Ascendente")) {
        orbeMaximo = Math.max(orbeMaximo, orbesUsuario.otros || 0);
      }

      const aspectos = [
        { angulo: 90, color: "#d194ff" },
        { angulo: 30, color: "#ffe278" },
        { angulo: 60, color: "#8acfff" },
        { angulo: 120, color: "#8acfff" },
        { angulo: 150, color: "#ffe278" },
        { angulo: 180, color: "#d194ff" },
      ];

      return aspectos.map(({ angulo, color }) =>
        Math.abs(diferenciaAngular - angulo) < orbeMaximo ? (
          <Line key={`Line-${nombrePlaneta1}-${otroCuerpoNombre}-${angulo}`}
            x1={posicion1.x} y1={posicion1.y}
            x2={posicion2.x} y2={posicion2.y}
            stroke={color} strokeWidth="1.25"
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
    <View>
      <Svg width={SVG_SIZE} height={SVG_SIZE}>
        <Circle cx={CENTER.x} cy={CENTER.y} r={RADIO} stroke={theme.tertiary} strokeWidth="2" fill="none" strokeDasharray={`${LONGITUD_LINEA},${LONGITUD_ESPACIO}`} transform={`rotate(${-ASCENDENTROTATION + 1}, ${CENTER.x}, ${CENTER.y})`} />

        {signosSimbolos.map((signo, index) => {
          const angle = (-index * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION;
          const textPos = calcularPosicion(angle - ANGLE_PER_SIGN / 2, DISTANCIA_SIGNOS);

          const isSelected = selectedSign === signo;
          const textColor = isSelected ? theme.primary : theme.tertiary;

          return (
            <G key={signo}>
              <SvgText
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
              </SvgText>

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
        <Line markerEnd="url(#arrow)" x1={CENTER.x + RADIO} y1={CENTER.y} x2={CENTER.x - RADIO} y2={CENTER.y} stroke={selectedPlanet === t("Ascendente") ? theme.focusedItem : theme.tertiary} strokeWidth="1.5" />

        <Svg width={SVG_SIZE} height={SVG_SIZE}>
          {planetas.map((planeta, index) => {
            const { signo, grado, minutos, retrógrado, estacionario } = resultado.planetas[planeta];
            const posicion = calcularPosicionAjustada(planetas, index, ASCENDENTROTATION);
            const isSelected = planeta === selectedPlanet;
            const planetaColor = isSelected ? theme.focusedItem : theme.tertiary;

            return (
              <G key={planeta}>
                {renderizarLineasAspectos({ nombre: planeta, angle: posicion.angle }, index)}
                <SvgText x={posicion.x} y={posicion.y} fontSize={height * .022} textAnchor="start" alignmentBaseline="middle" fill={planetaColor} fontFamily="Astronomicon">
                  {simbolosPlanetas[planeta]}
                </SvgText>
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
                <Circle
                  cx={pos.x}
                  cy={pos.y}
                  r={width * 0.015}
                  fill={theme.tertiary}
                />
                <G>
                  <SvgText
                    x={pos.x}
                    y={pos.y}
                    fontFamily="Effra_Regular"
                    fontSize={height * 0.01}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={theme.background}
                  >
                    {numero}
                  </SvgText>
                </G>
              </React.Fragment>
            ))}
          </G>
        </Svg>
        <Circle cx={CENTER.x} cy={CENTER.y} r={DISTANCIA_INNERCIRCLE} stroke={theme.tertiary} fill="none" strokeWidth="1.5" />
      </Svg>

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
    </View>
  );
};
  return resultado !== null ? (

    <View style={styles.myChartContainer}>
    <View style={{ width: width*.9,
margin: 'auto',
paddingTop: hp('3.25%'),
marginTop: 0,
gap: 7.5}}>
    <View style={styles.chartTitle}>
          <Text adjustsFontSizeToFit numberOfLines={2} style={styles.ChartTitleText}>Revolución Solar</Text>
          <View style={[styles.chartOptions, { opacity: !loading ? 1 : 0.3 }]}>
            <TouchableOpacity onPress={handleOpenModal}>
          <ShareIcon style={{ width: 16, height: 16, margin:'auto', fill:'#999999' }} />          
          </TouchableOpacity>
        </View></View>
    <View style={styles.ChartInfo}>
    <Text style={styles.ChartInfoText}>
    {formattedDate}
</Text>
    <View style={styles.chartInfoSeparator} />
    <Text style={styles.ChartInfoTime}>{formattedTime}</Text>
    <View style={styles.chartInfoSeparator} />
    <Text numberOfLines={1} ellipsizeMode="tail"  style={styles.ChartInfoText}>{ciudad}</Text>
    </View>
    </View>
   
    <View style={styles.resultCircle}>
        {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#ab89e9" />
      </View>
        ) : (
          renderCirculoZodiacal()
        )}</View>
        
        <View style={{  display: 'flex', flexDirection: 'row',gap: 5, marginBottom: 10, marginHorizontal: 'auto',}}>
    
      <TouchableOpacity
        style={styles.fechaButton} 
        onPress={() => handleYearChange(-1)}
        disabled={loading}
      >
        <Text style={styles.titleButton}>-</Text>
      </TouchableOpacity>

      <View
        style={styles.fechaModo} 
        onPress={() => {}}
        disabled={loading}
      >
        <Text style={styles.titleModoButton}>{year}</Text>
      </View>

      <TouchableOpacity
        style={styles.fechaButton} 
        onPress={() => handleYearChange(1)}
        disabled={loading}
      >
        <Text style={styles.titleButton}>+</Text>
      </TouchableOpacity>
    </View>
       {resultado && (
           <FlatList
           data={currentPlanetsOrder}
           renderItem={renderItem}
           keyExtractor={(item) => item}
           contentContainerStyle={styles.chartResultList}
           ListFooterComponent={<View style={styles.chartResultListSpace} />}
         />
        )}
           <LinearGradient pointerEvents="none" colors={['transparent', theme.shadowBackground, theme.shadowBackground, theme.shadowBackground]} style={{  position: 'absolute',bottom: 0, left: 0,right: 0, height: hp('30%'), zIndex: 1}}/>

           {modalVisible && (
  <ShareChartModal
    visible={modalVisible}
    route={{ params: { cartaId: cartaId} }}
    year={year}
    formattedDate={formattedDate}
    formattedTime={formattedTime}
    handleCloseShareModal={handleCloseModal}
  />
)}
    </View>
     
    ) : null;
};

export default SolarRevoScreen;