import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { View, TouchableWithoutFeedback, Text, ImageBackground, ActivityIndicator, Animated,TouchableOpacity,KeyboardAvoidingView,Keyboard, StyleSheet, PanResponder, Platform, Alert,Dimensions, Modal } from 'react-native';
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window'); 
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import { useUser } from '../contexts/UserContext';
import { getFirestore, doc, updateDoc } from '../config/firebaseConfig';
import Purchases from 'react-native-purchases';

const SolarPremiumModal = ({handleCloseSolarPremiumModal, visible}) => {
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

useEffect(() => {
  const fetchProductsInfo = async () => {
    try {
      const productIdentifiers = [
        'appstral.estelar:estelar-mensual',
        'appstral.solar:solar-mensual',
      ];
      const products = await Purchases.getProducts(productIdentifiers);

      if (products && products.length > 0) {
        const estelarProduct = products.find(
          p => p.identifier === 'appstral.estelar:estelar-mensual'
        );
        const solarProduct = products.find(
          p => p.identifier === 'appstral.solar:solar-mensual'
        );

        if (estelarProduct) {
          setEstelarPackage({ product: estelarProduct }); 
        }
        if (solarProduct) {
          setSolarPackage({ product: solarProduct }); 
        }
      }
    } catch (e) {
      console.log('Error fetching product info', e);
    }
  };

  fetchProductsInfo();
}, []);

const handlePurchase = async () => {
  try {
    const selectedPkg = selectedOption === 'estelar' ? estelarPackage : solarPackage;

    if (selectedPkg && selectedPkg.product) { 
      const purchaserInfo = await Purchases.purchaseProduct(selectedPkg.product.identifier);
    } else {
      console.warn("No se seleccionó un paquete válido para la compra.");
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
          handleCloseSolarPremiumModal();
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
       <Modal animationType="none" transparent={true} statusBarTranslucent={true} visible={isModalVisible} onRequestClose={handleCloseSolarPremiumModal}>
            <TouchableWithoutFeedback onPress={handleCloseSolarPremiumModal}>
                  <Animated.View  style={[styles.modalContainer,{ opacity: fadeAnim }]}>
                  
                   <Animated.View style={{...styles.modalSolarPremiumContent, transform: [{ translateY }], }} >
                     <View style={styles.modalPremiumSlider}/>
                   <View style={styles.premiumModal} {...panResponder.panHandlers}>
      <Text style={styles.modalPremiumTitle}>{t("pricing.solarTitle")}</Text>
      <Text style={styles.modalPremiumSubtitle}>{t("pricing.solarSubtitle")} <Text style={styles.modalPremiumSubtitleBold}>{t("pricing.solarSubtitleBold")}</Text></Text>

      <View style={styles.pricingOptions}>
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
          {t("pricing.EstelarDescription")}<Text style={{ fontFamily: 'Effra_Bold'}}>{t("pricing.EstelarDescriptionBold")}</Text>
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

export default SolarPremiumModal;
