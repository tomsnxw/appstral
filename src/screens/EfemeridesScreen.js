import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Dimensions, BackHandler } from 'react-native';
import cambiosSigno from "../data/eventos/cambios_signo.json";
import retrogradaciones from "../data/eventos/retrogradaciones.json";
import lunaciones from "../data/eventos/lunaciones.json";
import {LinearGradient} from 'expo-linear-gradient';
import { useFonts } from "expo-font";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withRepeat } from 'react-native-reanimated';
import NoEventsIcon from '../../assets/icons/NoEventsIcon';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ShareIcon from "../../assets/icons/ShareIcon";
import ShareEventModal from "../modals/ShareEventModal";
import { useTranslation } from "react-i18next";
import { doc, getDoc, db } from "../config/firebaseConfig";
const { height: height, width: width } = Dimensions.get('screen');
import { ThemeContext } from '../contexts/ThemeContext';
import retrogradacionesInterpretaciones from '../data/eventos/retrogradaciones_interpretaciones.json';
import lunacionesInterpretaciones from '../data/eventos/lunaciones_interpretaciones.json'; 
import cambiosSignosInterpretaciones from '../data/eventos/cambios_signos_interpretaciones.json'; // Importa el nuevo archivo JSON
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";

const SkeletonItem = ({theme}) => {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles(theme).skeletonEventContainer}>
      <Animated.View style={[styles(theme).skeletonEventCircle, animatedStyle]} />
      <View style={styles(theme).skeletonEventTextContainer}>
        <Animated.View style={[styles(theme).skeletonEventLine, animatedStyle, { width: "50%" }]} />
        <Animated.View style={[styles(theme).skeletonEventLine, animatedStyle, { width: "40%" }]} />
       <View style={{height: .5, marginVertical: 10, backgroundColor: theme.primaryBorder, marginLeft: width*0.01,}}/>
      </View>
    </View>
  );
};

