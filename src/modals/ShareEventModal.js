import React, { useState, useRef, useMemo, useEffect } from 'react';
import axios from 'axios';
import { View, TouchableWithoutFeedback, Text, TextInput, Animated,TouchableOpacity, FlatList, KeyboardAvoidingView,Keyboard, StyleSheet, PanResponder, Platform, Alert,Dimensions, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import { auth, db, addDoc, collection } from '../config/firebaseConfig';
import Svg, { Circle, Line, G, Image, Text as SvgText } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import {LinearGradient} from 'expo-linear-gradient';
import { Button } from 'react-native-elements';
import cities from '../data/cities.json';
import {Picker} from '@react-native-picker/picker';
import CrossIcon from "../../assets/icons/CrossIcon";
import CheckIcon from "../../assets/icons/CheckIcon";
import AlertIcon from "../../assets/icons/AlertIcon";
import AddIcon from '../../assets/icons/AddIcon';
import colors from '../utils/colors';
import { SelectList } from 'react-native-dropdown-select-list';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";

// Elimina estas constantes si ya no las necesitas, o úsalas con wp/hp si aplica
const { height: height, width: width } = Dimensions.get('screen');
// const viewShotWidth = width;
// const viewShotHeight = (viewShotWidth * 16) / 9;

// Ahora puedes definir tus tamaños base usando wp y hp directamente
const eventWidth = wp('80%'); // 100% / 1.25
const eventHeight = hp('65%'); // Un aproximado para (viewShotWidth * 16) / 9 / 1.25
const contentWidth = wp('55%'); // 100% / 2
const contentHeight = hp('45%'); // 87.5% / 2.4
const textWidth = wp('44%'); // 100% / 2.5

// Usa RFValue para los tamaños de fuente
const baseFontSize = RFValue(12); // Puedes ajustar este valor base

import CustomToast from "../components/CustomToast";
import ViewShot, { captureRef } from 'react-native-view-shot';

import * as Sharing from 'expo-sharing';
import { useTranslation } from 'react-i18next';


const ShareEventModal =  ({ route, visible, handleCloseShareModal }) => {
  const { evento } = route.params;
     const viewShotRef = useRef(null);
     const { t, i18n  } = useTranslation();
    const shareImage = async () => {
       try {
         const uri = await captureRef(viewShotRef, {
           format: 'png',
           quality: 1,
         });
   
         const isAvailable = await Sharing.isAvailableAsync();
         if (isAvailable) {
           await Sharing.shareAsync(uri);
         } else {
           alert('La función de compartir no está disponible en este dispositivo.');
         }
       } catch (error) {
         console.error('Error al capturar la imagen:', error);
       }
     };
 
     const fechaFormateada = (() => {
      const idioma = i18n.language || 'es-ES'; 
      const fecha = new Intl.DateTimeFormat(idioma, {
        day: '2-digit',
        month: 'long',
      }).format(new Date(evento.fecha));
      return `${fecha}`;
    })();
     const gradients = [
       ['#7f47dd', '#29abe2'], 
       ['#dd8bd9', '#f8ff2e'], 
       ['#4ff5a4', '#e229dc'],
       ['black', 'black'], 
       ['white', 'white'],  
     ];
   
     const textColors = ['white', 'black', 'black','white', 'black']; 
   
     const [gradientIndex, setGradientIndex] = useState(0);
 
       const [translateY, setTranslateY] = useState(new Animated.Value(height));  
       const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
       const [isModalVisible, setIsModalVisible] = useState(false); 
         
         useEffect(() => {
           if (visible) {
             setIsModalVisible(true);
             requestAnimationFrame(() => {
               Animated.parallel([
                 Animated.timing(fadeAnim, {
                   toValue: 1,
                   duration: 200,
                   useNativeDriver: true,
                 }),
                 Animated.timing(translateY, {
                   toValue: 0,
                   duration: 200,
                   useNativeDriver: true,
                 }),
               ]).start();
             });
           } else {
             Animated.parallel([
               Animated.timing(translateY, {
                 toValue: height,
                 duration: 200,
                 useNativeDriver: true,
               }),
               Animated.timing(fadeAnim, {
                 toValue: 0,
                 duration: 200,
                 useNativeDriver: true,
               }),
             ]).start(() => {
               setIsModalVisible(false);
               setGradientIndex(0);
             });
           }
         }, [visible]);
       
     
     
  return (
    <KeyboardAvoidingView behavior='none' >
    <Modal animationType="none" transparent={true} statusBarTranslucent={true} visible={isModalVisible} onRequestClose={handleCloseShareModal}>
           <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
               <Animated.View  style={[styles.modalContainer,{ opacity: fadeAnim }]}>
               
                <Animated.View style={{...styles.modalContent, transform: [{ translateY }], }}>
                <View style={styles.modalTitleContainer}>
        <Text style={styles.modalTitle}>{t("story.Crear")}</Text>
        <TouchableOpacity style={styles.modalClose}  onPress={handleCloseShareModal} >
        <AddIcon style={styles.modalCloseIcon} onPress={handleCloseShareModal}/>
        </TouchableOpacity>
        </View>
        <View style={styles.shotContainer}>
        <ViewShot style={styles.eventStoryContainer} ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
        <LinearGradient colors={gradients[gradientIndex]} style={styles.eventStoryContent}>
          <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.date, { color: textColors[gradientIndex] }]}>
 {evento.categoria === "aspectos" || evento.categoria === "retrogradaciones" ? evento.rango  : fechaFormateada}</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.title, { color: textColors[gradientIndex] }]}>{evento.title}</Text>
          {evento.signo && <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.info, { color: textColors[gradientIndex] }]}>{evento.signo}</Text>}
          {evento.detalles && <Text djustsFontSizeToFit style={[styles.details, { color: textColors[gradientIndex] }]}>{evento.detalles}</Text>}
          <Text style={[styles.linkText, { color: textColors[gradientIndex] }]}>@RastrosAstrologia</Text>
        </LinearGradient>
        </ViewShot></View>
        <Text style={styles.selectTitle}>{t("story.Fondo")}</Text>
        <View style={styles.buttonsContainer} pointerEvents="box-none">
        {gradients.map((gradient, index) => (
 <TouchableOpacity
 style={styles.buttonContainer}
 key={index}
 onPress={() => {
   setGradientIndex(index);
 }}
>
 <View>
   <LinearGradient
     colors={gradient}
     style={[
       styles.button,
       gradientIndex === index && styles.activeButton,
     ]}
   />
 </View>
</TouchableOpacity>
  ))}
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={shareImage}>
        <Text style={styles.shareText} onPress={shareImage}>{t("opciones.Compartir")}</Text>
      </TouchableOpacity>
             </Animated.View>
             
             </Animated.View></TouchableWithoutFeedback>
             
             </Modal></KeyboardAvoidingView>
   );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalContent: {
    width: wp('90%'),
    height: hp('87.5%'),
    marginHorizontal: 'auto',
    marginVertical: hp('3.75%'),
    justifyContent: 'space-between',
    gap: hp('2%')
  },
  shotContainer: {
    width: eventWidth,
    height: eventHeight,
    justifyContent: 'center',
    borderRadius: wp('6.25%'), // 25 de 400 (width) es 6.25%
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(30, 30, 30)',
    marginHorizontal: 'auto',
    overflow: 'hidden'
  },
  eventStoryContainer: {
    width: eventWidth,
    height: eventHeight,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(30, 30, 30)',
    marginHorizontal: 'auto',
  },
  eventStoryContent: {
    width: contentWidth,
    minHeight: contentHeight,
    marginHorizontal: 'auto',
    borderRadius: wp('3.75%'), // 15 de 400 (width) es 3.75%
    paddingTop: hp('2.5%'), // 20 de 800 (height) es 2.5%
    paddingBottom: hp('0.625%'), // 5 de 800 (height) es 0.625%
    gap: hp('0.25%'), // 2 de 800 (height) es 0.25%
  },
  title: {
    width: textWidth,
    marginHorizontal: 'auto',
    fontSize: RFValue(1.35 * 12), // Puedes ajustar la base de RFValue o multiplicar por la que ya tienes
    lineHeight: RFValue(1.66 * 12),
    color: 'white',
    fontFamily: 'Effra_Bold',
  },
  date: {
    width: textWidth,
    marginHorizontal: 'auto',
    textTransform: 'uppercase',
    fontSize: RFValue(0.8 * 12),
    color: 'white',
    fontFamily: 'Effra_Medium',
  },
  info: {
    width: textWidth,
    marginHorizontal: 'auto',
    fontSize: RFValue(0.85 * 12),
    color: 'white',
    textTransform: 'uppercase',
    lineHeight: RFValue(29), // Ajusta si 29 es un valor fijo o depende del tamaño de fuente
    fontFamily: 'Effra_Regular',
  },
  linkText: {
    width: textWidth,
    margin: 'auto',
    fontSize: RFValue(0.66 * 12),
    color: 'white',
    marginBottom: 0,
    lineHeight: RFValue(29),
    fontFamily: 'Effra_Regular',
  },
  details: {
    width: textWidth,
    marginHorizontal: 'auto',
    fontSize: RFValue(0.8 * 12),
    color: 'white',
    lineHeight: RFValue(1.12 * 12),
    fontFamily: 'Effra_Regular',
    marginTop: hp('1.25%'), // 10 de 800 (height) es 1.25%
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: wp('2.5%'), // 10 de 400 (width) es 2.5%
    marginHorizontal: 'auto'
  },
  buttonContainer: {
    zIndex: 1000,
    elevation: 10,
  },
  selectTitle: {
    marginHorizontal: 'auto',
    fontSize: RFValue(16),
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Effra_Light',
  },
  button: {
    width: hp('5.625%'), // 45 de 400 (width) es 11.25%
    height: hp('5.625%'), // 45 de 800 (height) es 5.625%
    borderRadius: wp('25%'), // Para que sea un círculo, el radio es la mitad del ancho/alto
  },
  activeButton: {
    borderRadius: wp('25%'),
    borderWidth: 3,
    borderColor: 'rgb(180, 180, 180)',
  },
  shareButton: {
    width: wp('37.5%'), // 150 de 400 (width) es 37.5%
    height: hp('4.375%'), // 35 de 800 (height) es 4.375%
    borderRadius: wp('25%'),
    backgroundColor: 'white',
    marginHorizontal: 'auto',
    zIndex: 2
  },
  shareText: {
    margin: 'auto',
    fontSize: RFValue(16),
    color: 'black',
    transform: [{ translateY: 1 }],
    textAlign: 'center',
    fontFamily: 'Effra_Regular',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  modalTitle: {
    color: 'white',
    fontFamily: 'Effra_Regular',
    fontSize: RFValue(30),
    marginVertical: 'auto',
  },
  modalClose: {
    width: wp('5%'), // 20 de 400 (width) es 5%
    height: hp('2.5%'), // 20 de 800 (height) es 2.5%
    marginVertical: 'auto',
    borderRadius: wp('12.5%'), // Para que sea un círculo
    backgroundColor: '#ffffff',
    zIndex: 5
  },
  modalCloseIcon: {
    width: wp('3.25%'), // 13 de 400 (width) es 3.25%
    height: hp('1.625%'), // 13 de 800 (height) es 1.625%
    margin: 'auto',
    fill: '#333333',
    transform: [{ rotate: '45deg' }]
  }
});
export default ShareEventModal;
