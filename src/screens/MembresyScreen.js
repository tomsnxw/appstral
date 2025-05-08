import React, {useState,useEffect, useContext} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Linking } from 'react-native';
import BackArrowIcon from '../../assets/icons/BackArrowIcon'
import {LinearGradient} from 'expo-linear-gradient';
import colors from '../utils/colors';
import { useNavigation } from '@react-navigation/native';
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');
import { db, collection, getDocs } from '../config/firebaseConfig';
import { ThemeContext } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import MailModal from '../modals/MailModal';
import Purchases from 'react-native-purchases';
import ConfirmCancelModal from '../modals/ConfirmCancelModal';

const MembresyScreen = () => {
  const { userData, updateUser } = useUser();
  const navigation = useNavigation(); 
  const { theme } = useContext(ThemeContext);
  const [selectedOption, setSelectedOption] = useState("estelar"); 
  const { t, i18n  } = useTranslation();
    const [loading, setLoading] = useState(true);
  const [mainBenefit, setMainBenefit] = useState(null);
  const [otherBenefits, setOtherBenefits] = useState([]);
  const membresia = userData?.membresia; 
  const [offerings, setOfferings] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [estelarMonthly, setEstelarMonthly] = useState(null);
  const [solarMonthly, setSolarMonthly] = useState(null);
  const [chartPack, setChartPack] = useState(null);
  const [selectedOfferingIdentifier, setSelectedOfferingIdentifier] = useState('estelar.plan'); 
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [confirmCancelModalVisible, setConfirmCancelModalVisible] = useState(false);
  
  
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
  
    fetchOfferings();
  }, []); 
  
