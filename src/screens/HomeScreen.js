import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, StatusBar, ActivityIndicator, Text, FlatList, TextInput, Animated,Dimensions, Easing,StyleSheet, Alert, TouchableOpacity, ScrollView, PixelRatio } from 'react-native';
import { Button } from 'react-native-elements';
import axios from 'axios';
import { useFonts } from 'expo-font';
import Svg, { Circle, Line, G, Image, Text as SvgText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import colors from '../utils/colors';
import ResetIcon from '../../assets/icons/ResetIcon'
import BellIcon from '../../assets/icons/BellIcon'
import SkyStars from '../../assets/icons/SkyStars'
import { useUser } from '../contexts/UserContext';
const { height, width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import { lightTheme, darkTheme } from '../utils/theme';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';
import { useNotifications } from '../contexts/NotificationContext';


const ShootingStar = () => {
  const starX = useRef(new Animated.Value(-100)).current;
  const starY = useRef(new Animated.Value(0)).current;
  const starOpacity = useRef(new Animated.Value(1)).current;
  
  const starX2 = useRef(new Animated.Value(width + 100)).current;
  const starY2 = useRef(new Animated.Value(0)).current;
  const starOpacity2 = useRef(new Animated.Value(1)).current;

  const isFirstStar = useRef(true); 

  useEffect(() => {
    const startAnimation = () => {
      if (isFirstStar.current) {
        starX.setValue(-100);
        starY.setValue(0);
        starOpacity.setValue(1);

        Animated.parallel([
          Animated.timing(starX, {
            toValue: width + 100,
            duration: 700,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(starY, {
            toValue: 50,
            duration: 700,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(starOpacity, {
            toValue: 0,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        starX2.setValue(width + 100);
        starY2.setValue(0);
        starOpacity2.setValue(1);

        Animated.parallel([
          Animated.timing(starX2, {
            toValue: -100,
            duration: 650,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(starY2, {
            toValue: 150,
            duration: 650,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(starOpacity2, {
            toValue: 0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start();
      }
      isFirstStar.current = !isFirstStar.current;
    };

    const interval = setInterval(startAnimation, 60000);

    return () => clearInterval(interval);
  }, [starX, starY, starOpacity, starX2, starY2, starOpacity2]);

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          top: height * 0.02,
          left: 0,
          width: 75,
          height: height * 0.001,
          backgroundColor: "white",
          opacity: starOpacity,
          transform: [{ translateX: starX }, { translateY: starY }, { rotate: "4deg" }],
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          top: height * 0.01,
          left: 0,
          width: 75,
          height: height * 0.0007,
          backgroundColor: "white",
          opacity: starOpacity2,
          transform: [{ translateX: starX2 }, { translateY: starY2 }, { rotate: "-15deg" }],
        }}
      />
    </>
  );
};


const HomeScreen = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const {userData} = useUser();
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState(null);
  const initialDate = new Date();
  const [fecha, setFecha] = useState(initialDate);
  const [modo, setModo] = useState('dia'); 
  const [rotateValue] = useState(new Animated.Value(0));
  const AnimatedSvg = Animated.createAnimatedComponent(Svg);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedLine = Animated.createAnimatedComponent(Line);
  const AnimatedText = Animated.createAnimatedComponent(SvgText);
  const { t, i18n  } = useTranslation();
  const navigation = useNavigation(); 
  const { hasNewNotificationsToday, setHasNewNotificationsToday } = useNotifications(); // Usa el contexto de notificaciones

  // La lógica para determinar si hay notificaciones nuevas *hoy* al inicio de la app
  // podría vivirse aquí o en el NotificationContext. Lo más robusto es que
  // NotificationsScreen "informe" al contexto si hay notificaciones de hoy.
  // Sin embargo, para que el punto aparezca al cargar la app si hay notificaciones sin ver,
  // la lógica de `setHasNewNotificationsToday(true)` debe ocurrir *antes* de que el usuario
  // entre a `NotificationsScreen`. Podrías poner una verificación en `App.js` o en el propio `NotificationContext`
  // al inicio para chequear `AsyncStorage` y ver si hay notificaciones de hoy no vistas.

  // Una manera de hacer que el punto rojo aparezca si hay notificaciones hoy y no se han visto:
  // En `NotificationContext`, cuando se carga la app (`loadNotificationStatus`),
  // si `lastViewedDate` es anterior a hoy, `setHasNewNotificationsToday(true)`.
  // Y luego, cuando `NotificationsScreen` se abre, `markNotificationsAsViewed()` se encarga de ponerlo a `false`.

  // O podrías hacer una verificación ligera aquí en HomeScreen al montarse:
  useEffect(() => {
    const checkInitialNotifications = async () => {
      // Esta es una verificación simplificada para el ejemplo.
      // Idealmente, esto se manejaría de forma más robusta con las notificaciones push
      // y su estado de "leído/no leído" en el backend o en el dispositivo.
      // Para este ejemplo, si la última vez que se vieron notificaciones fue ayer o antes,
      // y hay eventos programados para hoy, entonces mostramos el punto.
      
      // Dado que NotificationsScreen ya tiene la lógica de `fetchAndFilterEvents`,
      // la forma más sencilla es que el NotificationsScreen actualice el contexto
      // cuando encuentra notificaciones de 'today' que no han sido vistas.

      // Sin embargo, para que el *punto rojo aparezca al inicio*,
      // necesitamos que NotificationContext sepa si hay notificaciones nuevas hoy.
      // El `loadNotificationStatus` en `NotificationContext.js` ya lo maneja parcialmente.
      // La clave es que `NotificationsScreen` debe tener la responsabilidad de marcar como visto.

      // Si el punto no aparece al inicio, revisa la lógica en NotificationContext.js:
      // en `loadNotificationStatus`, si `lastViewedDate` es diferente a `todayDate`,
      // podrías asumir que hay notificaciones nuevas hasta que el usuario visite la pantalla.
      // Esto es una suposición, en un sistema real, una API te diría si hay notificaciones no leídas.
    };
    checkInitialNotifications();
  }, []);

  const formattedDate = fecha.toLocaleDateString(i18n.language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const [fontsLoaded] = useFonts({
    'Astronomicon': require('../../assets/fonts/Astronomicon.ttf'),
  });

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

  const currentPlanetsOrder = planetasOrden[i18n.language] || planetasOrden.es;

   const scaleAnim = useRef(new Animated.Value(0.25)).current;
   const rotateAnim = useRef(new Animated.Value(0)).current;
   const rotatePlanetasAnim = useRef(new Animated.Value(0)).current;
   const opacityAnim = useRef(new Animated.Value(0)).current;
   const opacityAnimLine = useRef(new Animated.Value(0)).current;
   const fadeAnims = useRef(currentPlanetsOrder.map(() => new Animated.Value(0))).current;
 
  useEffect(() => {
    if (!loading && resultado) {
      const randomDelay = Math.random() * (2000 - 200) + 1250;

      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
  
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 5000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
  
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
  
      Animated.timing(rotatePlanetasAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
  Animated.timing(opacityAnimLine, {
    toValue: 1,
    duration: 750,
    delay: randomDelay,
    useNativeDriver: false,
  }).start();

    }
  }, [loading, resultado]);

  useEffect(() => {
    const fetchPosiciones = async () => {
      setLoading(true); 
  
      try {
        const response = await axios.get(
          `https://appstralbackend-production.up.railway.app/astros_hoy?fecha=${fecha.toISOString()}&lang=${i18n.language}`
        );
        setResultado(response.data);
      } catch (error) {
        console.error("Error al obtener posiciones:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosiciones();
  }, [fecha, i18n.language]);
  

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
    setFecha(new Date(fecha[`set${unit}`](fecha[`get${unit}`]() + (operation === 'sumar' ? increment : decrement))));
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

  const resetFecha = () => {
    setFecha(initialDate);
    rotateValue.setValue(0);
    Animated.timing(rotateValue, {
      toValue: 1, 
      duration: 2500, 
      useNativeDriver: true,
    }).start(); 
  };

  const interpolatedRotateAnimation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-1440deg'],
  });

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
    const timeoutRef = useRef(null);
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const renderItem = ({ item, index }) => {
      const { signo, grado, minutos, retrógrado: retrogrado, estacionario } = resultado.planetas[item] || {};
      if (!signo || grado === undefined || minutos === undefined) {
        return (
      <View key={item} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp('0.7%') }}> // Usamos hp para el margen inferior
            <Text>{item} no tiene datos completos.</Text>
          </View>
        );
      }
      const isSelected = selectedPlanet === item; 
      const textColor = isSelected ? theme.focusedItem : theme.tertiary;
    
      Animated.timing(fadeAnims[index], {
        toValue: 1,
        duration: 1000,
        delay: (index * 200) + 2500,
        useNativeDriver: false,
      }).start();
    
  return (
    <TouchableOpacity onPress={() => setSelectedPlanet(isSelected ? null : item)}>
      <Animated.View style={{ opacity: fadeAnims[index] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp('2.5%'), marginVertical: 'auto', paddingVertical: hp('0.75%') }}>
          <Text style={{ color: textColor, fontFamily: 'Astronomicon', fontSize: RFValue(14), marginBottom: 'auto', transform: [{ translateY: hp('0.25%')}] }}>
            {simbolosPlanetas[item]}
          </Text>
          <Text style={{ fontSize: RFValue(13), fontFamily: 'Effra_Regular', color: textColor, paddingBottom: hp('0.5%'), borderColor: theme.primaryBorder, borderBottomWidth: hp(0.1), width: '100%' }}>
            {t('planet_position', { planet: item, sign: signo, degree: grado, minutes: minutos, estacionario: estacionario ? ' st' : '', retro: retrogrado ? 'Rx' : '' })}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
    
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
    
    const renderCirculoZodiacal = () => {
        // Ahora userData está disponible aquí porque se llamó en HomeScreen
        if (!resultado || !userData) return null; // Asegúrate de que userData también esté cargado

        const SVG_SIZE = width * 0.95;
        const RADIO = SVG_SIZE / 2.5;
        const CENTER = { x: SVG_SIZE / 2, y: SVG_SIZE / 2 };
        const ANGLE_PER_SIGN = 360 / 12;
        const LINE_LENGTH = RADIO + 10;
        const DISTANCIA_PLANETAS = RADIO * 0.8;
        const DISTANCIA_INNERCIRCLE = RADIO * 0.67;
        const DISTANCIA_ASPECTOS = RADIO * 0.665;
        const DISTANCIA_SIGNOS = RADIO + 19;
        const PERIMETRO = 2 * Math.PI * RADIO;
        const CANTIDAD_LINEAS = 12;
        const LONGITUD_LINEA = PERIMETRO * 0.0775;
        const LONGITUD_ESPACIO = (PERIMETRO / CANTIDAD_LINEAS) - LONGITUD_LINEA;

        const planetas = Object.keys(resultado.planetas);
        const simbolosPlanetas = i18n.language === 'es' ? {
            "Sol": "Q", "Luna": "R", "Mercurio": "S", "Venus": "T", "Marte": "U",
            "Júpiter": "V", "Saturno": "W", "Urano": "X", "Neptuno": "Y", "Plutón": "Z",
            "Lilith": "z", "Quirón": "q", "Nodo Norte": "g",
        } : {
            "Sun": "Q", "Moon": "R", "Mercury": "S", "Venus": "T", "Mars": "U",
            "Jupiter": "V", "Saturn": "W", "Uranus": "X", "Neptune": "Y", "Pluto": "Z",
            "Lilith": "z", "Chiron": "q", "North Node": "g",
        };

        const calcularDiferenciaAngular = (a1, a2) => {
            let dif = Math.abs(a1 - a2);
            return dif > 180 ? 360 - dif : dif;
        };

        const rotateInterpolate = rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['200deg', '0deg']
        });

        const rotatePlanetasInterpolate = rotatePlanetasAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['-400deg', '0deg']
        });

        const calcularPosicion = (angulo, distancia) => ({
            x: CENTER.x + distancia * Math.cos((angulo * Math.PI) / 180),
            y: CENTER.y + distancia * Math.sin((angulo * Math.PI) / 180),
            angle: angulo,
        });

    const renderizarLineasAspectos = (planeta1Data, index) => {
        const nombrePlaneta1 = planeta1Data.nombre;
        // Acceder directamente a userData
        const orbesMayoresUsuario = userData.mayores;
        const orbesMenoresUsuario = userData.menores;

        return planetas.slice(index + 1).flatMap((otroPlanetaNombre) => {
            if (selectedPlanet && nombrePlaneta1 !== selectedPlanet && otroPlanetaNombre !== selectedPlanet) {
                return null;
            }

            const { signo: signo2, grado: grado2, minutos: minutos2 } = resultado.planetas[otroPlanetaNombre];
            const planetSignoIndex2 = signosZodiacales.indexOf(signo2);

            const posicion1 = calcularPosicion(planeta1Data.angle, DISTANCIA_ASPECTOS);
            const posicion2 = calcularPosicion(
                (-planetSignoIndex2 * ANGLE_PER_SIGN - 180) -
                (grado2 + minutos2 / 60) * (ANGLE_PER_SIGN / 30) + 15,
                DISTANCIA_ASPECTOS
            );
            const diferenciaAngular = calcularDiferenciaAngular(planeta1Data.angle, posicion2.angle);

            let orbeMaximo;

            const esLuminaria = (p) => p === "Sol" || p === "Luna" || p === "Sun" || p === "Moon";
            const esInterno = (p) => ["Mercurio", "Venus", "Marte", "Júpiter", "Saturno", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"].includes(p);
            const esExterno = (p) => ["Urano", "Neptuno", "Plutón", "Uranus", "Neptune", "Pluto"].includes(p);

            const categoriaPlaneta1 = esLuminaria(nombrePlaneta1) ? 'luminarias' : esInterno(nombrePlaneta1) ? 'internos' : esExterno(nombrePlaneta1) ? 'externos' : 'otros';
            const categoriaOtroPlaneta = esLuminaria(otroPlanetaNombre) ? 'luminarias' : esInterno(otroPlanetaNombre) ? 'internos' : esExterno(otroPlanetaNombre) ? 'externos' : 'otros';

            // Definir los aspectos mayores y menores con sus colores
            const aspectosMayores = [
                { angulo: 0, nombre: "Conjunción", color: "#d194ff" }, // Aunque no está en tu lista original, 0 grados es una conjunción
                { angulo: 90, nombre: "Cuadratura", color: "#d194ff" },
                { angulo: 180, nombre: "Oposición", color: "#d194ff" },
                { angulo: 120, nombre: "Trígono", color: "#8acfff" },
            ];

            const aspectosMenores = [
                { angulo: 30, nombre: "Semisextil", color: "#ffe278" },
                { angulo: 60, nombre: "Sextil", color: "#8acfff" },
                { angulo: 150, nombre: "Quincuncio", color: "#ffe278" },
            ];

            // Combinar todos los aspectos para iterar sobre ellos
            const todosLosAspectos = [...aspectosMayores, ...aspectosMenores];

            return todosLosAspectos.map(({ angulo, nombre, color }) => {
                // Determinar qué conjunto de orbes usar (mayores o menores)
                let orbesAConsultar;
                if (aspectosMayores.some(a => a.angulo === angulo)) {
                    orbesAConsultar = orbesMayoresUsuario;
                } else if (aspectosMenores.some(a => a.angulo === angulo)) {
                    orbesAConsultar = orbesMenoresUsuario;
                } else {
                    return null; // Si no es ni mayor ni menor (no debería ocurrir con la definición actual)
                }

                // Calcular el orbe máximo para el aspecto actual
                orbeMaximo = Math.max(
                    orbesAConsultar[categoriaPlaneta1] || 0,
                    orbesAConsultar[categoriaOtroPlaneta] || 0
                );

                return Math.abs(diferenciaAngular - angulo) < orbeMaximo ? (
                    <AnimatedLine key={`Line-${nombrePlaneta1}-${otroPlanetaNombre}-${nombre}`}
                        x1={posicion1.x} y1={posicion1.y}
                        x2={posicion2.x} y2={posicion2.y}
                        stroke={color} strokeWidth="1.25"
                        opacity={opacityAnimLine} />
                ) : null;
            }).filter(Boolean); // Filtrar los elementos nulos
        });
    };
        const calcularPosicionAjustada = (planetas, index) => {
            const DISTANCIA_BASE = DISTANCIA_PLANETAS;
            const UMBRAL_ANGULO = 7;

            const getAngulo = (nombrePlaneta) => {
                const { signo, grado, minutos } = resultado.planetas[nombrePlaneta];
                const signoIndex = signosZodiacales.indexOf(signo);
                return (-signoIndex * ANGLE_PER_SIGN - 180) - (grado + minutos / 60) * (ANGLE_PER_SIGN / 30) + 15;
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
                DISTANCIA_EXTRA_TOTAL = 15;
            } else {
                DISTANCIA_EXTRA_TOTAL = 30;
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
                    <Circle cx={CENTER.x} cy={CENTER.y} r={RADIO} stroke={theme.tertiary} strokeWidth="2" fill="none" strokeDasharray={`${LONGITUD_LINEA},${LONGITUD_ESPACIO}`} transform={`rotate(16, ${CENTER.x}, ${CENTER.y})`} />

                    {signosSimbolos.map((signo, index) => {
                        const angle = -index * ANGLE_PER_SIGN - 180 + 15;
                        const textPos = calcularPosicion(angle - ANGLE_PER_SIGN / 2, DISTANCIA_SIGNOS);

                        const isSelected = selectedSign === signo;
                        const textColor = isSelected ? theme.primary : theme.tertiary;

                        return (
                            <G key={signo}>
                                <AnimatedText
                                    x={textPos.x}
                                    y={textPos.y}
                                    fontSize={height * 0.032}
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
                    <AnimatedCircle cx={CENTER.x} cy={CENTER.y} r={DISTANCIA_INNERCIRCLE} stroke={theme.tertiary} fill='none' strokeWidth="1.5" />

                    <Animated.View style={{ transform: [{ rotate: rotatePlanetasInterpolate }] }}>

                        <AnimatedSvg width={SVG_SIZE} height={SVG_SIZE}>
                            {planetas.map((planeta, index) => {
                                const { signo, grado, minutos, retrógrado, estacionario } = resultado.planetas[planeta];
                                const planetSignoIndex = signosZodiacales.indexOf(signo);
                                const posicion = calcularPosicionAjustada(planetas, index);
                                const isSelected = planeta === selectedPlanet;
                                const planetaColor = isSelected ? theme.focusedItem : theme.tertiary;

                                return (
                                    <G key={planeta}>
                                        {/* Pasamos un objeto con el nombre y el ángulo para que renderizarLineasAspectos lo use */}
                                        {renderizarLineasAspectos({ nombre: planeta, angle: posicion.angle }, index)}
                                        <AnimatedText x={posicion.x} y={posicion.y} fontSize={height * .022} textAnchor="start" alignmentBaseline="middle" fill={planetaColor} fontFamily="Astronomicon">
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
                        </AnimatedSvg></Animated.View>


                </AnimatedSvg>
                {tooltip.visible && (
                    <View style={{
                        position: 'absolute',
                        top: tooltip.position.y,
                        left: tooltip.position.x,
                        backgroundColor: theme.black,
                        padding: 5,
                        paddingHorizontal: 7,
                        borderRadius: 5,
                        elevation: 10,
                    }}>
                        <Text style={{ color: theme.background, fontFamily: 'Effra_Regular', textAlign: 'center', fontSize: height * 0.012 }}>{tooltip.sign}</Text>
                    </View>
                )}
            </Animated.View>
        );
    };
    
    if (!userData?.name) {
      return (
        <View style={{ 
                      height:height,
                      justifyContent: 'center', alignItems: 'center', 
                    }}>
                      <ActivityIndicator size="large" color="#ab89e9" />
                    </View>
      );
    }
  
    return (
      <LinearGradient style={styles.homeGradientContainer}
      colors={[theme.homeBackground1,theme.homeBackground4,theme.homeBackground4, theme.background]}>
      {theme === darkTheme && <ShootingStar />}
      <SkyStars style={styles.skyStarsTop}></SkyStars>
      <SkyStars style={styles.skyStarsBottom}></SkyStars>
      <SafeAreaView style={styles.homeContainer}>
                <TouchableOpacity
            style={{
                position: 'absolute',
                top: hp('3.75%') ,
                right: 20,
                zIndex: 1,
                padding: 5,
            }}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
        >
            <BellIcon width={width * 0.075} height={width * 0.075} fill={theme.primary} />
            {hasNewNotificationsToday && (
                <View
                    style={{
                        position: 'absolute',
                        top: width * 0.032,
                        right: width * 0.025,
                        backgroundColor: 'red',
                        borderRadius: 6,
                        width: width * 0.02,
                        height: width * 0.02,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                </View>
            )}
        </TouchableOpacity>
      <View style={styles.homeWelcomeTitles}>
        <MaskedView
          style={styles.maskedView}
          maskElement={<Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: width*0.07,
              fontFamily: 'Effra_Regular',
              textAlign: 'center',
              maxWidth: width * 0.9,
              margin: 'auto',
              backgroundColor: 'transparent',
            }}
          >
            {t('welcome', { name: userData?.name?.split(' ')[0] })}
          </Text>}
        >
          <LinearGradient
            colors={['#00b3ff', '#9352ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: .75 }}
            style={styles.gradient}
          />
        </MaskedView>

    
        <Text style={styles.welcomeText}>{t('greeting')}</Text></View>
        <Animated.View style={[styles.resultCircle, { transform: [{ rotate: interpolatedRotateAnimation }] }]}>{renderCirculoZodiacal()}</Animated.View>

        <Text style={styles.fechaText}>
        {formattedDate}
        </Text>
    
        <View style={styles.fechaButtons}>
  <TouchableOpacity style={styles.fechaButton}  disabled={loading} onPress={handleRestar}>
    <Text style={styles.titleButton}>-</Text>
  </TouchableOpacity>
  
  <TouchableOpacity style={styles.fechaModo}  disabled={loading} onPress={handleModoChange}>
  <Text style={styles.titleModoButton}>
  {t(modo === 'hora' ? 'Hora' : 
    modo === 'minuto' ? 'Minuto' : 
    modo === 'semana' ? 'Semana' : 
    modo === 'mes' ? 'Mes' : 
    modo === 'año' ? 'Año' : 'Dia')}
</Text>
  </TouchableOpacity>
  
  <TouchableOpacity style={styles.fechaButton}  disabled={loading} onPress={handleSumar}>
    <Text style={styles.titleButton}>+</Text>
  </TouchableOpacity>
  <TouchableOpacity 
      style={styles.fechaButton} 
      onPress={resetFecha}
    >
      <ResetIcon style={styles.resetIcon} />
    </TouchableOpacity>
</View>
    
        {resultado && (
           <FlatList         
           data={currentPlanetsOrder}
           renderItem={renderItem}
           keyExtractor={(item) => item}
           contentContainerStyle={styles.homeResultList}
           ListFooterComponent={<View style={styles.homeResultListSpace} />}
         />
        )}</SafeAreaView>

           <LinearGradient pointerEvents="none" colors={['transparent', theme.background, theme.background]} style={{  position: 'absolute',bottom: 0, left: 0,right: 0, height: hp('16%'), zIndex: 1}}/>
      </LinearGradient>
    );
    
};

export default HomeScreen;
