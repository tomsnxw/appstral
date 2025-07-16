import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, TextInput, ActivityIndicator, RefreshControl, KeyboardAvoidingView, Platform, Modal, Dimensions, Keyboard, TouchableWithoutFeedback , Text, FlatList, StyleSheet, Alert, ScrollView,PanResponder , Easing , SafeAreaView, TouchableOpacity, Share, BackHandler } from 'react-native';
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

import { useNotifications } from "../contexts/NotificationContext";

const NotificationsScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { setHasNewNotificationsToday, markNotificationsAsViewed } = useNotifications(); // Usa el contexto de notificaciones

  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  // Funciones auxiliares para la lógica de los círculos
  const signosSimbolos = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L' // Símbolos zodiacales
  ];

  const signosZodiacales = [
    "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio",
    "Sagitario", "Capricornio", "Acuario", "Piscis"
  ];

  const obtenerLetraCategoria = (evento) => {
    if (evento.category === "retrogradaciones") return "M"; // M de Mercurio Retrógrado (símbolo universal de retrogradación)
    if (evento.category === "cambios") {
      // Para cambios de signo, usamos el símbolo del signo zodiacal
      const index = signosZodiacales.indexOf(evento.symbol); // 'symbol' es el 'signo' original en inglés
      return index !== -1 ? signosSimbolos[index] : "C"; // C de 'Cambio' genérico si no se encuentra
    }
    if (evento.category === "lunaciones") {
      // Diferenciar lunas llenas y nuevas o eclipses
      if (evento.phase === 'nueva') return "Ñ"; // Símbolo para luna nueva (ejemplo)
      if (evento.phase === 'llena') return "F"; // Símbolo para luna llena (ejemplo)
      if (evento.phase === 'eclipse_solar') return "S"; // Símbolo para eclipse solar
      if (evento.phase === 'eclipse_lunar') return "L"; // Símbolo para eclipse lunar
      return "R"; // R de 'Luna' genérico
    }
    return ""; // Vacío por defecto
  };

  // Función para convertir fechas UTC a fechas locales (solo día, mes, año)
  const convertToLocalDate = (utcDate) => {
    const date = new Date(utcDate);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Función para formatear fechas
  const formatDate = (date) => {
    return new Intl.DateTimeFormat(i18n.language, { day: '2-digit', month: 'long' }).format(new Date(date));
  };

  // Función para cargar todos los eventos (cambios de signo, retrogradaciones, lunaciones)
  const loadAllEvents = useCallback(async () => {
    const loadSignChanges = async () => {
      return await Promise.all(cambiosSigno.map(async (event) => {
        const planet = event.planeta;
        const sign = event.signo; // Este es el signo en español del JSON
        let detailsLocalized = null;

        if (cambiosSignosInterpretaciones[planet] && cambiosSignosInterpretaciones[planet][sign]) {
          detailsLocalized = cambiosSignosInterpretaciones[planet][sign][i18n.language] ||
                             cambiosSignosInterpretaciones[planet][sign].es ||
                             null;
        }

        return {
          date: convertToLocalDate(event.fecha),
          planet: t(`planetas.${planet}`),
          title: `${t(`planetas.${planet}`)} ${event.movimiento === "retrógrado" ? t(`retrograde`) : ""} ${t(`entra_en`)} ${t(`signs.${sign}`)}`,
          category: 'cambios',
          symbol: sign, // Almacena el nombre del signo para 'obtenerLetraCategoria'
          details: detailsLocalized,
        };
      }));
    };

    const loadRetrogradations = async () => {
      let retroEvents = [];
      for (const planet in retrogradaciones) {
        for (const event of retrogradaciones[planet]) {
          const start = convertToLocalDate(event.inicio);
          const end = convertToLocalDate(event.fin);
          let details = null;

          if (retrogradacionesInterpretaciones[planet] && retrogradacionesInterpretaciones[planet][event.inicio_signo]) {
            details = retrogradacionesInterpretaciones[planet][event.inicio_signo][i18n.language] ||
                      retrogradacionesInterpretaciones[planet][event.inicio_signo].es ||
                      null;
          }

          retroEvents.push({
            date: start,
            range: `${formatDate(start)} - ${formatDate(end)}`,
            planet: t(`planetas.${planet}`),
            title: `${t(`planetas.${planet}`)} ${t(`retrograde`)}`,
            sign: `${event.inicio_grado}° ${t(`signs.${event.inicio_signo}`)} - ${event.fin_grado}° ${t(`signs.${event.fin_signo}`)}`,
            category: 'retrogradaciones',
            details,
            start,
            end,
            symbol: 'M' // Puedes asignar un símbolo aquí si no lo haces en obtenerLetraCategoria
          });
        }
      }
      return retroEvents;
    };

    const loadLunations = async () => {
      return await Promise.all(lunaciones.map(async (event) => {
        const date = convertToLocalDate(event.date);
        const eventType = event.eclipse ? event.eclipse : event.phase;
        const sign = event.sign;
        let details = null;

        if (lunacionesInterpretaciones[eventType] && lunacionesInterpretaciones[eventType][sign]) {
          details = lunacionesInterpretaciones[eventType][sign][i18n.language] ||
                    lunacionesInterpretaciones[eventType][sign].es ||
                    null;
        }

        const translatedPhase = t(`lunacion.${event.phase}`);
        const translatedEclipse = event.eclipse ? t(`eclipses.${event.eclipse}`) : null;
        const eventTitle = translatedEclipse || translatedPhase;

        return {
          date,
          title: eventTitle,
          category: 'lunaciones',
          sign: `${event.degree}° ${t(`signs.${sign}`)}`,
          phase: translatedPhase,
          details,
          symbol: eventType // Pasa el tipo de evento para obtener el símbolo específico de luna/eclipse
        };
      }));
    };

    const allFetchedEvents = [
      ...(await loadSignChanges()),
      ...(await loadRetrogradations()),
      ...(await loadLunations())
    ];

    allFetchedEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

    return allFetchedEvents;
  }, [i18n.language, t]);

  useEffect(() => {
    const fetchAndFilterEvents = async () => {
      setLoading(true);
      const events = await loadAllEvents();
      setAllEvents(events);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - 7);

      const notifications = [];

      const isInRange = (eventDate, startRange, endRange) => {
        return eventDate.getTime() >= startRange.getTime() && eventDate.getTime() <= endRange.getTime();
      };
      let hasEventsToday = false;

      events.forEach(event => {
        const eventEffectiveDate = event.category === 'retrogradaciones' ? event.start : event.date;

        if (eventEffectiveDate.toDateString() === today.toDateString()) {
          notifications.push({ ...event, timeCategory: t('today') });
        } else if (eventEffectiveDate.toDateString() === yesterday.toDateString()) {
          notifications.push({ ...event, timeCategory: t('yesterday') });
        } else if (isInRange(eventEffectiveDate, lastWeekStart, yesterday)) {
          notifications.push({ ...event, timeCategory: t('last_week') });
        }
      });

      const groupedNotifications = {};
      notifications.forEach(notif => {
        if (!groupedNotifications[notif.timeCategory]) {
          groupedNotifications[notif.timeCategory] = [];
        }
        groupedNotifications[notif.timeCategory].push(notif);
      });

      const orderedCategories = [t('today'), t('yesterday'), t('last_week')];
      const finalNotifications = [];

      orderedCategories.forEach(category => {
        if (groupedNotifications[category]) {
          groupedNotifications[category].sort((a, b) => b.date.getTime() - a.date.getTime());
          finalNotifications.push({
            title: category,
            data: groupedNotifications[category]
          });
        }
      });

      setFilteredNotifications(finalNotifications);
      setLoading(false);
      setHasNewNotificationsToday(hasEventsToday);
    };

    fetchAndFilterEvents();
  }, [loadAllEvents, t, setHasNewNotificationsToday]); 

  useFocusEffect(
    useCallback(() => {
      markNotificationsAsViewed();
    }, [markNotificationsAsViewed])
  );
  
  const NotificationItem = ({ item, theme, t }) => {
    const isRetrogradation = item.category === 'retrogradaciones';
    const displayDate = isRetrogradation ? item.range : formatDate(item.date);
    const displaySign = item.sign ? `${item.sign}` : '';

    const categoryLetter = obtenerLetraCategoria(item);

    let gradientColors = [theme.eventYellow, theme.eventPink]; 

    if (item.category === "retrogradaciones") {
      gradientColors = [theme.eventMagenta, theme.eventGreen];
    } else if (item.category === "cambios") {
      gradientColors = [theme.eventYellow, theme.eventPink];
    } else if (item.category === "lunaciones") {
      gradientColors = [theme.eventBlue, theme.eventPurple];
    }

    return (
      <View style={styles(theme).notificationCard}>
        <LinearGradient
          colors={gradientColors}
          style={styles(theme).categoriaCirculo}
        >
          <Text
            style={[
              styles(theme).categoriaEventoLetra,
              item.category === "cambios" && styles(theme).signoEstilo,
              item.category === "lunaciones" && styles(theme).lunaEstilo,
              item.category === "retrogradaciones" && styles(theme).retroEstilo
            ]}
          >
            {categoryLetter}
          </Text>
        </LinearGradient>

        <View style={styles(theme).notificationContent}>
          <Text style={styles(theme).notificationTitle}>{item.title}</Text>
          <Text style={styles(theme).notificationInfo}>
            {displayDate}
          </Text>
          <Text style={styles(theme).notificationInfo}>
            {displaySign}
          </Text>
        </View>
      </View>
    );
  };

  
      const ItemSeparator = () => (
        <View
          style={{
    height: hp(0.1),
    backgroundColor: theme.shareLine,
    marginLeft: width*0.175,
          }}
        />
      );  
  return (
      <SafeAreaView style={styles(theme).notificationsContainer}>
        <View style={styles(theme).header}>
          <Text style={styles(theme).headerTitle}>{i18n.language === 'es' ? 'Notificaciones' : 'Notifications'}</Text>
        </View>

        {loading ? (
          <View style={styles(theme).loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <FlatList
            style={styles(theme).notificationsList}
            data={filteredNotifications}
            keyExtractor={(item, index) => item.title + index.toString()}
            renderItem={({ item }) => (
              <View>
                <Text style={styles(theme).categoryHeader}>{item.title}</Text>
                <View style={styles(theme).categoryLine}></View>
                <FlatList
                  data={item.data}
                  keyExtractor={(subItem, subIndex) => subItem.title + subItem.date.toISOString() + subIndex.toString()}
                  renderItem={({ item: subItem }) => (
                    <NotificationItem item={subItem} theme={theme} t={t} />
                  )}
                  ItemSeparatorComponent={ItemSeparator}
                />
              </View>
            )}
            ListEmptyComponent={
              <View style={styles(theme).noNotificationsContainer}>
                <NoEventsIcon style={styles(theme).noNotificationsIcon} />
                <Text style={styles(theme).noNotificationsTitle}>{i18n.language === 'es' ? 'Nada que notificar' : 'Nothing to notify'}</Text>
                <Text style={styles(theme).noNotificationsText}>{i18n.language === 'es' ? 'Pero puedes ver en Efemérides los eventos por venir' : 'But you can see upcoming events in Ephemeris'}</Text>
              </View>
            }
            ListFooterComponent={<View style={styles(theme).notificationsFooter} />}
          />
        )}
        <LinearGradient pointerEvents="none" colors={[theme.transparentBackground, theme.background, theme.background]} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: hp('20%'), zIndex: 1 }} />
      </SafeAreaView>
  );
};

