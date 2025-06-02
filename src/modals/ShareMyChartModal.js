import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, ActivityIndicator,RefreshControl, Dimensions, Platform, Animated, FlatList, Easing, Button, Modal, StyleSheet, ScrollView, Touchable, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import Svg, { Circle, Line, G, Image, Text as SvgText, Polygon,Path, Defs, Marker } from 'react-native-svg';
import cities from '../data/cities.json'; 
import { useCasa } from '../contexts/CasaContext';
import LunaLIcon from "../../assets/icons/LunaLIcon";
import LunaMIcon from "../../assets/icons/LunaMIcon";
import LunaCIcon from "../../assets/icons/LunaCIcon";
import LunaNIcon from "../../assets/icons/LunaNIcon";
import { useUser } from '../contexts/UserContext';
import ShareIcon from "../../assets/icons/ShareIcon";
import ViewShot from 'react-native-view-shot';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import CheckIcon from "../../assets/icons/CheckIcon"
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import { RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const { height, width } = Dimensions.get('window'); // You might still need this for initial calculations or if you prefer to mix and match
const viewShotWidth = wp('100%'); // Use wp for full width
const viewShotHeight = (viewShotWidth * 5) / 2.4;


const ShareMyChartModal = ({visible, handleCloseModal, year, formattedDate, formattedTime, selectedPlanet}) => {
 const {userData} = useUser();
 const { theme } = useContext(ThemeContext);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latitud, setLatitud] = useState(null);
  const [faseLunar, setFaseLunar] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [errorCiudad, setErrorCiudad] = useState('');
  const [ascendente, setAscendente] = useState(0);
  const { sistemaCasas, setSistemaCasas } = useCasa();
  const [viewReady, setViewReady] = useState(false);
  const { t, i18n  } = useTranslation();
  
  const renderLunarIcon = () => {
    const isNorthernHemisphere = i18n.language === "en";

    const isCreciente = ["Luna Creciente", "Cuarto Creciente", "Gibosa Creciente"].includes(faseLunar);
    const isMenguante = ["Cuarto Menguante", "Luna Menguante", "Gibosa Menguante"].includes(faseLunar);
  
    const showCrecienteIcon = isNorthernHemisphere ? isMenguante : isCreciente;
    const showMenguanteIcon = isNorthernHemisphere ? isCreciente : isMenguante;

return (
  <View style={{ alignItems: 'center', width: height * 0.02, transform: [{ translateY: 2 }], height: height * 0.02,}}>
      <TouchableOpacity>
        {faseLunar === "Luna Nueva" && <LunaNIcon style={{ width: height * 0.02, height: height * 0.02 }} />}
        {showCrecienteIcon && <LunaCIcon style={{ width: height * 0.02, height: height * 0.02 }} />}
        {faseLunar === "Luna Llena" && <LunaLIcon style={{ width: height * 0.02, height: height * 0.02 }} />}
        {showMenguanteIcon && <LunaMIcon style={{ width: height * 0.02, height: height * 0.02 }} />}
      </TouchableOpacity>

    </View>
  );
  };
  
 const planetasOrden = {
    es: [
      "Sol", "Luna", "Ascendente", "Mercurio", "Venus", "Marte", "Júpiter", "Saturno", 
      "Urano", "Neptuno", "Plutón", "Lilith", "Quirón", "Nodo Norte", "Medio Cielo" // Added Medio Cielo
    ],
    en: [
      "Sun", "Moon", "Ascendant", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", 
      "Uranus", "Neptune", "Pluto", "Lilith", "Chiron", "North Node", "Midheaven" // Added Midheaven
    ]
  };

  const currentPlanetsOrder = [
    ...planetasOrden[i18n.language].slice(0, 2),
    ...(!planetasOrden[i18n.language].includes(t("Ascendente")) ? [t("Ascendente")] : []),
    ...planetasOrden[i18n.language].slice(2)
  ];

  const viewShotRef = useRef(null);
    const captureAndShare = async () => {
      try {
        if (!viewShotRef.current) {
          console.error('viewShotRef es null');
          handleCloseModal();
          return;
        }

        const uri = await captureRef(viewShotRef.current, { format: 'jpg', quality: 1 });
        console.log('Imagen capturada en:', uri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        }

        handleCloseModal();
      } catch (error) {
        console.error('Error al capturar:', error);
        handleCloseModal();
      }
    };

  useEffect(() => {
    let timeoutId; 
    if (viewReady && resultado) {
      timeoutId = setTimeout(() => {
        captureAndShare();
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [viewReady, resultado]); 

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
      
        setLoading(true);
        
        try {
          let response;
             const fechaHora = `${userData?.birthDate}T${userData?.birthTime}`;
          if (year) {
            response = await axios.get('https://appstralbackend-production.up.railway.app/revolucion_solar', {
              params: {
                fecha: fechaHora,
                lat: latitud,
                lon: longitud,
                sistema_casas: sistemaCasas, 
                lang: i18n.language,
                year_param: year,
              },
            });
          } else {
         
            response = await axios.get('https://appstralbackend-production.up.railway.app/mi_carta', {
              params: {
                fecha: fechaHora,
                lat: latitud,
                lon: longitud,
                sistema_casas: sistemaCasas,
                lang: i18n.language,
              },
            });
          }
          
    
          setResultado(response.data);
          setAscendente(response.data.ascendente);
          setFaseLunar(response.data.fase_lunar);
          setLoading(false);
        } catch (err) {
          setError('Hubo un error al obtener las posiciones planetarias');
          setLoading(false);
        }
      };

      useEffect(() => {
        if (userData?.birthDate && userData?.birthTime && latitud && longitud) {
          fetchPlanetPositions();
        }
      }, [userData?.birthDate, userData?.birthTime, latitud, longitud, year]);
 

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

const renderItem = ({ item, index }) => {
  let signo, grado, minutos, casa, simbolo, retrogrado;
  const ascendente = resultado.casas['1'];
  const medioCielo = resultado.casas['10']; // Get Midheaven data

  if (item === t("Ascendente") && ascendente) {
    signo = ascendente.signo;
    grado = ascendente.grado;
    minutos = ascendente.minutos;
    simbolo = 'c'; // Assuming 'c' is the symbol for Ascendant
    retrogrado = false;
  } else if (item === t("Medio Cielo") && medioCielo) { // Handle Midheaven
    signo = medioCielo.signo;
    grado = medioCielo.grado;
    minutos = medioCielo.minutos;
    simbolo = 'd'; // You'll need to define a symbol for Midheaven, 'e' is just an example
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
    <TouchableOpacity >
      <View style={{ flexDirection: 'row', alignItems: 'center',gap: wp('1.75%'), marginVertical: 'auto', paddingVertical: hp('0.55%'), }}>
        <Text style={{ color: textColor, fontFamily: 'Astronomicon', fontSize: RFValue(hp('1.5%')), marginBottom: 'auto', transform: [{ translateY: hp('-.15%') }]  }}>
          {simbolo}
        </Text>
        <Text style={{ fontSize: RFValue(hp('1%')), fontFamily: 'Effra_Regular', color: textColor, paddingBottom: hp('0.5%'), borderColor: theme.primaryBorder, borderBottomWidth: hp(0.1), width: '100%' }}>
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
      
        const [tooltip, setTooltip] = useState({ visible: false, sign: '', position: { x: 0, y: 0 } });
        const [selectedSign, setSelectedSign] = useState(null); 
    
        const handlePress = (index, event) => {
          const { locationX, locationY } = event.nativeEvent;
          const signName = signosZodiacales[index];
      
          if (selectedSign === index) {
            setSelectedSign(null);
            setTooltip({ visible: false, sign: '', position: { x: 0, y: 0 } });
          } else {
            setTooltip({ visible: true, sign: signName, position: { x: locationX - 20, y: locationY + 10 } });
            setSelectedSign(index); 
          }
        };
    

const renderCirculoZodiacal = () => {
  if (!resultado) return null;
  const SVG_SIZE = width * 0.96;
  const RADIO = SVG_SIZE / 2.5;
  const CENTER = { x: SVG_SIZE / 2, y: SVG_SIZE / 2 };
  const ANGLE_PER_SIGN = 360 / 12;
  const LINE_LENGTH = RADIO + 10;
  const DISTANCIA_PLANETAS = RADIO * 0.8;
  const DISTANCIA_ANGULARES = RADIO * 0.675;
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

  const planetasYPuntos = [
    ...Object.keys(resultado.planetas),
    t("Ascendente"),
    t("Medio Cielo")
  ];

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
    "Medio Cielo": "d"
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
    "Midheaven": "d"
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

const renderizarLineasAspectos = (cuerpo1Data, index) => {
  const nombreCuerpo1 = cuerpo1Data.nombre;

  return planetasYPuntos.slice(index + 1).flatMap((otroCuerpoNombre) => {
    if (selectedPlanet) {
      if (selectedPlanet === t("Ascendente")) {
        if (nombreCuerpo1 !== t("Ascendente") && otroCuerpoNombre !== t("Ascendente")) {
          return null;
        }
      } else if (selectedPlanet === t("Medio Cielo")) {
        if (nombreCuerpo1 !== t("Medio Cielo") && otroCuerpoNombre !== t("Medio Cielo")) {
          return null;
        }
      } else {
        if (nombreCuerpo1 !== selectedPlanet && otroCuerpoNombre !== selectedPlanet) {
          return null;
        }
      }
    }

    let signo2, grado2, minutos2;
    let cuerpo2Data;

    if (otroCuerpoNombre === t("Ascendente")) {
      cuerpo2Data = resultado.casas["1"];
    } else if (otroCuerpoNombre === t("Medio Cielo")) {
      cuerpo2Data = resultado.casas["10"];
    } else {
      cuerpo2Data = resultado.planetas[otroCuerpoNombre];
    }

    if (!cuerpo2Data) return null;

    ({
      signo: signo2,
      grado: grado2,
      minutos: minutos2
    } = cuerpo2Data);

    const planetSignoIndex2 = signosZodiacales.indexOf(signo2);
    const posicion1 = calcularPosicion(cuerpo1Data.angle, DISTANCIA_ASPECTOS);
    const posicion2 = calcularPosicion(
      (-planetSignoIndex2 * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (grado2 + minutos2 / 60) * (ANGLE_PER_SIGN / 30),
      DISTANCIA_ASPECTOS
    );

    const diferenciaAngular = calcularDiferenciaAngular(cuerpo1Data.angle, posicion2.angle);

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

    const categoriaCuerpo1 = getCategoria(nombreCuerpo1);
    const categoriaOtroCuerpo = getCategoria(otroCuerpoNombre);

    const aspectosDefinidos = [{
      angulo: 0,
      tipo: 'mayor',
      color: "#d194ff",
      nombre: "Conjunción"
    }, {
      angulo: 90,
      tipo: 'mayor',
      color: "#d194ff",
      nombre: "Cuadratura"
    }, {
      angulo: 180,
      tipo: 'mayor',
      color: "#d194ff",
      nombre: "Oposición"
    }, {
      angulo: 60,
      tipo: 'menor',
      color: "#8acfff",
      nombre: "Sextil"
    }, {
      angulo: 120,
      tipo: 'mayor',
      color: "#8acfff",
      nombre: "Trígono"
    }, {
      angulo: 30,
      tipo: 'menor',
      color: "#ffe278",
      nombre: "Semisextil"
    }, {
      angulo: 150,
      tipo: 'menor',
      color: "#ffe278",
      nombre: "Quincuncio"
    }, ];


    return aspectosDefinidos.map(({
      angulo,
      color,
      tipo
    }) => {
      let orbeMaximo;
      if (tipo === 'mayor') {
        orbeMaximo = Math.max(
          userData.mayores[categoriaCuerpo1] || 0,
          userData.mayores[categoriaOtroCuerpo] || 0
        );
      } else { // tipo === 'menor'
        orbeMaximo = Math.max(
          userData.menores[categoriaCuerpo1] || 0,
          userData.menores[categoriaOtroCuerpo] || 0
        );
      }

      return Math.abs(diferenciaAngular - angulo) < orbeMaximo ? ( 
        <Line key = {
          `Line-${nombreCuerpo1}-${otroCuerpoNombre}-${angulo}`
        }
        x1 = {
          posicion1.x
        }
        y1 = {
          posicion1.y
        }
        x2 = {
          posicion2.x
        }
        y2 = {
          posicion2.y
        }
        stroke = {
          color
        }
        strokeWidth = "1.25"
        />
      ) : null
    }).filter(Boolean);
  });
};

  const calcularPosicionAjustada = (cuerpoNombre, index, ASCENDENTROTATION, todosLosCuerpos) => {
    const UMBRAL_ANGULO = 7;

    const getAnguloDeCuerpo = (nombre) => {
      if (nombre === t("Ascendente")) {
        const { signo, grado, minutos } = resultado.casas["1"];
        const signoIndex = signosZodiacales.indexOf(signo);
        return (-signoIndex * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (grado + minutos / 60) * (ANGLE_PER_SIGN / 30);
      } else if (nombre === t("Medio Cielo")) {
        const { signo, grado, minutos } = resultado.casas["10"];
        const signoIndex = signosZodiacales.indexOf(signo);
        return (-signoIndex * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (grado + minutos / 60) * (ANGLE_PER_SIGN / 30);
      } else {
        const { signo, grado, minutos } = resultado.planetas[nombre];
        const signoIndex = signosZodiacales.indexOf(signo);
        return (-signoIndex * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION - (grado + minutos / 60) * (ANGLE_PER_SIGN / 30);
      }
    };

    const anguloActual = getAnguloDeCuerpo(cuerpoNombre); // Obtener el ángulo del cuerpo actual

    // --- Lógica para Ascendente y Medio Cielo (distancia fija) ---
    if (cuerpoNombre === t("Ascendente") || cuerpoNombre === t("Medio Cielo")) {
      return calcularPosicion(anguloActual, DISTANCIA_ANGULARES);
    }

    // --- Lógica existente para planetas (distancia ajustada por agrupamiento) ---
    const angulosDeTodosLosCuerpos = todosLosCuerpos.map(p => getAnguloDeCuerpo(p));

    let grupoIndices = [];
    for (let i = 0; i < todosLosCuerpos.length; i++) {
      // Excluir Ascendente y Medio Cielo del agrupamiento de planetas
      if (todosLosCuerpos[i] !== t("Ascendente") && todosLosCuerpos[i] !== t("Medio Cielo") &&
          calcularDiferenciaAngular(anguloActual, angulosDeTodosLosCuerpos[i]) < UMBRAL_ANGULO) {
        grupoIndices.push(i);
      }
    }

    // Asegurarse de que el cuerpo actual (si es un planeta) esté en su propio grupo si no se agrupa con otros planetas
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
      distancia = DISTANCIA_PLANETAS;
    } else {
      const paso = DISTANCIA_EXTRA_TOTAL / (cantidadEnGrupo - 1);
      const offset = -DISTANCIA_EXTRA_TOTAL * (1 / 4) + paso * posicionEnGrupo;
      distancia = DISTANCIA_PLANETAS + offset;
    }

    return calcularPosicion(anguloActual, distancia);
  };

          return (
                        <View style={styles(theme).shareChartResultCircle}>
            
              <Svg width={SVG_SIZE} height={SVG_SIZE}>
          
                <Circle cx={CENTER.x} cy={CENTER.y} r={RADIO} stroke={theme.tertiary} strokeWidth="2" fill="none" />
              
                {signosSimbolos.map((signo, index) => {
                  const angle = (-index * ANGLE_PER_SIGN - 180) - ASCENDENTROTATION;
                  const textPos = calcularPosicion(angle - ANGLE_PER_SIGN / 2, DISTANCIA_SIGNOS);
                  const linePos = calcularPosicion(angle, LINE_LENGTH);
                  const fillColor = selectedSign === index ? theme.tertiary : theme.tertiary;
    
                  return (
                    <G key={signo}>
                      <Line x1={CENTER.x} y1={CENTER.y} x2={linePos.x} y2={linePos.y} stroke={theme.background} strokeWidth="5" />
                      <SvgText onPressOut={(event) => handlePress(index, event)} x={textPos.x} y={textPos.y} fontSize={height*0.03} textAnchor="start" alignmentBaseline="middle" fontFamily="Astronomicon" fill={fillColor} transform={`rotate(${angle + 75}, ${textPos.x}, ${textPos.y})`}>
                        {signo}
                      </SvgText>
                    </G>
                  );
                })}
        <Defs>
          {/* Nuevo Marcador de flecha INVERTIDO para 'markerStart' (para el MC/IC) */}
          <Marker id="arrow" viewBox="0 0 10 10" refX="0" refY="5" orient="auto" markerWidth="25" markerHeight="25">
            {/* El Path ahora apunta a la izquierda */}
            <Path d="M8,0 L0,5 L8,10 z" fill={selectedPlanet === t("Medio Cielo") ? theme.focusedItem : theme.tertiary} />
          </Marker>
        </Defs>

    <Defs>
          <Marker id="arrowAC" viewBox="0 0 10 10" refX="7" refY="5" orient="auto" markerWidth="15" markerHeight="15">
            <Path d="M0,0 L8,5 L0,10 z" fill={selectedPlanet === t("Ascendente") ? theme.focusedItem : theme.tertiary} />
          </Marker>
        </Defs>
        <Line markerEnd="url(#arrowAC)" x1={CENTER.x + RADIO} y1={CENTER.y} x2={CENTER.x - RADIO} y2={CENTER.y} stroke={selectedPlanet === t("Ascendente") ? theme.focusedItem : theme.tertiary} strokeWidth="1.5" />

        {distanciasCasas.map((angleCasa, index) => {
          // Identificamos si esta es la línea del eje IC/MC (Casa 4 / Casa 10)
          // `resultado.distancia_ascendente_casa4` se encuentra en el índice 2 de `distanciasCasas`
          const isICMCLine = index === 2; // Índice 2 porque es el 3er elemento en un array de 0-index

          const lineColor = (selectedPlanet === t("Medio Cielo") && isICMCLine)
            ? theme.focusedItem // Color si MC está seleccionado y es la línea correcta
            : theme.tertiary; // Color por defecto

          const strokeWidth = (selectedPlanet === t("Medio Cielo") && isICMCLine)
            ? "1.5" // Grosor si MC está seleccionado
            : ".75"; // Grosor por defecto

          return (
            <Line
              key={index}
              x1={CENTER.x + RADIO * Math.cos(angleCasa * (Math.PI / 180))}
              y1={CENTER.y + RADIO * Math.sin(angleCasa * (Math.PI / 180))}
              x2={CENTER.x + RADIO * Math.cos((angleCasa + 180) * (Math.PI / 180))}
              y2={CENTER.y + RADIO * Math.sin((angleCasa + 180) * (Math.PI / 180))}
              stroke={lineColor}
              strokeWidth={.75}
              markerStart={isICMCLine ? "url(#arrow)" : ""} // Aplica la flecha solo a esta línea
            />
          );
        })}
    
    
    
        
        
                <View >
                      <Circle cx={CENTER.x} cy={CENTER.y} r={DISTANCIA_ASPECTOS} stroke={theme.tertiary} fill="none" strokeWidth="1.5" />

                  <Svg width="400" height="400">
    
                                {planetasYPuntos.map((cuerpo, index) => {
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
                    
                                  const posicion = calcularPosicionAjustada(cuerpo, index, ASCENDENTROTATION, planetasYPuntos);
                                  const isSelected = cuerpo === selectedPlanet; // Esta variable ya te indica si está seleccionado
                                  const cuerpoColor = isSelected ? theme.focusedItem : theme.tertiary;
                    
                                  // Determina si el cuerpo actual es Ascendente o Medio Cielo
                                  const esAscendenteOMedioCielo = (cuerpo === t("Ascendente") || cuerpo === t("Medio Cielo"));
                    
                                  // --- MODIFICACIÓN CLAVE AQUÍ ---
                                  const circleFillColor = esAscendenteOMedioCielo
                                    ? (isSelected ? theme.focusedItem : theme.tertiary) // Si es Asc/MC, cambia a focusedItem si está seleccionado, sino terciario
                                    : 'none'; // Para planetas, sigue siendo sin relleno
                    
                                  const symbolTextColor = esAscendenteOMedioCielo
                                    ? theme.background // El texto blanco dentro del círculo
                                    : (isSelected ? theme.focusedItem : theme.tertiary); // El color del texto del planeta
                    
                                  const symbolFontSize = esAscendenteOMedioCielo ? RFValue(10) : RFValue(15);
                    
                                  return (
                                    <G key={cuerpo}>
                                      {renderizarLineasAspectos({ nombre: cuerpo, angle: posicion.angle }, index)}
                    
                                      {/* Agrega el Círculo para el Ascendente y Medio Cielo */}
                                      {esAscendenteOMedioCielo && (
                                        <Circle
                                          cx={posicion.x}
                                          cy={posicion.y}
                                          r={RFValue(5.25)} // Tamaño del círculo (ajusta si es necesario)
                                          fill={circleFillColor} // Usamos el color de relleno condicional
                                          // No necesitamos stroke para el círculo si el fill ya es un color sólido
                                        />
                                      )}
                    
                                      {esAscendenteOMedioCielo ? (
                                        <SvgText
                                          x={posicion.x + .5}
                                          y={posicion.y - .5}
                                          fontSize={symbolFontSize}
                                          textAnchor="middle"
                                          alignmentBaseline="middle"
                                          fill={symbolTextColor}
                                          fontFamily="Astronomicon"
                                        >
                                          {simbolosPlanetas[cuerpo]}
                                        </SvgText>) : (
                    
                                        <SvgText
                                          x={posicion.x}
                                          y={posicion.y}
                                          fontSize={symbolFontSize}
                                          textAnchor="middle"
                                          alignmentBaseline="middle"
                                          fill={symbolTextColor}
                                          fontFamily="Astronomicon"
                                        >
                                          {simbolosPlanetas[cuerpo]}
                                        </SvgText>
                                      )}
                    
                                      {cuerpo !== "Nodo Norte" && cuerpo !== "North Node" && (
                                        <>
                                          {isEstacionario && !isRetrogrado && (
                                            <SvgText
                                              x={posicion.x + 3}
                                              y={posicion.y + 10}
                                              fontSize={height * 0.008}
                                              textAnchor="start"
                                              alignmentBaseline="middle"
                                              fill={cuerpoColor}
                                              fontFamily="Effra_Regular"
                                            >
                                              st
                                            </SvgText>
                                          )}
                                          {isRetrogrado && !isEstacionario && (
                                            <SvgText
                                              x={posicion.x + 3}
                                              y={posicion.y + 10}
                                              fontSize={height * 0.008}
                                              textAnchor="start"
                                              alignmentBaseline="middle"
                                              fill={cuerpoColor}
                                              fontFamily="Effra_SemiBold"
                                            >
                                              Rx
                                            </SvgText>
                                          )}
                                          {isRetrogrado && isEstacionario && (
                                            <SvgText
                                              x={posicion.x + 3}
                                              y={posicion.y + 10}
                                              fontSize={height * 0.008}
                                              textAnchor="start"
                                              alignmentBaseline="middle"
                                              fill={cuerpoColor}
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
    r={width*0.015}
    fill={theme.tertiary} 
  />
  <G>
    <SvgText  
      x={pos.x} 
      y={pos.y} 
      fontFamily="Effra_Medium" 
      fontSize={height*0.01}
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
                  </Svg></View>

              </Svg>
              {tooltip.visible && (
              <View style={{
                position: 'absolute',
                top: tooltip.position.y,
                left: tooltip.position.x,
                backgroundColor: theme.secondary,
                padding: 5,
                paddingBottom: 3,
                paddingHorizontal: 7,
                borderRadius: 5,
                elevation: 5,
              }}>
                <Text style={{color: theme.background,fontFamily: 'Effra_Regular', fontSize: 12}}>{tooltip.sign}</Text>
              </View>
            )}
            </View>
    
              
          );
};
        
  if (error) {
    return <Text>{error}</Text>;
  }

  const birthDateTime = new Date(`${userData.birthDate}T${userData.birthTime}:00`);


  return (

<Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      statusBarTranslucent={true}
      onRequestClose={handleCloseModal}
    >
<View style={styles(theme).modalShareContainer}>
        <View style={styles(theme).modalShareContent}>
        <View style={styles(theme).roundedShareContainer}>
   <ViewShot ref={viewShotRef} style={styles(theme).shareChartDetailsContainer} captureMode="mount">
            {year ? (
            <View style={styles(theme).shareChartDetailsHeader}>
              <View style={styles(theme).shareChartTitle}>
                <Text style={styles(theme).shareChartTitleText}>Revolución Solar {year}</Text>
              </View>
              <View style={styles(theme).shareChartInfo}>
                <Text style={styles(theme).shareChartInfoText}>{formattedDate}</Text>
                <View style={styles(theme).shareChartInfoSeparator} />
                <Text style={styles(theme).shareChartInfoTime}>{formattedTime}</Text>
                <View style={styles(theme).shareChartInfoSeparator} />
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles(theme).shareChartInfoText}>{userData?.birthCity}</Text>
              </View>
            </View>):(
            <View style={styles(theme).shareChartDetailsHeader}>
              <View style={styles(theme).shareChartTitle}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles(theme).shareChartTitleText}>{userData?.name} {userData?.lastName}</Text>{faseLunar && renderLunarIcon()}
              </View>
              <View style={styles(theme).shareChartInfo}>
                <Text style={styles(theme).shareChartInfoText}>
                {i18n.language === 'es' 
      ? birthDateTime.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        }).replace(/\//g, '/')
      : userData.birthDate.replace(/-/g, '/') 
    }
                </Text>
                <View style={styles(theme).shareChartInfoSeparator} />
                <Text style={styles(theme).shareChartInfoTime}>{userData?.birthTime}</Text>
                <View style={styles(theme).shareChartInfoSeparator} />
                <Text numberOfLines={1} ellipsizeMode="tail"  style={styles(theme).shareChartInfoText}>{userData?.birthCity}</Text>
              </View>
            </View>)}
                 <View style={styles(theme).shareChartResultCircle} onLayout={() => setViewReady(true)}>{renderCirculoZodiacal()}</View>
   
            {resultado && (
              <FlatList
                data={currentPlanetsOrder}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                style={styles(theme).shareChartResultFlatList}
                scrollEnabled={false}
                contentContainerStyle={styles(theme).shareChartResultList}
              />
            )}
            <View style={styles(theme).ScreenshotFooter}>
              <CheckIcon style={styles(theme).ScreenshotFooterIcon} />
              <Text style={styles(theme).ScreenshotFooterText}>{t("ShareFooter")}</Text>
            </View>
          </ViewShot>
        </View></View></View>
      </Modal>
     
  );
};

const styles = (theme) => StyleSheet.create({
  modalShareContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: wp('10%'), // Example: 10% of screen width
    justifyContent: 'center',
  },
  modalShareContent: {
    justifyContent: 'center',
  },
  shareChartResultList: {
    paddingLeft: wp('15%'), // Example: 15% of screen width
  },
  chartResultSeparator:{
    height: hp('.07%'), // Example: .6 of screen height
    marginLeft: wp('4%'), // Example: 15 units converted to 4% of screen width
    backgroundColor: theme.secondary,
  },
  roundedShareContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    width: viewShotWidth, // Already responsive
    minHeight: viewShotHeight, // Already responsive
    alignSelf: 'center',
    backgroundColor: theme.background,
    transform: [{scale:.85}], // Scale can remain static if you prefer
  },
  scrollableChartContainer:{
  marginLeft: wp('5%') // Example: 20 units converted to 5% of screen width
  },
  shareChartInfoSeparator:{
    height: hp('2.5%'), // Example: 20 units converted to 2.5% of screen height
    width: wp('0.5%'), // Example: 2 units converted to 0.5% of screen width
    backgroundColor: theme.primaryBorder,
  },
  chartText: {
    fontSize: RFValue(17), // Use RFValue for font size
    fontFamily: 'Effra_Regular',
    color: theme.secondaryBorder
  },
  shareChartResultCircle:{
    alignSelf: 'center',
  },
  ScreenshotFooter:{
    margin: 'auto',
    flexDirection: 'row',
    gap: wp('1.2%'), // Example: 5 units converted to 1.2% of screen width
    marginVertical: hp('0.6%') // Example: 5 units converted to 0.6% of screen height
  },
  ScreenshotFooterText:{
    margin: 'auto',
    textAlign: 'center',
    fontFamily: 'Effra_Regular',
    color: theme.secondaryBorder,
    fontSize: RFValue(viewShotHeight*0.01), // Use RFValue with a responsive base
    height: RFValue(viewShotHeight*0.0155) // Use RFValue with a responsive base
  },
  ScreenshotFooterIcon:{
    width: wp('3.5%'), // Example: Scale based on percentage width
    margin: 'auto',
    height: hp('2.5%') // Example: Scale based on percentage height
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: wp('2.5%'), // Example: 10 units converted to 2.5% of screen width
  },
  shareChartDetailsContainer: {
    width: viewShotWidth, // Already responsive
    minHeight: viewShotHeight, // Already responsive
    alignSelf: 'center',
    backgroundColor: theme.background,
    paddingVertical: hp('0.6%') // Example: 5 units converted to 0.6% of screen height
  },
  shareChartDetailsHeader:{
    marginHorizontal: 'auto',
  },
  shareChartTitle:{
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: wp('80%'), // Example: 80% of screen width
    marginHorizontal: 'auto',
    gap: wp('1.5%'), // Example: 6 units converted to 1.5% of screen width
    justifyContent: 'space-around'
  },
  shareChartTitleText:{
    fontSize: RFValue(height*0.020), // Use RFValue with a responsive base
    color: theme.black,
    fontFamily: 'Effra_Regular',
    marginVertical: hp('0.25%'), // Example: 2 units converted to 0.25% of screen height
    marginTop: hp('1.2%'), // Example: 10 units converted to 1.2% of screen height
  },
  shareChartInfo:{
    margin: 'auto',
    width: wp('90%'), // Example: 90% of screen width
    paddingTop: hp('0.6%'), // Example: 5 units converted to 0.6% of screen height
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    },
    shareChartInfoText:{
      minWidth: wp('20%'), // Example: 20% of screen width
      maxWidth: wp('45%'), // Example: 40% of screen width
      textAlign: 'center',
      fontSize: RFValue(13), // Use RFValue with a responsive base
      fontFamily: 'Effra_Regular',
      color: theme.secondary,
      },
      shareChartInfoTime:{
        maxWidth: wp('25%'), // Example: 25% of screen width
        textAlign: 'center',
        fontSize: RFValue(13), // Use RFValue with a responsive base
        fontFamily: 'Effra_Regular',
        color: theme.secondary,
        },
  });
export default ShareMyChartModal;
