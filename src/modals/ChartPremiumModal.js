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
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import { useUser } from '../contexts/UserContext';
import Purchases from 'react-native-purchases';
import { getFirestore, doc, updateDoc } from '../config/firebaseConfig';


const ChartPremiumModal = ({handleCloseChartPremiumModal, visible}) => {
  const [loading, setLoading] = useState(true);
    const { theme } = useContext(ThemeContext);
    const styles = createStyles(theme);
  const [translateY, setTranslateY] = useState(new Animated.Value(height));  
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [selectedOption, setSelectedOption] = useState("estelar"); 
  const { t, i18n  } = useTranslation();
  const [estelarPackage, setEstelarPackage] = useState(null);
  const [solarPackage, setSolarPackage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [chartPackProduct, setChartPackProduct] = useState(null); // Nuevo estado para el producto consumible

  useEffect(() => {
    const fetchProductsInfo = async () => {
      try {
        const productIdentifiers = [
          'appstral.estelar:estelar-mensual',
          'appstral.solar:solar-mensual',
          'chart.pack', 
        ];
        const products = await Purchases.getProducts(productIdentifiers);

        if (products && products.length > 0) {
          const estelarProduct = products.find(
            p => p.identifier === 'appstral.estelar:estelar-mensual'
          );
          const solarProduct = products.find(
            p => p.identifier === 'appstral.solar:solar-mensual'
          );
          const chartPack = products.find(p => p.identifier === 'chart.pack'); // Obtiene el producto consumible

          if (estelarProduct) {
            setEstelarPackage({ product: estelarProduct });
          }
          if (solarProduct) {
            setSolarPackage({ product: solarProduct });
          }
          if (chartPack) {
            setChartPackProduct(chartPack); // Guarda el producto consumible
          }
        }
      } catch (e) {
        console.log('Error fetching product info', e);
      } finally {
        setLoading(false); // Asegúrate de que loading se establezca en false incluso si hay un error
      }
    };

    fetchProductsInfo();
  }, []);

  const handlePurchase = async () => {
    try {
      let productIdToPurchase = null;
  
      if (selectedOption === 'estelar' && estelarPackage) {
        productIdToPurchase = estelarPackage.product.identifier;
      } else if (selectedOption === 'solar' && solarPackage) {
        productIdToPurchase = solarPackage.product.identifier;
      } else if (selectedOption === 'pack' && chartPackProduct) {
        productIdToPurchase = chartPackProduct.identifier;
      }
  
      if (productIdToPurchase) {
        const purchaserInfo = await Purchases.purchaseProduct(productIdToPurchase);
        console.log("Compra exitosa:", purchaserInfo);
  
        // Si la compra fue del "pack", actualiza Firebase
        if (selectedOption === 'pack' && userData && userData.user_id) {
          const db = getFirestore();
          const userRef = doc(db, 'users', userData.user_id);
  
          await updateDoc(userRef, {
            extraCharts: (userData.extraCharts || 0) + 5, // Suma 5 al valor existente o a 0 si no existe
          });
          console.log('Campo extraCharts actualizado en Firebase');
        }
        else if (selectedOption === 'estelar' || selectedOption === 'solar') {
       
          const activeEntitlements = purchaserInfo.entitlements.active;
          if (activeEntitlements['premium_estelar'] || activeEntitlements['premium_solar']) {
            console.log("Suscripción activa");
            const db = getFirestore();
            const userRef = doc(db, 'users', userData.user_id);
            const membership = activeEntitlements['premium_solar'] ? 'solar' : 'estelar';
            await updateDoc(userRef, {
              premium: true,
              membresia: membership,
            });
            console.log('Datos de suscripción actualizados en Firebase');
          }
        }
      } else {
        console.warn("No se seleccionó un producto válido para la compra.");
      }
    } catch (e) {
      if (!e.userCancelled) {
        console.warn("Error al comprar", e);
      }
    }
  };

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
          handleCloseChartPremiumModal();
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
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsModalVisible(false); 
        setSelectedOption("estelar");
      });
    }
  }, [visible]);
  
  
  return (
       <Modal animationType="none" transparent={true} statusBarTranslucent={true} visible={isModalVisible} onRequestClose={handleCloseChartPremiumModal}>
               <TouchableWithoutFeedback onPress={handleCloseChartPremiumModal}>
                  <Animated.View  style={[styles.modalPremiumContainer,{ opacity: fadeAnim }]}>
                  
                   <Animated.View style={{...styles.modalPremiumContent, transform: [{ translateY }], }} >
                     <View style={styles.modalPremiumSlider}/>
                   <View style={styles.premiumModal} {...panResponder.panHandlers}>
      <Text style={styles.modalPremiumTitle}>
        {t("pricing.chartTitle")}
      </Text>
      <Text style={styles.modalPremiumSubtitle}>
      {t("pricing.chartSubtitle")}
      </Text>

      <View style={styles.pricingOptions}>
        <TouchableOpacity
          style={styles.pricingOption}
          onPress={() => setSelectedOption("pack")}
        >
          <View style={[styles.radioButton,selectedOption === "pack" && styles.selectedPremiumButton]}>
            {selectedOption === "pack" && <View style={styles.innerCircle} />}
          </View>
          <View style={styles.pricingInfo}>
          <Text style={[styles.pricingTitle,selectedOption === "pack" && styles.selectedText]}>{t("pricing.PackTitle")}</Text>
          <Text style={styles.pricingDescription}>
          {t("pricing.PackDescription")}
          </Text></View>
        </TouchableOpacity>
<View style={styles.optionSeparator}/>
        {/* Miembro Estelar (Por defecto seleccionado) */}
        <TouchableOpacity
          style={styles.pricingOption}
          onPress={() => {
            setSelectedOption("estelar");
            setSelectedPackage(estelarPackage);
          }}
        >
          <View style={[styles.radioButton,selectedOption === "estelar" && styles.selectedPremiumButton]}>
            {selectedOption === "estelar" && <View style={styles.innerCircle} />}
          </View>
          <View style={styles.pricingInfo}>
          <Text style={[styles.pricingTitle,selectedOption === "estelar" && styles.selectedText]}>{t("pricing.EstelarTitle")}</Text>
          <Text style={styles.pricingDescription}>
          {t("pricing.EstelarDescription")}<Text style={styles.pricingDescriptionBold}>
          {t("pricing.EstelarDescriptionBold")}
          </Text>
          </Text></View>
        </TouchableOpacity>
<View style={styles.optionSeparator}/>
        {/* Miembro Solar */}
        <TouchableOpacity
          style={styles.pricingOption}
          onPress={() => {
            setSelectedOption("solar");
            setSelectedPackage(solarPackage);
          }}
        >
          <View style={[styles.radioButton,selectedOption === "solar" && styles.selectedPremiumButton]}>
            {selectedOption === "solar" && <View style={styles.innerCircle} />}
          </View>
          <View style={styles.pricingInfo}>
          <Text style={[styles.pricingTitle,selectedOption === "solar" && styles.selectedText]}>{t("pricing.SolarTitle")}</Text>
          <Text style={styles.pricingDescription}>
          {t("pricing.SolarDescription")}
          </Text></View>
        </TouchableOpacity>
      </View>
<TouchableOpacity style={styles.payButton} onPress={handlePurchase}>
  <Text style={styles.payButtonText}>{t("pricing.Pagar")}</Text>
</TouchableOpacity>
    </View>
                
                </Animated.View></Animated.View>
                </TouchableWithoutFeedback>
                </Modal>
  );
};


  
export default ChartPremiumModal;
