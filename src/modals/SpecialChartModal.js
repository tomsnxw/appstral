import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { View, TouchableWithoutFeedback, Text, ImageBackground, ActivityIndicator, Animated,TouchableOpacity,KeyboardAvoidingView,Keyboard, StyleSheet, PanResponder, Platform, Alert,Dimensions, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import { db, auth, collection, query, where, getDocs } from '../config/firebaseConfig';
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
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window'); 
import { useToast } from "../contexts/ToastContext";
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useTranslation } from 'react-i18next';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";

const SpecialChartModal = ({handleCloseSpecialChartModal, visible}) => {
  const { theme } = useContext(ThemeContext);
    const styles = createStyles(theme);
      const { t, i18n  } = useTranslation();
    
  const [cartaEspecial, setCartaEspecial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translateY, setTranslateY] = useState(new Animated.Value(height));  
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const storage = getStorage();
      const imageRef = ref(storage, "carta_especial.jpg");

      try {
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error("Error al obtener la imagen:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchImage();
  }, []);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 100) {
          handleCloseSpecialChartModal();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true
          }).start();
        }
      }
    })
  ).current;

    useEffect(() => {
      if (visible) {
        setIsModalVisible(true);
        requestAnimationFrame(() => {
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        });
      } else {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsModalVisible(false); 
        });
      }
    }, [visible]);
  
  
  const obtenerCartaEspecial = async () => {
    if (!auth.currentUser) {
      console.log("Usuario no autenticado");
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const cartasRef = collection(db, 'users', userId, 'cartas');
      
      const q = query(cartasRef, where("especial", "==", true));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const carta = querySnapshot.docs[0].data();
        setCartaEspecial(carta);
      } else {
        console.log("No se encontró la carta especial");
      }
    } catch (error) {
      console.error("Error al obtener la carta especial:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCartaEspecial();
  }, []);

    const renderTextWithBreaks = (text) => {
    if (!text) return null;
    const paragraphs = text.split('<br/>');
    return paragraphs.map((paragraph, index) => (
      <Text key={index} style={styles.specialDetails}>
        {paragraph}
      </Text>
    ));
  };

  return (
    <Modal animationType="none" transparent={true} statusBarTranslucent={true} visible={isModalVisible} onRequestClose={handleCloseSpecialChartModal}>
      <Animated.View style={[styles.modalSpecialChartContainer, { opacity: fadeAnim }]}>
        <Animated.View style={{ ...styles.modalSpecialChartContent, transform: [{ translateY }] }} >
          {cartaEspecial ? (
            <>
              <ImageBackground
                source={{ uri: imageUrl }}
                style={styles.specialChartBackgroundImage}
                {...panResponder.panHandlers}
              >
                <View style={styles.specialChartModalSlider} />

                <View style={styles.arrowSpecialChartContainer}>
                  <Text style={styles.arrowSpecialChartText}>{t('todayChart')}</Text>
                  <View style={styles.arrowSpecialChart} />
                </View>
                <View style={styles.specialTitleContainer}>
                  <Text style={styles.specialTitle}>
                    {cartaEspecial.nombre} {cartaEspecial.apellido}: {cartaEspecial[`title_${i18n.language}`]}
                  </Text>
                  <Text style={styles.specialSubtitle}>
                    {cartaEspecial[`subtitle_${i18n.language}`]}
                  </Text>
                </View>
              </ImageBackground>
              <ScrollView style={styles.specialDetailsContainer}>
                {renderTextWithBreaks(cartaEspecial[`body_${i18n.language}`])}
               <View style={{height:hp('25')}}></View>
              </ScrollView>
             
            </>
          ) : (
            <View style={{
              height: height,
              justifyContent: 'center', alignItems: 'center',
            }}>
              <ActivityIndicator size="large" color="#ab89e9" />
            </View>
          )}
           <LinearGradient pointerEvents="none" colors={['transparent', theme.shadowBackground, theme.shadowBackground, theme.shadowBackground]} style={{  position: 'absolute',bottom: 0, left: 0,right: 0, height: hp('10%'), zIndex: 1}}/>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default SpecialChartModal;