const styles = (theme) => StyleSheet.create({
  notificationsContainer: {
    flex: 1,
    marginLeft: width*0.05,
    paddingTop: hp('3.5%') 
  },
  headerTitle: {
    fontSize: RFValue(22),
    fontFamily: 'Effra_Regular',
    color: theme.primary,
    textAlign:'start',
    marginTop: 5
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: RFValue(16),
    fontFamily: 'Effra_Regular',
    color: theme.secondary,
  },
  notificationsList: {
    flex: 1,
    paddingTop: 10,
  },
  categoryHeader: {
    fontSize: RFValue(16),
    fontFamily: 'Effra_Regular',
    color: theme.secondaryBorder,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 5,
  },
  categoryLine: {
    height: hp(0.1),
    backgroundColor: theme.shareLine,
    marginRight: width*0.05,
  },
  notificationCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row', // Para que el círculo y el contenido estén uno al lado del otro
    alignItems: 'center',
    
  },
  notificationContent: {
    flex: 1,
    marginLeft: 15,
  },
  notificationTitle: {
    fontSize: hp(2.2),
    fontFamily: 'Effra_Medium',
    color: theme.primary,
    marginBottom: 5,
  },
  notificationInfo: {
    fontSize: hp(2),
    fontFamily: 'Effra_Regular',
    color: theme.secondary,
  },
  notificationSeparator: {
    height: 2,
    backgroundColor: theme.red,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  noNotificationsContainer: {
    paddingTop: hp(12),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(1.5),
  },
  noNotificationsText: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: hp(2.2),
    lineHeight: hp(3.5),
    color: theme.secondary,
    marginHorizontal: wp(15),
    marginTop: hp(0.6),
    fontFamily: 'Effra_Light',
  },
  noNotificationsTitle: {
    fontSize: hp(4),
    lineHeight: hp(4.5),
    width: wp(70),
    marginTop: hp(1.2),
    textAlign: 'center',
    fontFamily: 'Effra_Light',
    color: theme.secondaryBorder
  },
  noNotificationsIcon: {
    width: wp(60),
    height: wp(60),
    margin: 'auto',
    fill: theme.secondaryBorder
  },
  notificationsFooter: {
    height: hp(10),
  },
  // Skeleton styles
  skeletonEventContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: wp(4),
    gap: wp(2.5),
    height: hp(9.5),
    borderRadius: wp(2.5),
    marginBottom: 10,
  },
  skeletonEventCircle: {
    width: hp(5.5),
    height: hp(5.5),
    borderRadius: RFValue(25),
    backgroundColor: "#ddd",
    marginTop: 0,
    margin: 'auto'
  },
  skeletonEventTextContainer: {
    flex: 1,
    marginBottom: hp(1.2),
  },
  skeletonEventLine: {
    height: RFValue(15),
    backgroundColor: "#e6e6e6",
    borderRadius: RFValue(4),
    marginVertical: hp(0.6),
  },
  // --- Estilos de los círculos y letras (copiados y ajustados) ---
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
});

export default NotificationsScreen;