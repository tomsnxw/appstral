import React, { useState, useRef, useEffect } from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal , Animated, Alert, Platform  } from 'react-native';
import AddIcon from '../../assets/icons/AddIcon';
import ViewShot, { captureRef } from 'react-native-view-shot';

import * as Sharing from 'expo-sharing';
import { useTranslation } from 'react-i18next';


const { height, width } = Dimensions.get('screen');
const viewShotWidth = width;
const viewShotHeight = (viewShotWidth * 16) / 9;

const eventWidth = viewShotWidth / 1.25;
const eventHeight = viewShotHeight / 1.25;
const contentWidth = viewShotWidth / 2;
const contentHeight = viewShotHeight / 2.4;
const textWidth = viewShotWidth / 2.5;
const baseFontSize = viewShotWidth * 0.03;


const ShareEventModal = ({ route, visible, handleCloseShareModal }) => {
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
        const fecha = new Intl.DateTimeFormat('es-ES', {
          day: '2-digit',
          month: 'long',
        }).format(new Date(evento.fecha));
      
        const hora = new Intl.DateTimeFormat('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
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
      
    
    

        if (!visible) return null;
         return (
<Modal
  key={visible ? 'open' : 'closed'} 
  animationType="slide"
  transparent={true}
  visible={visible}
  statusBarTranslucent={true}
  onRequestClose={handleCloseShareModal}
>

  <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
          {evento.detalles && <Text djustsFontSizeToFit numberOfLines={10}  style={[styles.details, { color: textColors[gradientIndex] }]}>{evento.detalles}</Text>}
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
      </TouchableOpacity></View>
      </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
  modalContainer: {
    width:width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', 
  },
  modalContent: {
    width:width*.9,
    height: height*.875,
    marginHorizontal: 'auto',
    marginTop: height*.0375,
    justifyContent: 'space-between',
  },
  shotContainer:{
    width: eventWidth,
    height: eventHeight,
    justifyContent: 'center',
    borderRadius: 25,
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
    height: contentHeight,
    marginHorizontal: 'auto',
    borderRadius: 15,
    paddingTop: 20,
    paddingBottom: 5,
    gap: 2,
  },
  title: {
    width: textWidth,
    marginHorizontal: 'auto',
    fontSize: baseFontSize * 1.35,
    lineHeight: baseFontSize * 1.66, 
    color: 'white',
    fontFamily: 'Effra_Bold',
  },
  date: {
    width: textWidth,
    marginHorizontal: 'auto',
    textTransform: 'uppercase',
    fontSize: baseFontSize,
    color: 'white',
    fontFamily: 'Effra_Medium',
  },
  info: {
    width: textWidth,
    marginHorizontal: 'auto',
    fontSize: baseFontSize,
    color: 'white',
    textTransform: 'uppercase',
    lineHeight: 29,
    fontFamily: 'Effra_Regular',
  },
  linkText: {
    width: textWidth,
    margin: 'auto',
    fontSize: baseFontSize * 0.66, 
    color: 'white',
    marginBottom: 0,
    lineHeight: 29,
    fontFamily: 'Effra_Regular',
  },
  details: {
    width: textWidth,
    marginHorizontal: 'auto',
    fontSize: baseFontSize * 0.93, 
    color: 'white',
    lineHeight: baseFontSize * 1.16, 
    fontFamily: 'Effra_Regular',
    marginTop: 5,
  },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginHorizontal:'auto'
    },
    buttonContainer: {
      zIndex: 1000,  
      elevation: 10, 
    },
    selectTitle: {
        marginHorizontal: 'auto',
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Effra_Light',
    },
    button:{
        width: 45,
        height: 45,
        borderRadius: 100,
    },
    activeButton: {
      borderWidth: 3,
      borderColor: 'rgb(180, 180, 180)',
    },
    shareButton: {
        width: 150,
        height: 35,
        borderRadius: 100,
        backgroundColor: 'white',
        marginHorizontal:'auto',
        zIndex: 2
    },
    shareText: {
        margin: 'auto',
        fontSize: 16,
        color: 'black',
        transform: [{translateY: 1}],
        textAlign: 'center',
        fontFamily: 'Effra_Regular',
    },
    modalTitleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems:'flex-end',
  },
    modalTitle: {
        color: 'white',
        fontFamily: 'Effra_Regular',
        fontSize: 30,
        marginVertical: 'auto',
    },
    modalClose:{
        width: 20,
        height: 20,
        marginVertical: 'auto',
        borderRadius: 100,
        backgroundColor: '#ffffff',
        zIndex: 5
    },
    modalCloseIcon:{
        width: 13,
        height: 13,
        margin: 'auto',
        fill: '#333333',
        transform: [{ rotate: '45deg' }]
    }
  });

export default ShareEventModal;