const handlePurchase = async () => {
  if (!selectedPackage) {
    console.warn("No se seleccionó un paquete válido para la compra. Intentando seleccionar Estelar por defecto.");
    if (estelarMonthly) {
      setSelectedPackage(estelarMonthly);
      setSelectedOfferingIdentifier('estelar.plan');
    } else {
      console.warn("No se encontró el paquete Estelar mensual. No se puede realizar la compra por defecto.");
      return;
    }
  }
  try {
    const purchaserInfo = await Purchases.purchasePackage(selectedPackage);
    console.log('Información de la compra:', purchaserInfo);

    // Check for entitlements, not subscription names. Use the correct entitlement IDs.
    if (purchaserInfo?.customerInfo?.entitlements?.active['premium_estelar']?.isActive) {
      updateUser({ premium: true, membresia: 'estelar' });
      
    } else if (purchaserInfo?.customerInfo?.entitlements?.active['premium_solar']?.isActive) {
      updateUser({ premium: true, membresia: 'solar' });
      
    } console.log("Identificador del paquete seleccionado:", selectedPackage?.identifier); // <-- AGREGAR ESTO
    if (selectedPackage?.identifier === 'chart.pack') {
      const transaction = purchaserInfo?.transaction;
      const quantity = transaction?.quantity || 1;
      console.log("Se detectó compra de chart.pack. Cantidad:", quantity); // <-- AGREGAR ESTO
      console.log("Valor actual de extraCharts antes de actualizar:", userData?.extraCharts); // <-- AGREGAR ESTO
      updateUser({ extraCharts: (userData?.extraCharts || 0) + (5 * quantity) });
      console.log("Valor esperado de extraCharts después de actualizar:", (userData?.extraCharts || 0) + (5 * quantity)); // <-- AGREGAR ESTO
      
    }
  } catch (e) {
    if (!e.userCancelled) {
      console.warn("Error al comprar", e);
    }
  }
};


  useEffect(() => {
    const fetchBenefits = async () => {
      if (!membresia) return;
  
      try {
        const itemsRef = collection(db, 'beneficios', membresia, 'items');
        const snapshot = await getDocs(itemsRef);
  
        const beneficios = snapshot.docs.map(doc => doc.data());
  
        const principal = beneficios.find(b => b.principal);
        const otros = beneficios.filter(b => !b.principal);
  
        setMainBenefit(principal);
        setOtherBenefits(otros);
      } catch (error) {
        console.error('Error al obtener beneficios:', error);
      }
    };
  
    fetchBenefits();
  }, [membresia]);

  return ( 
    <View style={styles(theme).membresyScreenContainer}>
    {!userData.premium ? ( 
      <ScrollView style={styles(theme).noMembresyScrollContainer}>
       
        <View style={styles(theme).noMembresyHeader}>
            <TouchableOpacity onPress={()=>navigation.goBack()} style={styles(theme).backArrow}>
        <BackArrowIcon style={{ width:13,
    height: 13,
    fill: theme.secondary}}/>
        </TouchableOpacity>
        <Text style={styles(theme).noMembresyTitle}>{t("profile.Membresia")}</Text>

        </View>

      <Text style={styles(theme).noMembresySectionTitle}>{t("membresy.nomemberTitle")}</Text>
      <Text style={styles(theme).noMembresySectionText}>{t("membresy.nomemberSubtitle")}</Text>
      <View style={styles(theme).pricingOptions}>
      <View style={styles(theme).optionSeparator}/>
      <TouchableOpacity
                    style={styles(theme).pricingOption}
                    onPress={() => {
                      setSelectedOfferingIdentifier('estelar.plan');
                      setSelectedPackage(estelarMonthly);
                    }}
                  >
                    <View style={[styles(theme).radioButton, selectedOfferingIdentifier === 'estelar.plan' && styles(theme).selectedPremiumButton]}>
                      {selectedOfferingIdentifier === 'estelar.plan' && <View style={styles(theme).innerCircle} />}
                    </View>
                    <View style={styles(theme).pricingInfo}>
                      <Text style={[styles(theme).pricingTitle, selectedOfferingIdentifier === 'estelar.plan' && styles(theme).selectedText]}>{t("pricing.EstelarTitle")}</Text>
                      <Text style={styles(theme).pricingDescription}>
                        {t("pricing.EstelarDescription")}<Text style={{ fontFamily: 'Effra_Bold' }}>{t("pricing.EstelarDescriptionBold")}</Text>
                      </Text></View>
                  </TouchableOpacity>
<View style={styles(theme).optionSeparator}/>
        {/* Miembro Solar */}
         <TouchableOpacity
                          style={styles(theme).pricingOption}
                          onPress={() => {
                            setSelectedOfferingIdentifier('solar.plan');
                            setSelectedPackage(solarMonthly);
                          }}
                        >
                          <View style={[styles(theme).radioButton, selectedOfferingIdentifier === 'solar.plan' && styles(theme).selectedPremiumButton]}>
                            {selectedOfferingIdentifier === 'solar.plan' && <View style={styles(theme).innerCircle} />}
                          </View>
                          <View style={styles(theme).pricingInfo}>
                            <Text style={[styles(theme).pricingTitle, selectedOfferingIdentifier === 'solar.plan' && styles(theme).selectedText]}>{t("pricing.SolarTitle")}</Text>
                            <Text style={styles(theme).pricingDescription}>
                              {t("pricing.SolarDescription")}
                            </Text></View>
                        </TouchableOpacity>
      </View>
      <Text style={styles(theme).noMembresyPackTitle}>{t("membresy.nomemberPack")}<Text style={styles(theme).noMembresyPackTitleBold}>{t("membresy.nomemberPackBold")}</Text></Text>
                  <TouchableOpacity
                    style={styles(theme).packPricingOption}
                    onPress={() => {
                      setSelectedOfferingIdentifier('chart.pack');
                      setSelectedPackage(chartPack);
                    }}
                  >
                    <View style={[styles(theme).radioButton, selectedOfferingIdentifier === 'chart.pack' && styles(theme).selectedPremiumButton]}>
                      {selectedOfferingIdentifier === 'chart.pack' && <View style={styles(theme).innerCircle} />}
                    </View>
                    <View style={styles(theme).pricingInfo}>
                      <Text style={[styles(theme).pricingTitle, selectedOfferingIdentifier === 'chart.pack' && styles(theme).selectedText]}>{t("pricing.PackTitle" || "Paquete de Charts")}</Text>
                      <Text style={styles(theme).pricingDescription}>
                        {t("pricing.PackDescription" || "Compra un paquete de charts")}
                      </Text></View>
                  </TouchableOpacity>
              <TouchableOpacity style={styles(theme).payButton} onPress={handlePurchase}><Text style={styles(theme).payButtonText}>{t("pricing.Pagar")}</Text></TouchableOpacity>
        
      <View style={styles(theme).scrollBottomSpace}></View>
    </ScrollView>
    
        ) : (
          <View style={styles(theme).membresyContainer}>
             
              <View style={styles(theme).membresyHeader}>
                  <TouchableOpacity onPress={()=>navigation.goBack()} style={styles(theme).backArrow}>
              <BackArrowIcon style={{ width:13,height: 13,fill: theme.secondary}}/>
              </TouchableOpacity>
              <Text style={styles(theme).membresyTitle}>{t("profile.Membresia")}</Text>
      
              </View>
      
              <Text style={styles(theme).membresySectionTitle}>
  {userData?.membresia === 'estelar' && t("membresy.estelarTitle")}
  {userData?.membresia === 'solar' && t("membresy.solarTitle")}
</Text>
            <Text style={styles(theme).membresySectionText}>{userData?.membresia === 'estelar' && t("membresy.estelarDescription")}{userData?.membresia === 'solar' && t("membresy.solarDescription")}</Text>
            <Text style={styles(theme).membresyPriceText}>{t("membresy.Price")}<Text style={styles(theme).membresyPriceTextBold}>{userData?.membresia === 'estelar' && t("membresy.estelarPriceBold")}{userData?.membresia === 'solar' && t("membresy.solarPriceBold")}</Text></Text>
            <View style={styles(theme).membresyClaimButtons}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles(theme).membresyClaimButton}><Text style={styles(theme).membresyClaimButtonText}>{t("membresy.reclamos")}</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => {setConfirmCancelModalVisible(true);}} style={styles(theme).membresyCancelButton}><Text style={styles(theme).membresyClaimButtonText}>{t("membresy.Cancelar")}</Text></TouchableOpacity>
            </View>     
            { i18n.language === 'es' && ( <Text style={styles(theme).benefitContainerTitle}>{userData?.membresia === 'solar' && "BENEFICIO SOLAR"}{userData?.membresia === 'estelar' && "BENEFICIO ESTELAR"}</Text>)}            
            { i18n.language === 'es' && (
           <ScrollView style={styles(theme).membresyScrollContainer}>
           <View style={styles(theme).BenefitOptionsContainer}>
             {mainBenefit && (
               <View style={styles(theme).firstBenefitContainer}>
                 <Text style={styles(theme).firstBenefitTitle}>{mainBenefit.descuento}</Text>
                 <Text style={styles(theme).firstBenefitText}>{mainBenefit.titulo}</Text>
                 <TouchableOpacity style={styles(theme).firstBenefitButton} onPress={() => Linking.openURL('https://www.instagram.com/rastros.astrologia/')}>
                   <Text style={styles(theme).firstBenefitButtonText}>¡Lo quiero!</Text>
                 </TouchableOpacity>
               </View>
             )}
         
             {otherBenefits.map((benefit, index) => (
               <TouchableOpacity key={index} style={styles(theme).otherBenefitContainer}>
                 <Text style={styles(theme).otherBenefitTitle}>{benefit.descuento}</Text>
                 <Text style={styles(theme).otherBenefitText}>{benefit.titulo}</Text>
               </TouchableOpacity>
             ))}
         
             <View style={styles(theme).scrollBenefitBottomSpace}></View>
           </View>
         </ScrollView>)}
            <View style={styles(theme).scrollBottomSpace}></View>
            <LinearGradient pointerEvents="none" colors={['transparent', theme.shadowBackground, theme.shadowBackground, theme.shadowBackground]} style={{  position: 'absolute',bottom: (height - wHeight) - height*0.035, left: 0,right: 0,height: (height - wHeight) + height*0.25 , zIndex: 1}}/>

          </View>
            
        )}
         <MailModal
        visible={modalVisible}
        t={t}
        onClose={() => setModalVisible(false)}
      />
         <ConfirmCancelModal
            visible={confirmCancelModalVisible}
            onCancel={() => setConfirmCancelModalVisible(false)}
          t={t}/>
      </View>
  );
};

