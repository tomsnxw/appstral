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
  const { userData, updateUser } = useUser();
  const [translateY, setTranslateY] = useState(new Animated.Value(height));  
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [selectedOption, setSelectedOption] = useState("estelar"); 
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { t, i18n  } = useTranslation();
  const [offerings, setOfferings] = useState(null);
  const [estelarMonthly, setEstelarMonthly] = useState(null);
  const [solarMonthly, setSolarMonthly] = useState(null);
  const [chartPack, setChartPack] = useState(null);
  const [selectedOfferingIdentifier, setSelectedOfferingIdentifier] = useState('estelar.plan'); // Selección inicial

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
  const fetchOfferings = async () => {
    setLoading(true);
    try {
      const fetchedOfferings = await Purchases.getOfferings();
      console.log('Offerings obtenidos:', fetchedOfferings);
      setOfferings(fetchedOfferings);

      const estelarOffering = fetchedOfferings?.all['estelar.plan'];
      const solarOffering = fetchedOfferings?.all['solar.plan'];
      const chartOffering = fetchedOfferings?.all['chart.pack'];

      setEstelarMonthly(estelarOffering?.availablePackages.find(pkg => pkg.packageType === Purchases.PACKAGE_TYPE.MONTHLY) || null);
      setSolarMonthly(solarOffering?.availablePackages.find(pkg => pkg.packageType === Purchases.PACKAGE_TYPE.MONTHLY) || null);
      setChartPack(chartOffering?.availablePackages[0] || null);

      if (selectedOfferingIdentifier === 'estelar.plan' && estelarMonthly) {
        setSelectedPackage(estelarMonthly);
      } else if (selectedOfferingIdentifier === 'solar.plan' && solarMonthly) {
        setSelectedPackage(solarMonthly);
      } else if (selectedOfferingIdentifier === 'chart.pack' && chartPack) {
        setSelectedPackage(chartPack);
      }
    } catch (e) {
      console.log('Error al obtener los Offerings', e);
    } finally {
      setLoading(false);
    }
  };

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
      ]).start(() => {
        fetchOfferings(); 
      });
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
      setSelectedOfferingIdentifier('estelar.plan'); // Resetear selección al cerrar
      setEstelarMonthly(null);
      setSolarMonthly(null);
      setChartPack(null);
      setSelectedPackage(null);
    });
  }
}, [visible]);

const handlePurchase = async () => {
  if (!selectedPackage) {
    console.warn("No se seleccionó un paquete válido para la compra.");
    return;
  }
  try {
    const purchaserInfo = await Purchases.purchasePackage(selectedPackage);
    console.log('Información de la compra:', purchaserInfo);

    if (purchaserInfo?.customerInfo?.entitlements?.active['estelar.premium']?.isActive) {

      updateUser({ premium: true, membresia: 'estelar' });
      handleCloseSolarPremiumModal();
    } else if (purchaserInfo?.customerInfo?.entitlements?.active['solar.premium']?.isActive) {
      updateUser({ premium: true, membresia: 'solar' });
      handleCloseSolarPremiumModal();
    } else if (selectedPackage?.identifier === 'chart.pack') {
      const transaction = purchaserInfo?.latestTransaction;
      const quantity = transaction?.quantity || 1;

      updateUser({ extraCharts: (userData?.extraCharts || 0) + (5 * quantity) });
      handleCloseSolarPremiumModal();
    }
  } catch (e) {
    if (!e.userCancelled) {
      console.warn("Error al comprar", e);
    }
  }
};
  
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
                {estelarMonthly && (
                  <TouchableOpacity
                    style={styles.pricingOption}
                    onPress={() => {
                      setSelectedOfferingIdentifier('estelar.plan');
                      setSelectedPackage(estelarMonthly);
                    }}
                  >
                    <View style={[styles.radioButton, selectedOfferingIdentifier === 'estelar.plan' && styles.selectedPremiumButton]}>
                      {selectedOfferingIdentifier === 'estelar.plan' && <View style={styles.innerCircle} />}
                    </View>
                    <View style={styles.pricingInfo}>
                      <Text style={[styles.pricingTitle, selectedOfferingIdentifier === 'estelar.plan' && styles.selectedText]}>{t("pricing.EstelarTitle")}</Text>
                      <Text style={styles.pricingDescription}>
                        {t("pricing.EstelarDescription")}<Text style={{ fontFamily: 'Effra_Bold' }}>{t("pricing.EstelarDescriptionBold")}</Text>
                      </Text></View>
                  </TouchableOpacity>
                )}
                {solarMonthly && (
                  <View style={styles.optionSeparator} />
                )}
                {solarMonthly && (
                  <TouchableOpacity
                    style={styles.pricingOption}
                    onPress={() => {
                      setSelectedOfferingIdentifier('solar.plan');
                      setSelectedPackage(solarMonthly);
                    }}
                  >
                    <View style={[styles.radioButton, selectedOfferingIdentifier === 'solar.plan' && styles.selectedPremiumButton]}>
                      {selectedOfferingIdentifier === 'solar.plan' && <View style={styles.innerCircle} />}
                    </View>
                    <View style={styles.pricingInfo}>
                      <Text style={[styles.pricingTitle, selectedOfferingIdentifier === 'solar.plan' && styles.selectedText]}>{t("pricing.SolarTitle")}</Text>
                      <Text style={styles.pricingDescription}>
                        {t("pricing.SolarDescription")}
                      </Text></View>
                  </TouchableOpacity>
                )}
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