const EfemeridesScreen = ({ rangoTiempo, filtroCategoria }) => {
  const { theme } = useContext(ThemeContext);
  const [proximosEventos, setProximosEventos] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null); 
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [hayEventosHoy, setHayEventosHoy] = useState(false);
  const [loading, setLoading] = React.useState(true);
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [eventosTotales, setEventosTotales] = useState([]);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleOpenShareModal = (evento) => {
    setEventoSeleccionado(evento);
    setShareModalVisible(true);
  };

  const handleCloseShareModal = () => {
    setShareModalVisible(false);
  };

  const cargarEventos = useCallback(async () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const convertirAFechaLocal = (fechaUTC) => {
      const fecha = new Date(fechaUTC);
      return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    };
    
    const fechaFormateada = (fecha) => {
      return new Intl.DateTimeFormat(i18n.language, { day: '2-digit', month: 'long' }).format(new Date(fecha));
    };
    
    const language = i18n.language;

    const cargarEventosCambios = async () => {
      return await Promise.all(cambiosSigno.map(async (evento) => {
        const planeta = evento.planeta;
        const signo = evento.signo;
        let detallesIdioma = null; // Inicializamos a null
  
        // Accede a la interpretación desde el JSON local de cambios de signo
        if (cambiosSignosInterpretaciones[planeta] && cambiosSignosInterpretaciones[planeta][signo]) {
          detallesIdioma = cambiosSignosInterpretaciones[planeta][signo][i18n.language] ||
                           cambiosSignosInterpretaciones[planeta][signo].es ||
                           null; // Si no se encuentra en ningún idioma, sigue siendo null
        }
  
        return {
          fecha: convertirAFechaLocal(evento.fecha),
          planeta: t(`planetas.${planeta}`),
          title: `${t(`planetas.${planeta}`)} ${evento.movimiento === "retrógrado" ? t(`retrograde`) : ""} ${t(`entra_en`)} ${t(`signs.${signo}`)}`,
          categoria: 'cambios',
          simbolo: signo,
          detalles: detallesIdioma
        };
      }));
    };
  
    const cargarEventosRetro = async () => {
      let eventosRetro = [];
      for (const planeta in retrogradaciones) {
        for (const evento of retrogradaciones[planeta]) {
          const inicio = convertirAFechaLocal(evento.inicio);
          const fin = convertirAFechaLocal(evento.fin);
          let detalles = null; // Inicializamos a null
  
          // Accede a la interpretación desde el JSON local
          if (retrogradacionesInterpretaciones[planeta] && retrogradacionesInterpretaciones[planeta][evento.inicio_signo]) {
            detalles = retrogradacionesInterpretaciones[planeta][evento.inicio_signo][i18n.language] ||
                       retrogradacionesInterpretaciones[planeta][evento.inicio_signo].es ||
                       null; // Si no se encuentra en ningún idioma, sigue siendo null
          }
  
          eventosRetro.push({
            fecha: inicio,
            rango: `${fechaFormateada(inicio)} - ${fechaFormateada(fin)}`,
            planeta: t(`planetas.${planeta}`),
            title: `${t(`planetas.${planeta}`)} ${t(`retrograde`)}`,
            signo: `${evento.inicio_grado}° ${t(`signs.${evento.inicio_signo}`)} - ${evento.fin_grado}° ${t(`signs.${evento.fin_signo}`)}`,
            categoria: 'retrogradaciones',
            detalles,
            inicio,
            fin
          });
        }
      }
      return eventosRetro;
    };
  
    const cargarEventosLunaciones = async () => {
      return await Promise.all(lunaciones.map(async (evento) => {
        const fecha = convertirAFechaLocal(evento.date);
        const tipoEvento = evento.eclipse ? evento.eclipse : evento.phase;
        const signo = evento.sign;
        let detalles = null; // Inicializamos a null
  
        // Accede a la interpretación desde el JSON local de lunaciones
        if (lunacionesInterpretaciones[tipoEvento] && lunacionesInterpretaciones[tipoEvento][signo]) {
          detalles = lunacionesInterpretaciones[tipoEvento][signo][i18n.language] ||
                     lunacionesInterpretaciones[tipoEvento][signo].es ||
                     null; // Si no se encuentra en ningún idioma, sigue siendo null
        }
  
        const faseTraducida = t(`lunacion.${evento.phase}`);
        const eclipseTraducido = evento.eclipse ? t(`eclipses.${evento.eclipse}`) : null;
        const tituloEvento = eclipseTraducido || faseTraducida;
  
        return {
          fecha,
          title: tituloEvento,
          categoria: 'lunaciones',
          signo: `${evento.degree}° ${t(`signs.${signo}`)}`,
          phase: faseTraducida,
          detalles
        };
      }));
    };

    const eventos = [
      ...(await cargarEventosCambios()),
      ...(await cargarEventosRetro()),
      ...(await cargarEventosLunaciones())
    ];

    return eventos;
  }, [i18n.language]);

  useEffect(() => {
    const cargarTodosLosEventos = async () => {
      setLoading(true);
      const eventos = await cargarEventos();
      setEventosTotales(eventos);
      setLoading(false);
    };

    cargarTodosLosEventos();
  }, []);

  const filtrarEventos = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicioSemana = new Date(hoy);
    inicioSemana.setHours(0, 0, 0, 0);
    const finSemana = new Date(hoy);
    finSemana.setDate(hoy.getDate() + 7);
    finSemana.setHours(23, 59, 59, 999);

    const inicioMes = new Date(hoy);
    inicioMes.setHours(0, 0, 0, 0);
    const finMes = new Date(hoy);
    finMes.setDate(hoy.getDate() + 30);
    finMes.setHours(23, 59, 59, 999);

    let eventosFiltrados = eventosTotales.filter(evento => {
      if (filtroCategoria !== "todo" && evento.categoria !== filtroCategoria) return false;

      // ... (tu lógica de filtro existente para 'hoy', 'semana', 'mes')
      if (rangoTiempo === 'hoy') {
        if (evento.categoria === 'retrogradaciones') {
          return hoy >= evento.inicio && hoy <= evento.fin;
        }
        return evento.fecha.toDateString() === hoy.toDateString();
      }

      if (rangoTiempo === 'semana') {
        if (evento.categoria === 'retrogradaciones') {
          return evento.inicio <= finSemana && evento.fin >= inicioSemana;
        }
        return evento.fecha >= inicioSemana && evento.fecha <= finSemana;
      }

      if (rangoTiempo === 'mes') {
        if (evento.categoria === 'retrogradaciones') {
          return evento.inicio <= finMes && evento.fin >= inicioMes;
        }
        return evento.fecha >= inicioMes && evento.fecha <= finMes;
      }
      return false;
    }).map(evento => { // <-- ¡Nuevo: Usamos .map para añadir la propiedad!
        let isStartingWithinRange = false;
        if (rangoTiempo === 'hoy') {
            isStartingWithinRange = evento.fecha.toDateString() === hoy.toDateString();
        } else if (rangoTiempo === 'semana') {
            // Para retrogradaciones, su 'fecha' es 'inicio', así que el chequeo es directo
            isStartingWithinRange = evento.fecha >= inicioSemana && evento.fecha <= finSemana;
        } else if (rangoTiempo === 'mes') {
            // Para retrogradaciones, su 'fecha' es 'inicio', así que el chequeo es directo
            isStartingWithinRange = evento.fecha >= inicioMes && evento.fecha <= finMes;
        }
        return { ...evento, isStartingWithinRange };
    });

    // --- Lógica de ordenamiento unificada ---
    eventosFiltrados.sort((a, b) => {
        // Priorizar eventos que comienzan dentro del rango actual
        if (a.isStartingWithinRange && !b.isStartingWithinRange) {
            return -1;
        }
        if (!a.isStartingWithinRange && b.isStartingWithinRange) {
            return 1;
        }

        // Si ambos o ninguno comienzan dentro del rango, ordenar por fecha
        // Para retrogradaciones, usar su 'inicio' para el orden secundario
        if (a.categoria === 'retrogradaciones' && b.categoria === 'retrogradaciones') {
            return a.inicio - b.inicio;
        }
        return a.fecha - b.fecha;
    });

    return eventosFiltrados;
  };

  useEffect(() => {
    if (!eventosTotales.length) return; // Evita el filtrado inicial si no hay eventos cargados
    const eventosFiltrados = filtrarEventos();
    setProximosEventos(eventosFiltrados);
    setHayEventosHoy(rangoTiempo === 'hoy' && eventosFiltrados.length > 0);
  }, [rangoTiempo, filtroCategoria, eventosTotales]);

  return (
    <View style={styles(theme).efemeridesContainer}>
      <FlatList
        style={styles(theme).efemeridesCardContainer}
        ListHeaderComponent={<View style={styles(theme).topEfemeridesSpace} />}
        ItemSeparatorComponent={() => <View style={styles(theme).efemeridesSeparator} />}
        data={loading ? Array(3).fill({}) : proximosEventos}
        keyExtractor={(item, index) => index.toString()}
   renderItem={({ item, index }) =>
    loading ? (
      <SkeletonItem theme={theme}/>
    ) : (
      <AccordionItem
        item={item}
        index={index}
        expandedIndex={expandedIndex}
        i18n={i18n}
        theme={theme}
        t={t}
        toggleAccordion={toggleAccordion}
        handleOpenShareModal={() => handleOpenShareModal(item)}
        rangoTiempo={rangoTiempo} // <-- ¡Pasa rangoTiempo aquí!
      />
          )
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles(theme).noEventsContainer}>
              <NoEventsIcon style={styles(theme).noEventsIcon} />
              {rangoTiempo === 'hoy' ? (
                <>
                  <Text style={styles(theme).noEventsTitle}>{t("No_Efemerides")}</Text>
                  <Text style={styles(theme).noEventsText}>
                    {t("Intentar_Semana")}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles(theme).noEventsTitle}>{t("No_Efemerides_Tipo")}</Text>
                  <Text style={styles(theme).noEventsText}>
                    {t("Intentar_Tipo")}
                  </Text>
                </>
              )}
            </View>
          )
        }
        ListFooterComponent={<View style={styles(theme).efemeridesFooter} />}
      />
           <LinearGradient pointerEvents="none" colors={['transparent', theme.shadowBackground, theme.shadowBackground, theme.shadowBackground]} style={{  position: 'absolute',bottom: 0, left: 0,right: 0, height: hp('17%'), zIndex: 1}}/>
      {shareModalVisible && (
        <ShareEventModal
          visible={shareModalVisible}
          route={{ params: { evento: eventoSeleccionado } }} 
          handleCloseShareModal={handleCloseShareModal}
        />
      )}
    </View>
  );
};
const AccordionItem = ({ item, index, expandedIndex, toggleAccordion, i18n, handleOpenShareModal, t, theme, rangoTiempo  }) => {
  const navigation = useNavigation();
  const idioma = i18n.language;
  const fechaFormateada = (() => {
    const fecha = new Intl.DateTimeFormat(idioma, {
      day: '2-digit',
      month: 'long',
    }).format(new Date(item.fecha));

    return `${fecha}`;
  })();


  const signosSimbolos = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'
  ];

  const signosZodiacales = [
    "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio",
    "Sagitario", "Capricornio", "Acuario", "Piscis"
  ];

  const obtenerLetraCategoria = (evento) => {
    if (evento.categoria === "retrogradaciones") return "M";
    if (evento.categoria === "cambios") {
      const index = signosZodiacales.indexOf(evento.simbolo);
      return index !== -1 ? signosSimbolos[index] : "C";
    } if (evento.categoria === "lunaciones") return "R";
    return "";
  };


  const height = useSharedValue(0);
  useEffect(() => {
    height.value = withSpring(expandedIndex === index ? 500 : 0, { damping: 20, stiffness: 90 });
  }, [expandedIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: height.value,
    opacity: height.value > 0 ? 1 : 0,
  }));

  const canToggle = item && item.detalles;
  const showShareButton = item && item.detalles;

  const isExpanded = expandedIndex === index;
  const shouldBeFaded = (rangoTiempo === 'semana' || rangoTiempo === 'mes') && !item.isStartingWithinRange;

  const itemOpacity = isExpanded ? 1 : (shouldBeFaded ? 0.5 : 1);

  return (
    <View style={[styles(theme).efemeridesCard, { opacity: itemOpacity }]}>
      <LinearGradient
        colors={
          item.categoria === "aspectos"
            ? [theme.eventMagenta, theme.eventGreen]
            : item.categoria === "cambios de signo"
              ? [theme.eventYellow, theme.eventPink]
              : item.categoria === "retrogradaciones"
                ? [theme.eventMagenta, theme.eventGreen]
                : item.categoria === "lunaciones"
                  ? [theme.eventBlue, theme.eventPurple]
                  : [theme.eventYellow, theme.eventPink]
        }
        style={styles(theme).categoriaCirculo}
      >
        <Text
          style={[
            styles(theme).categoriaEventoLetra,
            item.categoria === "cambios" && styles(theme).signoEstilo,
            item.categoria === "lunaciones" && styles(theme).lunaEstilo,
            item.categoria === "retrogradaciones" && styles(theme).retroEstilo
          ]}
        >
          {obtenerLetraCategoria(item)}
        </Text>
      </LinearGradient>

      <TouchableOpacity
        onPress={canToggle ? () => toggleAccordion(index) : null}
        style={styles(theme).eventContainer}
        activeOpacity={canToggle ? 0.8 : 1}
      >
        <View style={{ width: width * 0.77, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles(theme).eventTitle}>{item.title}</Text>
          {showShareButton && (
            <TouchableOpacity style={{ zIndex: 10, width: 25, height: 25 }} onPress={handleOpenShareModal}>
              <ShareIcon style={styles(theme).eventShareIcon} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles(theme).eventInfo}>
          {item.categoria === "aspectos" || item.categoria === "retrogradaciones"
            ? item.rango
            : fechaFormateada}
        </Text>

        {item.signo && <Text style={styles(theme).eventInfo}>{item.signo}</Text>}

        <Animated.View
          style={[styles(theme).expandedContent, animatedStyle]}>
          {item.detalles &&
            <View style={styles(theme).eventDetailsContainer}>
              <Text style={styles(theme).eventDetails}>{item.detalles}</Text>
            </View>
          }
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};


const styles = (theme) => StyleSheet.create({
  skeletonEventContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: wp(4), // Approximation of 15 based on typical screen width
    gap: wp(2.5), // Approximation of 10 based on typical screen width
    height: hp(9.5), // height*0.095
    borderRadius: wp(2.5), // Approximation of 10
  },
  skeletonEventCircle: {
    width: hp(5.5), // height*0.055
    height: hp(5.5), // height*0.055
    borderRadius: RFValue(25), // Adjusted for font size
    backgroundColor: "#ddd",
    marginTop: 0,
    margin: 'auto'
  },
  skeletonEventTextContainer: {
    flex: 1,
    marginBottom: hp(1.2), // Approximation of 10
  },
  skeletonEventLine: {
    height: RFValue(15), // Adjusted for font size
    backgroundColor: "#e6e6e6",
    borderRadius: RFValue(4), // Adjusted for font size
    marginVertical: hp(0.6), // Approximation of 5
  },
  efemeridesContainer: {
    height: hp('100%'), // height
    marginTop: 'auto',
    marginBottom: 0,
    marginTop: hp(15), // height*.02
  },
  topEfemeridesSpace: {
    height: hp(6.5), // height*.08
  },
  efemeridesCard: {
    paddingTop: hp(1.2), // Approximation of 10
    flexDirection: 'row',
    gap: wp(2.5), // Approximation of 10
    paddingLeft: wp(4), // Approximation of 15
  },
  categoriaEventoLetra: {
    textAlign: 'center',
    margin: 'auto',
    color: theme.alwaysWhite,
    fontSize: hp(5), // height*0.05
    fontFamily: 'Astronomicon',
    lineHeight: hp(4.5), // height*0.045
  },
  categoriaCirculo: {
    width: hp(5.5), // height*0.055
    height: hp(5.5), // height*0.055
    marginVertical: 'auto',
    marginTop: 0,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(100), // Adjusted for font size
  },
  signoEstilo: {
    textAlign: 'center',
    margin: 'auto',
    color: theme.alwaysWhite,
    fontSize: hp(4), // height*0.04
    lineHeight: hp(4), // height*0.04
    fontFamily: 'Astronomicon',
  },
  retroEstilo: {
    textAlign: 'center',
    margin: 'auto',
    marginTop: hp(0.7), // height*0.007
    marginLeft: hp(1.95), // height*0.019
    color: theme.alwaysWhite,
    fontSize: hp(6), // height*0.06
    fontFamily: 'Astronomicon',
  },
  lunaEstilo: {
    textAlign: 'center',
    color: theme.alwaysWhite,
    margin: 'auto',
    marginTop: 'auto',
    fontSize: hp(4), // height*0.04
    fontFamily: 'Astronomicon',
    textAlign: 'left',
    transform: [
      { translateY: RFValue(0.5) }, // Adjusted for font size
      { translateX: RFValue(1.75) } // Adjusted for font size
    ],
  },
  eventContainer: {
    borderColor: theme.primaryBorder,
    borderBottomWidth: hp(0.1), // height*.000325
    width: wp(100), // width*1
    paddingBottom: hp(1.2), // Approximation of 10
  },
  eventTitle: {
    fontSize: hp(2.2), // height * 0.018
    color: theme.primary,
    fontFamily: 'Effra_Medium',
    maxWidth: wp(90), // '90%'
    flexWrap: 'wrap',
  },
  eventShareIcon: {
    fill: theme.secondaryBorder,
    width: hp(1.8), // height*0.018
    height: hp(1.8), // height*0.018
    margin: 'auto',
  },
  eventInfo: {
    fontSize: hp(2), // height*0.019
    fontFamily: 'Effra_Regular',
    color: theme.secondaryBorder
  },
  noEventsContainer: {
    paddingTop: hp(6), // height*0.06
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(1.5), // height*0.015
  },
  noEventsText: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: hp(2.2), // height*0.022
    lineHeight: hp(3.5), // height*0.035
    color: theme.secondary,
    marginHorizontal: wp(15), // Approximation of 60
    marginTop: hp(0.6), // Approximation of 5
    fontFamily: 'Effra_Light',
  },
  noEventsTitle: {
    fontSize: hp(4), // height*0.04
    lineHeight: hp(4.5), // height*0.045
    width: wp(70), // width*0.7
    marginTop: hp(1.2), // Approximation of 10
    textAlign: 'center',
    fontFamily: 'Effra_Light',
    color: theme.secondaryBorder
  },
  noEventsIcon: {
    width: wp(60), // width*0.6
    height: wp(60), // width*0.6
    margin: 'auto',
    fill: theme.secondaryBorder
  },
  expandedContent: {
    overflow: 'hidden',
  },
  eventDetailsContainer: {
    marginTop: hp(1.2), // Approximation of 10
    marginBottom: 0,
    width: wp(76.5), // width*.765
  },
  eventDetails: {
    fontSize: hp(1.9), // height*0.017
    fontFamily: 'Effra_Regular',
    color: theme.primary,
    lineHeight: hp(2.4), // height*0.024
    marginVertical: 'auto',
  },
  efemeridesFooter: {
    height: hp(40), // height*0.4
  },
});

export default EfemeridesScreen;