import React, { useState, useEffect, useRef, useMemo, useCallback, useContext } from 'react';
import { View, Text,TextInput, ActivityIndicator, Alert, Dimensions, FlatList,Modal, StyleSheet,Easing, Animated, PanResponder, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Svg, { Circle, Line, G, Image, Text as SvgText, Polygon,Path, Defs, Marker } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { useCasa } from '../contexts/CasaContext';
import cities from '../data/cities.json'; 
import {auth, getFirestore, doc, db, getDoc, updateDoc } from '../config/firebaseConfig';
import ViewShot from 'react-native-view-shot';
import LunaLIcon from "../../assets/icons/LunaLIcon";
import LunaMIcon from "../../assets/icons/LunaMIcon";
import LunaCIcon from "../../assets/icons/LunaCIcon";
import LunaNIcon from "../../assets/icons/LunaNIcon";
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { RFValue } from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const { height, width } = Dimensions.get('window'); // You might still need this for initial calculations or if you prefer to mix and match
const viewShotWidth = wp('100%'); // Use wp for full width
const viewShotHeight = (viewShotWidth * 5) / 2.4;

import CheckIcon from "../../assets/icons/CheckIcon"
import { useToast } from "../contexts/ToastContext";
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

const ShareChartModal = ({ route, visible, handleCloseShareModal, year, formattedDate, formattedTime, selectedPlanet }) => {
  const { cartaId } = route.params || {}; 
   const {userData} = useUser();
  
  const { theme } = useContext(ThemeContext);
  const [cartaData, setCartaData] = useState(null);
  const { showToast } = useToast();
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
   const { t, i18n  } = useTranslation();
   const [viewReady, setViewReady] = useState(false);
   const [faseLunar, setFaseLunar] = useState(null);
 
     
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
 
     const obtenerCoordenadasCiudad = () => {
       if (!cartaData.ciudad) return;
     
       const ciudadBuscada = cartaData.ciudad.trim();
     
       for (const pais in cities) {
         const ciudad = cities[pais].find((city) => {
           const nombreCiudad = city.label.trim(); 
           return nombreCiudad === ciudadBuscada;
         });
     
         if (ciudad) {
           const { lat, lng } = ciudad;
           setLatitud(lat);
           setLongitud(lng);
           setErrorCiudad('');
           return; 
         }
       }
       setErrorCiudad('No se encontraron coordenadas para esta ciudad.');
       setLatitud(null);
       setLongitud(null);
     };
     
     useEffect(() => {
       if (cartaData && cartaData.ciudad) {
         obtenerCoordenadasCiudad();
       }
     }, [cartaData]);
     
   const [fontsLoaded] = useFonts({
     'Astronomicon': require('../../assets/fonts/Astronomicon.ttf'), 
   });
 
   const fetchPlanetPositions = async () => {
    if (!latitud || !longitud) {
      setError('Las coordenadas no están disponibles.');
      setLoading(false);
      return;
    }
  
    setLoading(true);
    
    try {
      let response;
         const fechaHora = `${cartaData?.fecha}T${cartaData?.hora}`;
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
  const getOrdinal = (number) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const remainder = number % 100;
    return number + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
  };
  const casaOrdinal = (i18n.language === 'en' && casa) ? getOrdinal(casa) : casa;

  return (
    <View >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 'auto',
        // Use hp for vertical padding
        paddingVertical: hp('0.55%'), // Equivalent to viewShotHeight * 0.0055
        // Use wp for gap
        gap: wp('1.75%') // Equivalent to 7 units, adjusted for responsiveness
      }}>
        <Text style={{
          color: theme.primary,
          fontFamily: 'Astronomicon',
          // Use RFValue for font size
          fontSize: RFValue(hp('1.5%')), // Equivalent to viewShotHeight * 0.015
          // Use hp for translateY transformation
          transform: [{ translateY: -hp('0.175%') }] // Equivalent to -viewShotHeight * 0.00175
        }}>
          {simbolo}
        </Text>
        <Text style={{
          // Use RFValue for font size
          fontSize: RFValue(hp('1%')), // Equivalent to viewShotHeight * 0.012
          fontFamily: 'Effra_Regular',
          color: theme.primary,
          borderColor: theme.primaryBorder,
          // Use hp for borderBottomWidth
          borderBottomWidth: hp('0.035%'), // Equivalent to viewShotHeight * 0.00035
          width: '100%' // Keep '100%' for full width within the container
        }}>
          {item === t("Ascendente")
            ? (i18n.language === 'en'
              ? `Ascendant in ${signo} at ${gradoDisplay}° ${minutosDisplay}'`
              : `Ascendente en ${signo} a ${gradoDisplay}° ${minutosDisplay}'`)
            : t('planet_house_position', { planet: item, sign: signo, degree: grado, casa: casaOrdinal, minutes: minutos, retro: retrogrado ? ' Rx' : '' })}
        </Text>
      </View>
    </View>
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
        
          const SVG_SIZE = width * 0.9;
          const RADIO = SVG_SIZE / 2.5;
          const CENTER = { x: SVG_SIZE / 2, y: SVG_SIZE / 2 };
          const ANGLE_PER_SIGN = 360 / 12;
          const LINE_LENGTH = RADIO + 10;
          const DISTANCIA_PLANETAS = RADIO * 0.8;
          const DISTANCIA_ASPECTOS = RADIO * 0.68;
          const DISTANCIA_SIGNOS = RADIO + 17;
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
            const offset = -DISTANCIA_EXTRA_TOTAL * (1 / 3) + paso * posicionEnGrupo;
        
            distancia = DISTANCIA_BASE + offset;
          }
        
          return calcularPosicion(anguloActual, distancia);
        };

          return (
                        <View style={styles(theme).shareChartResultCircle}>
            
              <Svg width={SVG_SIZE} height={SVG_SIZE}>
                
                <Defs>
      <Marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" orient="auto" markerWidth="10" markerHeight="10">
        <Path d="M0,0 L8,5 L0,10 z" fill={theme.secondary} />
      </Marker>
    </Defs>
    
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
    <Line  markerEnd="url(#arrow)"  x1={CENTER.x + RADIO} y1={CENTER.y} x2={CENTER.x - RADIO} y2={CENTER.y} stroke={theme.secondary} strokeWidth="1.5" />
    
    {distanciasCasas.map((angleCasa, index) => (
      <Line key={index}
        x1={CENTER.x + RADIO * Math.cos(angleCasa * (Math.PI / 180))}
        y1={CENTER.y + RADIO * Math.sin(angleCasa * (Math.PI / 180))}
        x2={CENTER.x + RADIO * Math.cos((angleCasa + 180) * (Math.PI / 180))}
        y2={CENTER.y + RADIO * Math.sin((angleCasa + 180) * (Math.PI / 180))}
        stroke={theme.secondary} strokeWidth=".75"
      />
    ))}
    
    
    
        
        
                <View >
    
                  <Svg width="400" height="400">
    
                    
                    {planetas.map((planeta, index) => {
                      const { signo, grado, minutos, retrógrado,estacionario } = resultado.planetas[planeta];
                  const planetSignoIndex = signosZodiacales.indexOf(signo);
                  const posicion = calcularPosicionAjustada(planetas, index, ASCENDENTROTATION);
              const isSelected = planeta === selectedPlanet;
              const planetaColor = isSelected ? theme.focusedItem : theme.secondary; 
                      
                      return (
                        <G key={planeta}>
                          
                          {renderizarLineasAspectos({ nombre: planeta, angle: posicion.angle }, index)} 

                          <SvgText x={posicion.x} y={posicion.y} fontSize={viewShotHeight*.023} fill={planetaColor} textAnchor="start" alignmentBaseline="middle" fontFamily="Astronomicon">
                            {simbolosPlanetas[planeta]}
                          </SvgText>
                          {planeta !== "Nodo Norte" && planeta !== "North Node" && (
                           <>
                             {estacionario && !retrógrado && (
                               <SvgText
                                 x={posicion.x + 7.5}
                                 y={posicion.y + 10}
                                 fontSize="5"
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
                                 fontSize="5"
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
                                 fontSize="5"
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
    r={width*0.015}
    fill={theme.secondary} 
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
                  <Circle cx={CENTER.x} cy={CENTER.y} r={DISTANCIA_ASPECTOS} stroke={theme.tertiary} fill="none" strokeWidth="1.5" />

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
        
 const viewShotRef = useRef(null);
 const captureAndShare = async () => {
   try {
     if (!viewShotRef.current) {
       console.error('viewShotRef es null');
       handleCloseShareModal();
       return;
     }

     const uri = await captureRef(viewShotRef.current, { format: 'jpg', quality: 1 });
     console.log('Imagen capturada en:', uri);

     if (await Sharing.isAvailableAsync()) {
       await Sharing.shareAsync(uri);
     }

     handleCloseShareModal();
   } catch (error) {
     console.error('Error al capturar:', error);
     handleCloseShareModal();
   }
 };

 useEffect(() => {
   if (visible) {
     setViewReady(false);
   }
 }, [visible]);
 
  useEffect(() => {
    let timeoutId; // Variable para almacenar el ID del timeout

    if (viewReady && resultado) {
      // Establece un timeout de 2000 milisegundos (2 segundos)
      timeoutId = setTimeout(() => {
        captureAndShare();
      }, 2000);
    }

    // Función de limpieza para cancelar el timeout si los estados cambian
    // antes de que pasen los 2 segundos, evitando llamadas no deseadas.
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [viewReady, resultado]); 

      if (loading) {
        return null;
      }
    
 
         
        const birthDateTime = new Date(`${fecha}T${hora}:00`);
        
        
        return (
          <Modal
                animationType="fade"
                transparent={true}
                statusBarTranslucent={true}
                visible={visible}
                onRequestClose={handleCloseShareModal}
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
                               <Text numberOfLines={1} ellipsizeMode="tail"  style={styles(theme).shareChartInfoText}>{cartaData?.ciudad}</Text>
                            </View>
                          </View>):(
                           <View style={styles(theme).shareChartDetailsHeader}>
                                      <View style={styles(theme).shareChartTitle}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles(theme).shareChartTitleText}>{cartaData?.nombre} {cartaData?.apellido}</Text>{faseLunar && renderLunarIcon()}
                                      </View>
                                      <View style={styles(theme).shareChartInfo}>
                                        <Text style={styles(theme).shareChartInfoText}>
                                        {i18n.language === 'es' 
                              ? birthDateTime.toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                }).replace(/\//g, '/')
                              : cartaData.fecha.replace(/-/g, '/') 
                            }
                                        </Text>
                                        <View style={styles(theme).shareChartInfoSeparator} />
                                        <Text style={styles(theme).shareChartInfoTime}>{cartaData?.hora}</Text>
                                        <View style={styles(theme).shareChartInfoSeparator} />
                                        <Text numberOfLines={1} ellipsizeMode="tail"  style={styles(theme).shareChartInfoText}>{cartaData?.ciudad}</Text>
                                      </View>
                                    </View>)}
              <View style={styles(theme).shareChartResultCircle} onLayout={() => setViewReady(true)}>{renderCirculoZodiacal()}</View>
  
                 {resultado && (
                     <FlatList
                    data={currentPlanetsOrder}
                     renderItem={renderItem}
                     keyExtractor={(item) => item}
                     style={styles(theme).shareChartResultFlatList}
                     contentContainerStyle={styles(theme).shareChartResultList}
                  
                   />
                  )}<View style={styles(theme).ScreenshotFooter}>
                  <CheckIcon style={styles(theme).ScreenshotFooterIcon} />
                  <Text style={styles(theme).ScreenshotFooterText}>{t("ShareFooter")}</Text>
                </View>
                      </ViewShot>
                      </View>
                      </View></View></Modal>
               
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
    marginBottom: hp('0.6%') // Example: 5 units converted to 0.6% of screen height
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
  
export default ShareChartModal;