const styles = (theme) => StyleSheet.create({

  BenefitOptionsContainer:{
    gap: 15
  },
  firstBenefitContainer:{
    borderColor: '#7EBCEC',
    borderWidth: 1,
    borderRadius: 35,
    justifyContent: 'center',
    marginRight: 15,
    paddingTop: 35,
    paddingBottom: 30,
    backgroundColor: theme.membresiaBeneficio
  },
  firstBenefitTitle:{
    marginHorizontal: 'auto',
    fontFamily: 'Effra_Light',
    fontSize: height*.06,
    lineHeight: height*.06,
    color: theme.black,
  },
  firstBenefitText:{
    marginHorizontal: 'auto',
    fontFamily: 'Effra_Light',
    textAlign: 'center',
    color: theme.black,
    fontSize: height*.03,
    lineHeight: height*.035,
  },
  firstBenefitButton:{
    backgroundColor: '#7EBCEC',
    textAlign: 'center',
    marginHorizontal: 'auto',
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 40
  },
  firstBenefitButtonText:{
    textAlign: 'center',
    margin: 'auto',
    fontSize: height*.02,
    lineHeight: height*.025,
    color: theme.alwaysWhite,
    fontFamily: 'Effra_Regular',
  },

  otherBenefitContainer:{
    borderColor: '#7EBCEC',
    borderWidth: 1,
    borderRadius: 35,
    marginRight: 15,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 25,
    backgroundColor: theme.membresiaBeneficio
  },
  otherBenefitTitle:{
    fontFamily: 'Effra_SemiBold',
    textAlign: 'left',
    fontSize: height*.025,
    color: '#7EBCEC',
  },
  otherBenefitText:{
    fontFamily: 'Effra_Light',
    textAlign: 'left',
    fontSize: height*.02,
    color: theme.black,
    lineHeight: height*.025,
  },


  benefitContainerTitle:{
    fontFamily: 'Effra_SemiBold',
    fontSize: height*.015,
    marginLeft: 40,
    color: '#7EBCEC',
    marginTop: 15
  },
  membresyClaimButtons:{
    flexDirection: 'row',
    marginLeft: 40,
    gap: 5,
    marginVertical: 10
  },
  membresyClaimButton:{
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderColor: '#7EBCEC',
    borderWidth: 1,
    backgroundColor: theme.membresiaBoton
  },
  membresyCancelButton:{
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderColor: theme.secondaryBorder,
    borderWidth: 1,
    backgroundColor: theme.membresiaCancel
  },
  membresyClaimButtonText:{
    fontSize: height*.0135,
    color: theme.alwaysWhite,
  },
  membresyScrollContainer: {
    marginLeft: 35,
    marginVertical: 10,
    marginBottom: 60

  },
  membresyContainer: {
  height: height,
  paddingLeft: 20,
  paddingTop: 40,
  backgroundColor: theme.background
  },
  scrollBottomSpace:{
    height: height*.2
  },
  scrollBenefitBottomSpace:{
    height: height*.1
  },
  membresyHeader:{
    flexDirection: 'row',
    gap: 12
  },
  backArrow:{
    backgroundColor: theme.grey,
    padding: 8,
    borderRadius: 100,
    borderWidth: .75,
    borderColor: theme.border,
  },
  backArrowIcon:{
    width:11,
    height: 11,
  },
  membresyTitle: {
   marginVertical: 'auto',
   fontFamily: 'Effra_Medium',
   fontSize: height*.022,
   color: theme.primary
  },
  membresySectionTitle: {
    marginLeft: 42,
    fontFamily: 'Effra_Medium',
   fontSize: height*.025,
   color: '#7EBCEC', 
   marginTop: 10
  },
  membresySectionText: {
    marginLeft: 42,
    marginTop: 7,
    fontFamily: 'Effra_Light',
    fontSize: height*.022,
   color: theme.primary,
   width: '80%'
  },
  membresyPriceText: {
    marginLeft: 42,
    marginTop: 7,
    fontFamily: 'Effra_Medium',
    fontSize: height*.018,
   color: theme.primary
  },
  membresyPriceTextBold: {
    marginLeft: 42,
    marginTop: 7,
    fontFamily: 'Effra_Bold',
    fontSize: height*.018,
   color: theme.primary
  },
  innerCircle: {
    width: height*.012, 
    height: height*.012,
    borderRadius: 50, 
    backgroundColor: '#7EBCEC', 
  },
  pricingOptions:{
    marginLeft: 42,
    gap: 10,
    marginVertical: 12
  },
  pricingOption:{
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  packPricingOption:{
    flexDirection: 'row',
    width: '100%',
    marginLeft: 42,
    gap: 10,
    marginVertical: 3
  },
  optionSeparator:{
  backgroundColor: theme.primaryBorder,
   height: 1
  },
  pricingTitle: {
    fontSize: height*0.02,
    fontFamily: 'Effra_Bold',
    color: theme.black,
  },
  pricingInfo: {
   gap: 3,
  },
  selectedText: {
    color:'#7EBCEC',
  },
  pricingDescription: {
    fontSize: height*0.015,
    lineHeight: height*0.02,
    fontFamily: 'Effra_Regular',
    maxWidth: '92.5%',
    flexWrap: 'wrap',
    color: theme.black,
  },
  payButton:{
    backgroundColor: theme.black,
    marginLeft: 42,
    marginRight: 15,
    marginVertical: 10
  },
  payButtonText:{
    color: theme.white,
    fontSize: height*0.02,
    textTransform: 'uppercase',
    margin:'auto',
    textAlign: 'center',
    fontFamily: 'Effra_Medium',
    paddingTop: 10 ,
    paddingBottom: 5 
  },
  radioButton: {
    width: height*.025, 
    height: height*.025,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: theme.grey,
    borderColor: theme.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5
  },
  selectedPremiumButton: {
    borderColor: '#7EBCEC',
  },
  membresyPackTitle:{
    fontSize: height*0.027,
    fontFamily: 'Effra_Light',
    color: theme.black,
    marginLeft: 42,
    maxWidth: '92.5%',
    flexWrap: 'wrap',
    marginVertical: 10
  },
  membresyPackTitleBold:{
    fontFamily: 'Effra_Bold',
  },





    noMembresyScrollContainer: {
        paddingLeft: 20,
        paddingTop: 40,
   
      },
      membresyScreenContainer: {
      marginBottom: 'auto',
      marginTop: 0,
      },
      scrollBottomSpace:{
        height: height*.2
      },
      noMembresyHeader:{
        flexDirection: 'row',
        gap: 12
      },
      backArrow:{
        backgroundColor: theme.grey,
        padding: 8,
        borderRadius: 100,
        borderWidth: .75,
        borderColor: theme.border,
      },
      backArrowIcon:{
        width:11,
        height: 11,
      },
      noMembresyTitle: {
       marginVertical: 'auto',
       fontFamily: 'Effra_Medium',
       fontSize: height*.022,
       color: theme.primary
      },
      noMembresySectionTitle: {
        marginLeft: 42,
        fontFamily: 'Effra_Bold',
       fontSize: height*.032,
       lineHeight: height*.035,
       color: theme.primary,
       marginVertical: 10,
      },
      noMembresySectionText: {
        marginLeft: 42,
        fontFamily: 'Effra_Light',
        fontSize: height*.022,
        color: theme.primary,
        width: width*.7, 
      },
      innerCircle: {
        width: height*.012, 
        height: height*.012,
        borderRadius: 50, 
        backgroundColor: '#7EBCEC', 
      },
      pricingOptions:{
        marginLeft: 42,
        gap: 10,
        marginVertical: 10,
      },
      pricingOption:{
        flexDirection: 'row',
        width: '100%',
        gap: 10,
      },
      packPricingOption:{
        flexDirection: 'row',
        width: '100%',
        marginLeft: 42,
        gap: 10,
        marginVertical: 3
      },
      optionSeparator:{
      backgroundColor: theme.primaryBorder,
       height: 1
      },
      pricingTitle: {
        fontSize: height*0.02,
        fontFamily: 'Effra_Bold',
        color: theme.black,
      },
      pricingInfo: {
       gap: 3,
      },
      selectedText: {
        color:'#7EBCEC',
      },
      pricingDescription: {
        fontSize: height*0.015,
        lineHeight: height*0.02,
        fontFamily: 'Effra_Regular',
        maxWidth: '92.5%',
        flexWrap: 'wrap',
        color: theme.black,
      },
      payButton:{
        backgroundColor: theme.black,
        marginLeft: 42,
        marginRight: 15,
        marginVertical: 10
      },
      payButtonText:{
        color: theme.white,
        fontSize: height*0.02,
        textTransform: 'uppercase',
        margin:'auto',
        textAlign: 'center',
        fontFamily: 'Effra_Medium',
        paddingTop: 10 ,
        paddingBottom: 5 
      },
      radioButton: {
        width: height*.025, 
        height: height*.025,
        borderRadius: 50,
        borderWidth: 1,
        backgroundColor: theme.grey,
        borderColor: theme.secondary,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5
      },
      selectedPremiumButton: {
        borderColor: '#7EBCEC',
      },
      noMembresyPackTitle:{
        fontSize: height*0.027,
        fontFamily: 'Effra_Light',
        color: theme.black,
        marginLeft: 42,
        maxWidth: '92.5%',
        flexWrap: 'wrap',
        marginVertical: 10
      },
      noMembresyPackTitleBold:{
        fontFamily: 'Effra_Bold',
      },
  });

export default MembresyScreen;
