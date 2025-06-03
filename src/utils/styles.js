import { StyleSheet, Dimensions } from 'react-native'; 
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize"; 
const { height, width } = Dimensions.get('screen'); 
const { height: wHeight, width: wWidth } = Dimensions.get('window');
export const createStyles = (theme) => {
  return StyleSheet.create({
    gradientBottom: {
      position: 'absolute',
      // Aquí estamos asumiendo un valor base para 'bottom' y 'height'
      // Ajusta estos porcentajes según cómo se vea bien en un dispositivo de referencia.
      // Por ejemplo, hp('X%') representa X% del alto de la pantalla.
      bottom: hp('-7%'), // Esto es un ajuste estimado. Si tu barra de estado + navegación es ~120px y quieres -55px de distancia
      left: 0,
      right: 0,
      height: hp('20%'), // Por ejemplo, 20% del alto de la pantalla
      zIndex: 1
    },
    homeGradientContainer:{
      height: height // 100% del alto de la pantalla
    },
    homeContainer:{
      height: height, // 100% del alto de la pantalla
      paddingTop: hp('0.5%') // 0.5% del alto de la pantalla
    },
    maskedView: {
      width: '100%',
      height: hp('5%'), // Ajustado a un porcentaje del alto
      justifyContent: 'center',
      alignItems: 'center',
    },
    welcomeName: {
      fontSize: RFValue(36), // Un tamaño base de 36pt, escalado automáticamente
      fontFamily: 'Effra_Regular',
      textAlign: 'center',
      backgroundColor: 'transparent',
    },
    skyStarsTop: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: hp('6.5%'), // 6.5% del alto de la pantalla
      height: hp('12%'), // Ajustado a un porcentaje del alto
      transform: [{translateX: wp('-2.5%')}, {scale: 0.97}], // translateX ajustado a porcentaje
      width: '100%',
    },
    skyStarsBottom: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: hp('0%'), // 0% del alto de la pantalla
      transform: [{ scaleX: -1 },{translateX: wp('0.5%')}, {scale: 0.95}], // translateX ajustado a porcentaje
      height: hp('12%'), // Ajustado a un porcentaje del alto
      width: '100%',
    },
    resultCircle:{
      justifyContent: 'center',
      alignSelf: 'center',
      height: wp('95%'), // 95% del ancho de la pantalla
      width: wp('95%'), // 95% del ancho de la pantalla
      marginVertical: hp('1.2%'), // Ajustado a porcentaje del alto
    },
    welcomeText:{
      fontSize: RFValue(14), // Tamaño base de 16pt, escalado automáticamente
      textAlign: 'center',
      fontFamily: 'Effra_Regular',
      color: theme.primary,
      lineHeight: RFValue(20), // LineHeight también escalado automáticamente
    },
    title: {
      fontFamily: 'Effra_Regular',
      fontSize: RFValue(24), // Tamaño base de 24pt, escalado automáticamente
      marginBottom: hp('2.5%'), // Ajustado a porcentaje del alto
    },
    homeResult: {
      borderRadius: 5,
    },
    homeResultList: {
      paddingLeft: wp('15%'), // 15% del ancho de la pantalla
    },
    homeResultListSpace:{
      height: hp('22.5%'), // 22.5% del alto de la pantalla
    },
    resetIcon:{
      width: hp('2%'), // 2% del alto de la pantalla
      height: hp('2%'), // 2% del alto de la pantalla
      margin: 'auto',
      fill: theme.secondary,
    },
    fechaButtons:{
      display: 'flex',
      flexDirection: 'row',
      gap: wp('1.5%'),
      marginVertical: hp('1.2%'),
      marginHorizontal: 'auto',
    },
    fechaButton:{
      backgroundColor: 'transparent',
      borderRadius: 100,
      elevation: 0,
      shadowColor: 'transparent',
      borderColor: theme.secondaryBorder,
      borderWidth: 1,
      width: hp('4.5%'),
      height: hp('4.5%'),
      // Estos ya están perfectos para centrar el contenido (el texto)
      justifyContent: 'center', // Centra verticalmente el contenido del botón
      alignItems: 'center',    // Centra horizontalmente el contenido del botón
    },
    fechaModo:{
      backgroundColor: 'transparent',
      borderRadius: 50,
      elevation: 0,
      width: hp('13%'),
      height: hp('4.5%'),
      shadowColor: 'transparent',
      borderColor: theme.secondaryBorder,
      borderWidth: 1,
      // Estos también están perfectos
      justifyContent: 'center', // Centra verticalmente el contenido del botón
      alignItems: 'center',    // Centra horizontalmente el contenido del botón
    },
    titleModoButton: {
      fontSize: RFValue(12),
      color: theme.secondary,
      fontFamily: 'Effra_Regular',
      textAlign: 'center',
      alignSelf: 'center',
    },
    titleButton: {
      fontSize: RFValue(14),
      color: theme.secondary,
      fontFamily: 'Effra_Light',
      textAlign: 'center',
      alignSelf: 'center', 
      paddingTop: RFValue(1.5)
    },
    fechaText: {
      textTransform: 'uppercase',
      textAlign: 'center',
      fontFamily: 'Effra_Regular',
      color: theme.primary,
      fontSize: RFValue(13),
      alignSelf: 'center',
    },

    switchSelector: {
      flexDirection: "row",
      marginHorizontal: 'auto',
      alignItems: "center",
      marginVertical: hp('1.2%') // 10px convertido a porcentaje del alto
    },
    switchOption: {
      flexDirection: "column",
      alignItems: "center",
      marginHorizontal: wp('2.5%'), // 10px convertido a porcentaje del ancho
      gap: hp('0.6%'), // 5px convertido a porcentaje del alto
      minWidth: wp('15%'), // width*.15 convertido a porcentaje del ancho
    },
    radioButton: {
      width: hp('3%'), // height*.025 convertido a porcentaje del alto
      height: hp('3%'), // height*.025 convertido a porcentaje del alto
      borderRadius: 50,
      borderWidth: 1,
      backgroundColor: theme.grey,
      borderColor: theme.secondary,
      justifyContent: "center",
      alignItems: "center",
    },
    innerSwitchCircle: {
      width: hp('1.3%'), // height*.011 convertido a porcentaje del alto
      height: hp('1.3%'), // height*.011 convertido a porcentaje del alto
      borderRadius: 50,
      backgroundColor: theme.border,
    },
    selectedRadio: {
      backgroundColor: "#007AFF",
    },
    switchText: {
      fontFamily: 'Effra_Regular',
      fontSize: RFValue(14), // height*.017 convertido a un valor base de RFValue
      color: theme.secondary,
    },
    changePasswordContainer: {
    },
    changePasswordForm: {
      overflow: 'hidden',
    },
    scrollContainer: {
      margin: '0 auto',
      marginTop: hp('0%'), // height*.125 convertido a hp
      height: hp('86%'), // height a hp
      width: wp('100%'),
    },
    inputProfileContainer: {
      borderBottomWidth: hp('0.04%'), // height*.000325 convertido a porcentaje del alto (valor muy pequeño)
      borderColor: theme.secondaryBorder,
      marginLeft: wp('12.5%'), // 50px convertido a porcentaje del ancho
    },
    profilePasswordInput: {
      color: theme.secondaryBorder,
      fontSize: RFValue(26), // 18px a RFValue
      fontFamily: 'Effra_Light',
    },
    changeButton: {
      color: theme.background,
      backgroundColor: theme.black,
      fontSize: RFValue(14), // 16px a RFValue
      fontFamily: 'Effra_Regular',
      width: wp('30%'), // 120px convertido a porcentaje del ancho
      textAlign: 'center',
      marginLeft: 'auto',
      marginRight: wp('5%'), // 20px convertido a porcentaje del ancho
      marginVertical: hp('1.8%'), // 15px convertido a porcentaje del alto
      paddingBottom: hp('0.8%'), // 7px convertido a porcentaje del alto
      paddingTop: hp('1.2%'), // 10px convertido a porcentaje del alto
      borderRadius: 100
    },
    profileButtonText: {
      color: theme.primary,
      fontSize: RFValue(14), // height*.02 convertido a un valor base de RFValue
      marginVertical: 'auto',
      fontFamily: 'Effra_Regular',
      marginLeft: wp('5%'), // 20px convertido a porcentaje del ancho
    },
    buttonPicker:{
      marginRight: 'auto',
      marginLeft: wp('10%'), // width*0.1 se mantuvo como porcentaje del ancho
      borderColor: theme.primaryBorder,
      width: wp('56%'), // 225px convertido a porcentaje del ancho
    },
    buttonPickerItem:{
      marginHorizontal: wp('5%'), // 20px convertido a porcentaje del ancho
      color: theme.secondaryBorder,
      fontSize: RFValue(14), // height*.02 convertido a un valor base de RFValue
      fontFamily: 'Effra_Light',
    },
    buttonRedText: {
      color: theme.red,
      fontSize: RFValue(14), // 18px a RFValue
      fontFamily: 'Effra_Regular',
      marginBottom: 0,
      marginLeft: wp('5%') // 20px convertido a porcentaje del ancho
    },
    ProfileNameContainer:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: wp('2.5%'), // 10px convertido a porcentaje del ancho
    },
    ProfileInfoContainer:{
      textAlign: 'center',
      marginHorizontal: 'auto',

      marginBottom: hp('3%'), // 25px convertido a porcentaje del alto
    },
    PremiumProfileInfoContainer:{
      marginBottom: 0
    },
    ProfileName:{
      marginHorizontal: 0,
      fontSize: RFValue(20), // height*.032 convertido a un valor base de RFValue
      fontFamily: 'Effra_Light',
      marginVertical: 'auto',
      color: theme.primary,
      maxWidth: wp('80%') // width*.8 se mantuvo como porcentaje del ancho
    },
    changeEmailText:{
      textAlign: 'center',
      marginVertical: 'auto',
      fontSize: RFValue(14), // 20px a RFValue
      textDecorationLine: 'none',
      fontFamily: 'Effra_Light',
      color: theme.primary
    },
    changeEmailInput:{
      textAlign: 'center',
      marginVertical: 'auto',
      fontSize: RFValue(16), // 19px a RFValue
      textDecorationLine: 'underline',
      fontFamily: 'Effra_Light',
      color: theme.primary
    },
    changeEmailInputIcon:{
      fontSize: RFValue(18), // 20px a RFValue
      marginVertical: 'auto',
      color:theme.secondary
    },
    changeEmailIcon:{
      width: wp('5%'), // 20px convertido a porcentaje del ancho
      marginBottom: hp('0.8%'), // 7px convertido a porcentaje del alto
      fill: theme.secondary
    },
    ProfileInfo:{
      textAlign: 'center',
      marginHorizontal: 'auto',
      fontSize: RFValue(14), // 18px a RFValue
      fontFamily: 'Effra_Regular',
      lineHeight: RFValue(20), // height*0.025 convertido a un valor base de RFValue
      color: theme.secondary,
    },
    PremiumInfo:{
      textAlign: 'center',
      marginHorizontal: 'auto',
      fontSize: RFValue(12), // height*0.017 convertido a un valor base de RFValue
      fontFamily: 'Effra_Regular',
      lineHeight: RFValue(12), // height*0.017 convertido a un valor base de RFValue
      color: theme.black,
      marginBottom: hp('1.2%') // 10px convertido a porcentaje del alto
    },
    profileEmailText:{
      flexDirection: 'row',
      margin: 'auto',
      gap: wp('2.5%') // 10px convertido a porcentaje del ancho
    },
    ProfileEmail:{
      textAlign: 'center',
      fontSize: RFValue(16), // 18px a RFValue
      fontFamily: 'Effra_Light',
      paddingTop: hp('1.8%'), // 15px convertido a porcentaje del alto
      paddingBottom: hp('0.9%'), // 7.5px convertido a porcentaje del alto
      color: theme.primary
    },
    modalTitle: {
      fontSize: RFValue(16), // 20px a RFValue
      color: '#f2f2f2',
      fontFamily: 'Effra_Regular',
      paddingVertical: hp('1.8%'), // 15px convertido a porcentaje del alto
      marginHorizontal: 'auto'
    },
    modalText: {
      fontSize: RFValue(15), // 15px a RFValue
      fontFamily: 'Effra_Regular',
      textAlign: "start",
      color: '#f2f2f2',
      paddingLeft: wp('2.5%') // 10px convertido a porcentaje del ancho
    },
    modalPickerContainer: {
    },
    modalPicker: {
      color: theme.secondary,
      fontFamily: 'Effra_Regular',
      marginVertical: 'auto',
      transform: [
        { translateY: hp('-1.2%') }, // -10px convertido a porcentaje del alto
      ],
    },
    modalView: {
      width: wp('100%'), // width se mantuvo como porcentaje del ancho
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: wp('5%'), // 20px convertido a porcentaje del ancho
    },
    modalDatePicker: {
      height: hp('3.6%'), // 30px convertido a porcentaje del alto
      backgroundColor: theme.background,
      marginTop: hp('0.6%'), // 5px convertido a porcentaje del alto
      marginBottom: hp('1.8%'), // 15px convertido a porcentaje del alto
      padding: 0,
      width: wp('90%'), // width*0.9 se mantuvo como porcentaje del ancho
      borderRadius: 20,
      borderWidth: 0.5,
      borderColor: theme.sheetBorder,
      fontFamily: 'Effra_Regular',
      fontSize: RFValue(14), // 14px a RFValue
      margin: 'auto'
    },
    modalTitleDatePicker: {
      color: theme.secondary,
      fontSize: RFValue(14), // 14px a RFValue
      fontFamily: 'Effra_Regular',
      padding: 0,
      margin: 0
    },
    modalButtonContainer: {
      borderRadius: 25,
      overflow: 'hidden',
      alignSelf: 'center'
    },
    modalButtonEditText: {
      fontSize: RFValue(15), // 15px a RFValue
      fontFamily: 'Effra_Regular',
      color: theme.alwaysWhite,
      transform: [
        { translateY: hp('0.12%') } // 1px convertido a porcentaje del alto
      ],
    },
    gradientBackground: {
      paddingVertical: hp('0.8%'), // 7px convertido a porcentaje del alto
      paddingHorizontal: wp('5%'), // 35px convertido a porcentaje del ancho
      borderRadius: 100,
      alignItems: 'center',
    },
    modalCloseButton: {
      backgroundColor: theme.red,
      width: hp('6%'), // 50px convertido a porcentaje del alto (para mantenerlo cuadrado)
      height: hp('6%'), // 50px convertido a porcentaje del alto
      marginTop: hp('1.8%'), // 15px convertido a porcentaje del alto
      borderRadius: 50,
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 'auto',
    },
    modalCloseButtonIcon: {
      fill: theme.alwaysWhite,
      width: wp('3%'), // 12px convertido a porcentaje del ancho
      height: hp('1.4%'), // 12px convertido a porcentaje del alto
      margin: 'auto',
      transform: [{ rotate: '45deg' }]
    },
    dropdownBox:{
      height: hp('5.5%'), // height*0.045 convertido a porcentaje del alto
      borderRadius: 20,
    },
    dropdownList:{
      position: 'absolute',
      top: hp('5%'), // height*0.04 convertido a porcentaje del alto
      width: wp('85%'), // width*0.85 se mantuvo como porcentaje del ancho
      alignSelf: 'center',
      maxHeight: hp('25%'), // height*0.2 convertido a porcentaje del alto
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ccc',
      elevation: 3,
      zIndex: 3
    },
    inputStyles:{
      color: '#999999',
      fontFamily: 'Effra_Regular',
      fontSize: RFValue(13), // height*0.016 convertido a un valor base de RFValue
      lineHeight: RFValue(14), // height*0.017 convertido a un valor base de RFValue
    },
    dropdownTextStyles:{
      color: '#999999',
      fontSize: RFValue(13), // height*0.016 convertido a un valor base de RFValue
      fontFamily: 'Effra_Regular',
    },
gradient: {
  ...StyleSheet.absoluteFillObject, 
},
homeWelcomeTitles:{
  width: '100%',
},

    myChartContainer: {
      margin: 'auto',
      marginTop: hp('12.5%'), // height*.125 convertido a hp
      height: hp('100%'), // height a hp
      width: wp('100%'), // width a wp
      backgroundColor: theme.background
    },
    chartResultList: {
      paddingLeft: wp('12%'), // width*0.15 a wp
    },
    resultCircle:{
      alignSelf: 'center',
    },
    ChartHeader:{
      width: wp('90%'), // width*.9 a wp
      margin: 'auto',
      paddingTop: hp('1.8%'), // 15px a hp
      marginTop: 0,
      gap: hp('0.9%') // 7.5px a hp
    },
    chartInfoSeparator:{
      height: hp('2.5%'), // 20px a hp
      width: wp('0.5%'), // 2px a wp
      backgroundColor: theme.primaryBorder,
    },
    chartTitle:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    chartOptions:{
      flexDirection: 'row',
      gap: wp('3.75%'), // 15px a wp
      marginVertical: 'auto'
    },
    ChartInfo:{
      margin: 'auto',
      width: wp('90%'), // width*.9 a wp
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingTop: hp('0.6%'), // 5px a hp
    },
    ChartInfoTime:{
      maxWidth: wp('25%'), // width*.25 a wp
      textAlign: 'center',
      fontSize: RFValue(12), // height*0.018 con la equivalencia de RFValue(20) para height*0.032
      fontFamily: 'Effra_Regular',
      color: theme.secondary,
    },
    skeletonContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: wp('3.75%'), // 15px a wp
      gap: wp('2.5%'), // 10px a wp
      borderRadius: 10,
    },
    remainingChartsText:{
      width: hp('3.2%'), // height*.026 a hp
      height: hp('3.2%'), // height*.026 a hp
      backgroundColor: theme.red, // Manteniendo color según original
      position: 'absolute',
      // Esto es una estimación. Ajusta según cómo se vea con la barra de navegación/gestos.
      bottom: hp('3%'),// (height - wHeight) + height * 0.2375 convertido a hp
      textAlign: 'center',
      fontFamily: 'Effra_Medium',
      color: theme.alwaysWhite,
      lineHeight: RFValue(24),
      fontSize: RFValue(12), // height*0.018 con la equivalencia de RFValue(20) para height*0.032
      borderRadius: 50,
      zIndex: 2,
      right: wp('-2%'), // width*0.42 a wp
      justifyContent: 'center'
    },
    skeletonCircle: {
      width: hp('6.5%'), // height*0.055 a hp
      height: hp('6.5%'), // height*0.055 a hp
      borderRadius: 25,
      backgroundColor: "#e6e6e6",
      marginTop: 0,
      margin: 'auto'
    },
    skeletonTextContainer: {
      flex: 1,
      marginBottom: hp('0.6%') // 5px a hp
    },
    skeletonLine: {
      height: hp('1.8%'), // 15px a hp
      backgroundColor: "#e6e6e6",
      borderRadius: 4,
      marginVertical: hp('0.6%'), // 5px a hp
    },
    modalOptionContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      justifyContent: 'flex-end',
    },
    modalOptionContent: {
      justifyContent: 'center',
      height: hp('39%'), // height*0.325 a hp
      justifyContent: 'flex-start',
      backgroundColor: theme.editSheet,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
    },
    modalOptionSlider: {
      justifyContent: 'center',
      height: hp('0.25%'), // 2px a hp
      marginVertical: hp('2.5%'), // 20px a hp
      width: wp('10%'), // width*0.1 a wp
      marginHorizontal: 'auto',
      backgroundColor: theme.secondaryBorder
    },
    myChartsContainer: {
      marginVertical: 'auto',
      marginBottom: 0,
      height: hp('88%'), // height*0.88 a hp
      backgroundColor: theme.background
    },
    chartContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: hp('1.2%'), // 10px a hp
      backgroundColor: theme.background,
    },
    scrollableChartContainer:{

    },
    chartInfoContainer:{
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginLeft: wp('5%'), // width*0.05 a wp
    },
    chartNameContainer:{
      flexDirection: 'row',
      gap: wp('1.5%'), // 6px a wp
      zIndex: 2,
      transform: [{translateX: -wp('5%')}] // -width*0.05 a -wp
    },
    chartName: {
      fontSize: RFValue(16), // height*.021 con la equivalencia de RFValue(20) para height*0.032
      fontFamily: 'Effra_Regular',
      color: theme.primary,
      width: wp('80%'), // width*0.8 a wp
    },
    chartText: {
      fontSize: RFValue(16), // height*.021 con la equivalencia de RFValue(20) para height*0.032
      fontFamily: 'Effra_Regular',
      color: theme.secondaryBorder
    },
    specialChartIconContainer:{
      marginRight: wp('4%'), // width*0.04 a wp
      width: wp('7%'), // width*0.07 a wp
      height: wp('7%'), // width*0.07 a wp
      justifyContent: 'center'
    },
    chartOptionsIconContainer:{
      marginRight: wp('4%'), // width*0.04 a wp
      width: wp('7%'), // width*0.07 a wp
      height: wp('7%'), // width*0.07 a wp
    },
    chartOptionsIcon:{
      width: wp('4%'), // width*0.04 a wp
      height: wp('4%'), // width*0.04 a wp
      margin: 'auto',
      fill: theme.secondary
    },
    specialChartIcon:{
      width: wp('5%'), // width*0.05 a wp
      height: wp('5%'), // width*0.05 a wp
      margin: 'auto',
      fill: '#6cbcf0',
    },
    option:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: RFValue(15), // 15px a RFValue
      padding: hp('1.35%'), // 11px a hp
      paddingHorizontal: wp('3.75%'), // 15px a wp
      marginVertical: hp('0.25%'), // 2px a hp
    },
    optionText:{
      fontSize: RFValue(16), // 16px a RFValue
      color: theme.primary,
      fontFamily: 'Effra_Medium',
    },
    optionDeleteText:{
      fontSize: RFValue(16), // 16px a RFValue
      color: theme.red,
      fontFamily: 'Effra_Medium',
    },
    chartsSeparator:{
      paddingVertical: hp('0.06%'), // height*.0005 a hp (valor muy pequeño)
      backgroundColor: theme.primaryBorder,
      marginLeft: wp('5%'), // width*0.05 a wp
    },
    separatorBar:{
      height: hp('0.125%'), // height*0.001 a hp
      backgroundColor: theme.primaryBorder,
      marginHorizontal: wp('3.75%') // 15px a wp
    },
    sortChartButtonsContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
    },
    sortChartButtons:{
      height: hp('5%'),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: wp('3%'),
      backgroundColor: theme.background,
    },
    sortChartButton: {
      height: hp('3%'),
      borderColor: theme.secondary,
      width: 'auto',
      backgroundColor: theme.background,
      paddingHorizontal: wp('6.25%'),
      borderRadius: 100,
      borderWidth: 1,
      paddingBottom: hp(.1),
      justifyContent: 'center',
      alignItems: 'center',  
    },
    activeSortChartButton: {
      backgroundColor: theme.black,
      borderColor: theme.black,
    },
    sortChartbuttonText: {
      color: theme.primary,
      fontFamily: 'Effra_Regular',
      fontSize: RFValue(12),
      textAlign: 'center',
    },
    activeSortChartButtonText: {
      color: theme.background,
      fontFamily: 'Effra_Regular',
      fontSize: RFValue(12),
      textAlign: 'center', 
    },
    optionsContainer:{
      backgroundColor: theme.background,
      marginHorizontal: wp('3.75%'), // 15px a wp
      borderRadius: 20,
    },
    AddChartModalButtonIconContainer: {
      width: '100%', // 50px a hp
      height: '100%',
    },
    AddChartModalButtonIcon: {
      fill: theme.alwaysWhite,
      width:  hp('1.5%'),
      height: hp('1.5%'), // 12px a hp
      margin: 'auto'
    },
    noChartsContainer:{
      flex: 1,
      textAlign: 'center',
      gap: hp('3%'), // 25px a hp
      paddingTop: hp('21%'), // height*0.21 a hp
    },
    noChartsText:{
      textAlign: 'center',
      fontFamily: 'Effra_Light',
      fontSize: RFValue(25), // height*0.04 con la equivalencia de RFValue(20) para height*0.032
      color: theme.secondaryBorder
    },
    noChartsIcon: {
      width: wp('40%'), // width*0.4 a wp
      height: wp('40%'), // width*0.4 a wp
      marginHorizontal: 'auto',
      textAlign: 'center',
      fill: theme.secondaryBorder
    },
    chartFooter:{
      height: hp('40%'), // height*0.4 a hp
    },
  chartDetailsContainer: {
      margin: 'auto',
      marginTop: hp('12.5%'), // height*.125 convertido a hp
      height: hp('100%'), // height a hp
      width: wp('100%'), // width a wp
      backgroundColor: theme.background
  },
  specialChartDetailsHeader: {
    width: wp('90%'), // width*.9 a wp
    margin: 'auto',
    paddingTop: hp('2.125%'), // 17px a hp
    marginTop: 0,
    gap: hp('1.25%'), // 10px a hp
  },
  ChartDetailsHeader: {
    width: wp('90%'), // width*.9 a wp
    margin: 'auto',
    paddingTop: hp('2.125%'), // 17px a hp
    marginTop: 0,
    gap: hp('1.25%'), // 10px a hp
  },
  chartTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ChartTitleText: {
    maxWidth: wp('60%'), // width*.6 a wp
    color: theme.black,
    fontSize: RFValue(20), // height*0.025 con la equivalencia de RFValue(20)
    textAlign: 'left',
    fontFamily: 'Effra_Regular',
    alignContent: 'center',
    alignItems: 'center',
  },
  specialChartOptions: {
    flexDirection: 'row',
    gap: wp('3.75%'), // 15px a wp
    margin: 0,
    marginVertical: 'auto',
  },
  chartOptions: {
    flexDirection: 'row',
    gap: wp('3.75%'), // 15px a wp
    marginVertical: 'auto',
  },
  specialChartTitleText: {
    maxWidth: wp('60%'), // width*.6 a wp
    color: theme.black,
    fontSize: RFValue(20), // height*0.025 con la equivalencia de RFValue(20)
    textAlign: 'left',
    fontFamily: 'Effra_Regular',
  },
  chartResultList: {
    paddingLeft: wp('15%'), // width*0.15 a wp
  },
  ChartInfo: {
    margin: 'auto',
    width: wp('92%'), // width*.92 a wp
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  specialChartInfo: {
    margin: 'auto',
    width: wp('80%'), // width*.8 a wp
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  ChartInfoText: {
    minWidth: wp('20%'), // width*.2 a wp
    maxWidth: wp('30%'), // width*.3 a wp
    textAlign: 'left',
    fontSize: RFValue(12), // height*0.018 con la equivalencia de RFValue(12)
    fontFamily: 'Effra_Regular',
    color: theme.secondary,
  },
  ChartInfoTime: {
    maxWidth: wp('25%'), // width*.25 a wp
    textAlign: 'center',
    fontSize: RFValue(12), // height*0.018 con la equivalencia de RFValue(12)
    fontFamily: 'Effra_Regular',
    color: theme.secondary,
  },
  chartResultListSpace: {
    height: hp('30%'), // height*0.325 a hp
  },

  policyScrollContainer: {
    paddingHorizontal: wp('5%'), // 20px a wp
    paddingVertical: hp('3%'), // 40px a hp
  },
  policyContainer: {
    height: hp('100%'), // height a hp
    marginBottom: 0,
    marginTop: 'auto',
    backgroundColor: theme.background,
    flexDirection: 'row',
  },
  scrollBottomSpace: {
    height: hp('45%'), // height*.45 a hp
  },
  policyHeader: {
    paddingLeft: wp('5%'), // 20px a wp
    paddingVertical: hp('3%'), // 40px a hp
  },
  backArrow: {
    backgroundColor: theme.grey,
    padding: wp('2%'), // 8px a wp
    borderRadius: 100, // Se mantiene, ya que es un valor absoluto para un círculo
    borderWidth: 0.75, // Se mantiene, ya que es un valor absoluto para el grosor del borde
    borderColor: theme.border,
  },
  backArrowIcon: {
    width: wp('2.75%'), // 11px a wp (aproximado)
    height: hp('1.375%'), // 11px a hp (aproximado)
  },
  policyTitle: {
    marginVertical: 'auto',
    fontFamily: 'Effra_Medium',
    fontSize: RFValue(16), // 20px a RFValue
    color: theme.primary,
    marginBottom: hp('1.25%'), // 10px a hp
  },
  policySectionTitle: {
    fontFamily: 'Effra_Bold',
    fontSize: RFValue(14), // 16px a RFValue
    color: theme.primary,
    marginVertical: hp('1.875%'), // 15px a hp
  },
  policySectionText: {
    fontFamily: 'Effra_Regular',
    fontSize: RFValue(14), // 16px a RFValue
    color: theme.primary,
  },
  calculateContainer: {
    height: hp('100%'), // height to hp
    backgroundColor: theme.background,

  },
  calculateForm: {
    justifyContent: 'space-between',
    gap: hp('3%'), // 15px to hp
    marginHorizontal: 'auto',
    marginTop: hp('3%'),
    paddingBottom: hp('5%'), // height*0.1 to hp
  },
  calculateFormTitle: {
    fontSize: wp('10%'), // width*.1 to wp
    maxWidth: wp('70%'), // width*.7 to wp
    color: theme.primary,
    fontFamily: 'Effra_Light',
    paddingVertical: hp('1.875%'), // 15px to hp
    textAlign: 'center',
    marginHorizontal: 'auto',
  },
  calculateText: {
    fontSize: RFValue(12), // height*0.015, assuming RFValue(12) works well for this size
    fontFamily: 'Effra_Regular',
    textAlign: 'start',
    color: theme.secondary,
    paddingLeft: wp('2.5%'), // 10px to wp
  },
  inputContainer: {
    height: RFValue(32),
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.secondary,
    borderRadius: RFValue(50),
    paddingHorizontal: wp('4%'),
    justifyContent: 'space-between',
    alignItems:'center'
  },
  focusedBorder: {
    borderWidth: 1, // Keep fixed
    borderColor: theme.black,
  },
  defaultBorder: {
    borderWidth: 1, // Keep fixed
    borderColor: theme.secondary,
  },
  focusedText: {
    color: theme.black,
  },
  defaultText: {
    color: theme.secondary,
  },
  CalculateInput: {
    borderRadius: RFValue(20),
    textAlign: 'left',
    height: RFValue(36),
    color: '#808080',
    fontSize: RFValue(13),
    fontFamily: 'Effra_Regular',
    width: '90%',
  },
  inputDateTime: {
    display:'flex',
    fontSize: RFValue(12), 
    height: RFValue(32),
    fontFamily: 'Effra_Regular',
    marginHorizontal: 'auto',
    textAlign:'center',
    color: theme.secondary,
    paddingHorizontal: wp('25%'),
  },
  dropdownBox: {
    borderBottomRightRadius: 20, // Keep fixed
    borderBottomLeftRadius: 20, // Keep fixed
    borderWidth: 1, // Keep fixed
    marginTop: hp('1.875%'), // 15px to hp
    marginHorizontal: wp('2.5%'), // 10px to wp
    borderColor: theme.secondary,
    backgroundColor: theme.background,
    color: theme.secondary,
    fontSize: RFValue(13), // 16px to RFValue
    fontFamily: 'Effra_Regular',
  },
  dropdownList: {
    width: wp('83%'), // width*.83 to wp
    alignSelf: 'center',
    maxHeight: hp('15%'), // height*0.15 to hp
    borderWidth: 1, // Keep fixed
    borderColor: theme.secondary,
    borderRadius: 0, // Keep fixed
    borderBottomLeftRadius: 20, // Keep fixed
    borderBottomRightRadius: 20, // Keep fixed
  },
  inputStyles: {
    color: theme.secondary,
    fontFamily: 'Effra_Regular',
    fontSize: RFValue(13), // height*0.016, assuming RFValue(13) works well for this size
    lineHeight: hp('2.125%'), // height*0.017 to hp
  },
  dropdownTextStyles: {
    color: theme.secondary,
    fontSize: RFValue(13), // height*0.016, assuming RFValue(13) works well for this size
    fontFamily: 'Effra_Regular',
    paddingHorizontal: wp('5%'), // 20px to wp
    paddingTop: hp('1.25%'), // 10px to hp
    paddingBottom: hp('0.625%'), // 5px to hp
  },
  searchTextInputStyles: {
    color: 'red', // Keep fixed
    fontSize: RFValue(13), // height*0.016, assuming RFValue(13) works well for this size
    fontFamily: 'Effra_Regular',
  },
  titleDatePicker: {
    color: theme.secondary,
    fontSize: RFValue(13), // height*0.016, assuming RFValue(13) works well for this size
    fontFamily: 'Effra_Regular',
    padding: 0, // Keep fixed
    margin: 0, // Keep fixed
  },
  calculateButtonContainer: {
    borderRadius: 25, // Se mantiene fijo
    overflow: 'hidden', // Se mantiene fijo
    alignSelf: 'center',
    width: wp('30%'), // width*0.3 a wp
    height: hp('4.5%'), // height*0.04 a hp
  },
  gradientBackground: {
    paddingVertical: hp('0.875%'), // 7px to hp
    paddingHorizontal: wp('11.25%'), // 45px to wp
    width: wp('30%'), // width*0.3 to wp
    height: hp('4.5%'), // height*0.04 to hp
    borderRadius: 100, // Keep fixed
    alignItems: 'center',
  },
  progressContainer: {
    ...StyleSheet.absoluteFillObject, // Keep as is, it's a utility
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute', // Keep fixed
    left: 0, // Keep fixed
    height: '100%', // Keep fixed
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Keep fixed
  },
  calculateButtonText: {
    fontSize: RFValue(14),
    marginBottom: RFValue(2),
    fontFamily: 'Effra_Regular',
    color: theme.alwaysWhite,
    zIndex: 5,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    paddingBottom: hp('1.25%'),
    paddingTop: hp('.5%'),
    justifyContent: 'space-between',
  },
  chartOptions: {
    flexDirection: 'row',
    gap: wp('3.75%'), // 15px a wp
    marginVertical: 'auto',
  },
  chartInfoSeparator: {
    height: hp('2.5%'), // 20px a hp
    width: wp('0.5%'), // 2px a wp
    backgroundColor: theme.primaryBorder,
  },
  chartResultList: {
    paddingLeft: wp('12.5%'), // width*0.125 a wp
  },
  ChartInfo: {
    margin: 'auto',
    width: wp('90%'), // width*.9 a wp
    paddingTop: hp('0.6%'), // 5px a hp
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  ChartInfoTime: {
    maxWidth: wp('25%'), // width*.25 a wp
    textAlign: 'center',
    fontSize: RFValue(12), // height*0.018 con la equivalencia de RFValue(12)
    fontFamily: 'Effra_Regular',
    color: theme.secondary,
  },
  resultCircle: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: wp('95%'), // width * 0.95 a wp
    width: wp('95%'), // width * 0.95 a wp
    marginVertical: hp('1.25%'), // 10px a hp
  },

  // addchart //
  toastContainer: {
    position: 'absolute',
    top: hp('6.25%'), // 50px a hp
    left: wp('5%'), // width*0.05 a wp
    right: wp('5%'), // width*0.05 a wp
    height: wp('17%'), // width*0.17 a wp
    backgroundColor: '#333333',
    paddingVertical: hp('1.25%'), // height*0.01 a hp
    paddingHorizontal: hp('2.5%'), // height*0.02 a hp
    borderRadius: 15, // Se mantiene fijo
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5, // Se mantiene fijo para sombra Android
    shadowColor: '#000', // Se mantiene fijo
    shadowOpacity: 0.3, // Se mantiene fijo
    shadowOffset: { width: 2, height: 2 }, // Se mantiene fijo
    gap: hp('1.875%'), // 15px a hp
    zIndex: 1000, // Se mantiene fijo
  },
  icon: {
    width: hp('3.75%'), // height*0.03 a hp
    height: hp('3.75%'), // height*0.03 a hp
    fill: 'white', // Se mantiene fijo
    marginVertical: 'auto',
    marginHorizontal: 0,
  },
  toastText: {
    color: theme.alwaysWhite,
    fontSize: RFValue(12), // height*0.018 con la equivalencia de RFValue(12)
    lineHeight: hp('2.75%'), // height*0.022 a hp
    flexShrink: 1, // Se mantiene fijo
    marginVertical: 'auto',
    marginLeft: 0,
    marginRight: 'auto',
    fontFamily: 'Effra_Light',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 25, // Se mantiene fijo
    borderTopRightRadius: 25, // Se mantiene fijo
    flex: 1,
    maxHeight: hp('87%'), // height*0.8 a hp
  },
  modalForm: {
    justifyContent: 'center',
    alignSelf: 'center',
    gap: hp('1.875%'), // height*0.015 a hp
    width: wp('90%'), // width*0.9 a wp
  },
  modalSlider: {
    justifyContent: 'center',
    height: 2, // Se mantiene fijo
    marginTop: hp('2.5%'), // 20px a hp
    marginBottom: hp('0.625%'), // 5px a hp
    width: wp('10%'), // width*0.1 a wp
    marginHorizontal: 'auto',
    backgroundColor: theme.alwaysWhite,
  },
  modalTitle: {
    fontSize: RFValue(20), // 20px a RFValue
    color: '#f2f2f2',
    fontFamily: 'Effra_Regular',
    paddingVertical: hp('1.875%'), // 15px a hp
    marginHorizontal: 'auto',
  },
  modalText: {
    fontSize: RFValue(13), // 15px a RFValue
    fontFamily: 'Effra_Regular',
    textAlign: 'start',
    color: '#f2f2f2',
    paddingLeft: wp('2.5%'), // 10px a wp
  },
  modalInput: {
    paddingHorizontal: wp('5%'),
    borderRadius: RFValue(20),
    textAlign: 'left',
    height: RFValue(36),
    borderWidth: 1,
    borderColor: theme.sheetBorder,
    backgroundColor: theme.background,
    color: theme.secondary,
    fontSize: RFValue(13),
    fontFamily: 'Effra_Regular',
  },
  modalDateTimeInput: {
    display:'flex',
    fontSize: RFValue(12), 
    height: RFValue(36),
    fontFamily: 'Effra_Regular',
    marginHorizontal: 'auto',
    textAlign:'center',
    borderColor: theme.sheetBorder,
    backgroundColor: theme.background,
    color: theme.secondary,
    borderWidth: 1,
        borderRadius: RFValue(20),
    width:'100%'
  },
  input: {
    height: RFValue(32), 
    borderRadius: RFValue(20),
    borderColor: theme.sheetBorder,
    color: theme.secondary,
    fontSize: RFValue(13), 
    fontFamily: 'Effra_Regular',

  },
  modalPickerContainer: {
    // No hay cambios aquí ya que no hay propiedades fijas que necesiten conversión.
  },
  modalPicker: {
    color: theme.secondary,
    fontFamily: 'Effra_Regular',
    marginVertical: 'auto',
  },
  modalView: {
    width: wp('100%'), // width a wp
    borderTopLeftRadius: 30, // Se mantiene fijo
    borderTopRightRadius: 30, // Se mantiene fijo
    paddingHorizontal: wp('5%'), // 20px a wp
  },
  modalDatePicker: {
    height: hp('4.5%'), // height*0.045 a hp
    backgroundColor: theme.background,
    padding: 0, // Se mantiene fijo
    width: wp('90%'), // width*0.9 a wp
    borderRadius: 20, // Se mantiene fijo
    borderWidth: 0.5, // Se mantiene fijo
    borderColor: theme.sheetBorder,
    fontFamily: 'Effra_Regular',
    fontSize: RFValue(12), // 14px a RFValue
    margin: 'auto',
  },
  modalTitleDatePicker: {
    color: theme.secondary,
    fontSize: RFValue(12), // 14px a RFValue
    fontFamily: 'Effra_Regular',
    padding: 0, // Se mantiene fijo
    margin: 0, // Se mantiene fijo
  },
  modalButtonContainer: {
    borderRadius: 100, // Se mantiene fijo
    overflow: 'hidden', // Se mantiene fijo
    alignSelf: 'center',
    width: wp('30%'), // width*0.3 a wp
    height: hp('4%'),
    backgroundColor:'red'
  },
  modalButtonEditText: {
    fontSize: RFValue(13),
    fontFamily: 'Effra_Regular',
    color: theme.alwaysWhite,
        marginBottom: RFValue(2),

    zIndex: 5,
  },
  gradientBackground: {
    paddingVertical: hp('0.875%'), // 7px to hp
    paddingHorizontal: wp('11.25%'), // 45px to wp
    width: wp('30%'), // width*0.3 to wp
    height: hp('4%'), // height*0.04 to hp
    borderRadius: 100, // Keep fixed
    alignItems: 'center',
  },
  progressContainer: {
    ...StyleSheet.absoluteFillObject, // Se mantiene fijo
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute', // Se mantiene fijo
    left: 0, // Se mantiene fijo
    height: '100%', // Se mantiene fijo
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Se mantiene fijo
  },
  modalCloseButton: {
    backgroundColor: theme.red,
    width: hp('6%'), // 50px a hp
    height: hp('6%'), // 50px a hp
    borderRadius: 50, // Se mantiene fijo
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 'auto',
    marginBottom: hp('10%'), // height*0.1 a hp
  },
  modalCloseButtonIcon: {
    fill: theme.alwaysWhite,
    width: hp('1.5%'), // 12px a hp
    height: hp('1.5%'), // 12px a hp
    margin: 'auto',
    transform: [{ rotate: '45deg' }], // Se mantiene fijo
  },
  dropdownBox: {
    borderBottomRightRadius: 20, // Se mantiene fijo
    borderBottomLeftRadius: 20, // Se mantiene fijo
    borderWidth: 1, // Se mantiene fijo
    marginTop: hp('1.875%'), // 15px a hp
    marginHorizontal: wp('2.5%'), // 10px a wp
    borderColor: theme.secondary,
    backgroundColor: theme.background,
    color: theme.secondary,
    fontSize: RFValue(13), // 16px a RFValue
    fontFamily: 'Effra_Regular',
  },
  dropdownList: {
    width: wp('83%'), // width*.83 a wp
    alignSelf: 'center',
    maxHeight: hp('25%'), // height*0.2 a hp
    borderWidth: 1, // Se mantiene fijo
    borderColor: theme.secondary,
    borderRadius: 0, // Se mantiene fijo
    borderBottomLeftRadius: 20, // Se mantiene fijo
    borderBottomRightRadius: 20, // Se mantiene fijo
  },
  inputStyles: {
    color: theme.secondary,
    fontFamily: 'Effra_Regular',
    fontSize: RFValue(13), // height*0.016 con la equivalencia de RFValue(13)
    lineHeight: hp('2.125%'), // height*0.017 a hp
  },
  dropdownTextStyles: {
    color: theme.secondary,
    fontSize: RFValue(13), // height*0.016 con la equivalencia de RFValue(13)
    fontFamily: 'Effra_Regular',
    paddingHorizontal: wp('3.75%'), // 15px a wp
    paddingVertical: hp('0.625%'), // 5px a hp
  },
          // glosario
    searchBarContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 1,
      top: hp(5), // height*.022
      height: hp(9), // height*.09
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'red',
    },
    searchBar: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignContent: 'center',
      gap: wp(1.2), // Approximation of 5
      width: wp(87.5), // width*0.875
      height: hp(4), // height*.04
      paddingLeft: wp(4), // Approximation of 15
      borderWidth: 1,
      borderRadius: RFValue(50), // Adjusted for font size
      margin: 'auto',
      borderColor: theme.secondaryBorder,
    },
    searchBarIcon: {
      width: hp(2), // height*.02
      height: hp(2), // height*.02
      marginVertical: 'auto',
    },
    searchBarInput: {
      fontFamily: 'Effra_Regular',
      height: hp(5), // height*.05
      width: wp(75), // width*.75
      color: theme.secondary
    },
    glosarioContainer: {
      paddingTop: hp(3), // Approximation of 25
    },
    row: {
      marginHorizontal: wp(4), // Approximation of 15
      flexDirection: 'row',
      gap: wp(2.5), // Approximation of 10
      marginVertical: hp(0.6), // Approximation of 5
    },
    categoriaCirculo: {
      width: hp(5), // height*0.055
      height: hp(5), // height*0.055
      marginVertical: 'auto',
      marginTop: 0,
      textAlign: 'center',
      borderRadius: RFValue(100), // Adjusted for font size
    },
    categoriaLetra: {
      textAlign: 'center',
      margin: 'auto',
      color: theme.alwaysWhite,
      fontSize: hp(3.7), // height*0.037
      lineHeight: hp(4.5), // height*0.044
      fontFamily: 'Effra_Light',
    },
    termTitle: {
      fontSize: hp(1.8), // height*0.018
      color: theme.primary,
      fontFamily: 'Effra_Medium',
    },
    termList: {
      gap: hp(1.8), // Approximation of 15
    },
    termInfo: {
      fontSize: hp(1.6), // height*0.016
      fontFamily: 'Effra_Regular',
      color: theme.secondary
    },
    glosarioHeader: {
      height: hp(7.7), // height*0.077
    },
    expandedContent: {
      overflow: 'hidden',
    },
    expandedText: {
      fontSize: hp(1.6), // height*0.016
      color: theme.background,
    },
    termDetailsContainer: {
      marginRight: wp(12), // width*0.12
    },
    glosarioTerm: {
      gap: 0,
      marginVertical: 'auto',
      paddingHorizontal: wp(2.5), // Approximation of 10
    },
    termDetails: {
      fontSize: hp(1.6), // height*0.016
      fontFamily: 'Effra_Regular',
      color: theme.primary,
      lineHeight: hp(2.5), // height*0.025
      width: wp(74.5), // width*0.745
      marginVertical: 0,
      paddingBottom: hp(0.6), // Approximation of 5
    },
    glosarioFooter: {
      height: hp(50), // height*0.5
    },
    // The following styles are from your original return statement and needed to be defined in `styles`
    glosarioFlatListWrapper: {
        marginHorizontal: wp(4), // Approximation of 15
        marginTop: hp(1), // height *.01
        flexDirection: 'row',
        gap: wp(2.5), // Approximation of 10
    },
    termListSeparator: {
        minHeight: hp(0.1),
        maxHeight: hp(0.1),
        marginTop: hp(1),
        backgroundColor: theme.primaryBorder,
    },
    linearGradientOverlay: {
        position: 'absolute',
        bottom: hp(2.5), // height*0.025
        left: 0,
        right: 0,
        height: hp(45), // height*0.45
        zIndex: 1,
    },


      //special chart
  specialChartBackgroundImage: {
    width: wp('100%'), // width a wp
    height: wp('70%'), // width*.7 a wp
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: hp('1.56%'), // 12.5px a hp (aproximado)
    paddingBottom: hp('1.875%'), // 15px a hp
  },
  arrowSpecialChartContainer: {
    backgroundColor: '#7ebcec', // Se mantiene fijo
    height: wp('7%'), // width*0.07 a wp
    width: wp('35%'), // width*0.35 a wp
    justifyContent: 'center',
    position: 'absolute',
    top: hp('4.5%'), // height*0.045 a hp
    left: 0, // Se mantiene fijo
  },
  arrowSpecialChartText: {
    textAlign: 'center',
    fontFamily: 'Effra_Bold',
    color: theme.alwaysWhite,
    // Ajuste: Estimando un RFValue para width*0.03
    fontSize: RFValue(10), // Se asume un valor base de 12 para escalabilidad en este contexto
    lineHeight: wp('7.2%'), // width*0.072 a wp
  },
  arrowSpecialChart: {
    backgroundColor: '#7ebcec', // Se mantiene fijo
    width: wp('5%'), // width*0.05 a wp
    height: wp('5%'), // width*0.05 a wp
    position: 'absolute',
    right: wp('-2.5%'), // -width*0.025 a wp
    transform: [{ rotate: '45deg' }], // Se mantiene fijo
    borderTopRightRadius: 5, // Se mantiene fijo
  },
  specialTitleContainer: {
    // No hay cambios aquí ya que no hay propiedades fijas que necesiten conversión.
  },
  specialTitle: {
    fontFamily: 'Effra_Light',
    color: theme.alwaysWhite,
    // Ajuste: Estimando un RFValue para width*0.1
    fontSize: RFValue(30), // Se asume un valor base de 30 para escalabilidad en este contexto
    lineHeight: wp('12%'), // width*0.12 a wp
  },
  specialSubtitle: {
    fontFamily: 'Effra_Regular',
    color: theme.alwaysWhite,
    // Ajuste: Estimando un RFValue para width*0.057
    fontSize: RFValue(20), // Se asume un valor base de 20 para escalabilidad en este contexto
    lineHeight: wp('6%'), // width*0.06 a wp
  },
  specialDetailsContainer: {
    marginTop: hp('3.125%'),
    },
  specialDetails: {
    fontFamily: 'Effra_Regular',
    color: theme.black,
    // Ajuste: Estimando un RFValue para width*0.045
    fontSize: RFValue(16), // Se asume un valor base de 16 para escalabilidad en este contexto
    lineHeight: wp('6.1%'), // width*0.061 a wp
    marginHorizontal: hp('1.875%'),
    marginVertical: hp('.5%'),
  },

  modalSpecialChartContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalSpecialChartContent: {
    borderTopLeftRadius: 25, // Se mantiene fijo
    borderTopRightRadius: 25, // Se mantiene fijo
    backgroundColor: theme.background,
    height: hp('93.25%'),
  },
  specialChartModalSlider: {
    position: 'absolute',
    top: 0, // Se mantiene fijo
    justifyContent: 'center',
    height: 2, // Se mantiene fijo
    marginTop: hp('2.5%'), // 20px a hp
    marginBottom: hp('0.625%'), // 5px a hp
    width: wp('10%'), // width*0.1 a wp
    marginHorizontal: 'auto',
    backgroundColor: theme.alwaysWhite,
  },

      //premium modal
  premiumModal: {
    padding: wp('5%'), // 20px a wp
    flex: 1,
    height: hp('100%'), // '100%' a hp
  },
  modalPremiumContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalSolarPremiumContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25, 
    flex: 1,
    maxHeight: hp('70%'), 
    backgroundColor: theme.editSheet,
  },
  modalPremiumContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25, 
    flex: 1,
    maxHeight: hp('80%'), 
    backgroundColor: theme.editSheet,
  },
  modalPremiumSlider: {
    justifyContent: 'center',
    height: 2, // Se mantiene fijo
    marginTop: hp('3.125%'), // 25px a hp
    width: wp('12%'), // width*0.12 a wp
    marginHorizontal: 'auto',
    backgroundColor: theme.primaryBorder,
  },
  modalPremiumTitle: {
    fontSize: RFValue(20), // height*0.027 a RFValue. Ajustado para proporción similar a RFValue(20) de height*.032
    fontFamily: 'Effra_Bold',
    color: theme.black,
  },
  modalPremiumSubtitle: {
    fontSize: RFValue(14), // height*0.0185 a RFValue. Ajustado para proporción similar a RFValue(12) de height*.018
    fontFamily: 'Effra_Regular',
    marginTop: hp('1.875%'), // 15px a hp
    color: theme.black,
  },
  modalPremiumSubtitleBold: {
    fontFamily: 'Effra_Bold',
  },
  radioButton: {
    width: hp('3.125%'), // height*.025 a hp
    height: hp('3.125%'), // height*.025 a hp
    borderRadius: 50, // Se mantiene fijo
    borderWidth: 1, // Se mantiene fijo
    backgroundColor: theme.grey,
    borderColor: theme.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('0.625%'), // 5px a hp
  },
  selectedPremiumButton: {
    borderColor: '#7EBCEC', // Se mantiene fijo
  },
  innerCircle: {
    width: hp('1.5%'), // height*.012 a hp
    height: hp('1.5%'), // height*.012 a hp
    borderRadius: 50, // Se mantiene fijo
    backgroundColor: '#7EBCEC', // Se mantiene fijo
  },
  pricingOptions: {
    gap: hp('1.875%'), // 15px a hp
    marginVertical: hp('3.125%'), // 25px a hp
  },
  pricingOption: {
    flexDirection: 'row',
    width: '100%', // Se mantiene fijo
    gap: hp('1.25%'), // 10px a hp
  },
  optionSeparator: {
    backgroundColor: theme.primaryBorder,
    height: 1, // Se mantiene fijo
  },
  pricingTitle: {
    fontSize: RFValue(14), // height*0.02 a RFValue. Ajustado para proporción similar a RFValue(20) de height*.032
    fontFamily: 'Effra_Bold',
    color: theme.black,
  },
  pricingInfo: {
    gap: hp('0.375%'), // 3px a hp
  },
  selectedText: {
    color: '#7EBCEC', // Se mantiene fijo
  },
  pricingDescription: {
    fontSize: RFValue(14), // height*0.015 a RFValue. Ajustado para proporción similar a RFValue(12) de height*.018
    lineHeight: hp('2.5%'), // height*0.02 a hp
    fontFamily: 'Effra_Regular',
    maxWidth: '96%', // Se mantiene fijo
    flexWrap: 'wrap', // Se mantiene fijo
    color: theme.black,
  },
  pricingDescriptionBold: {
    fontFamily: 'Effra_Bold',
  },
  payButton: {
    backgroundColor: theme.black,
    width: '100%', // Se mantiene fijo
  },
  payButtonText: {
    color: theme.white,
    fontSize: RFValue(13), // height*0.02 a RFValue. Ajustado para proporción similar a RFValue(20) de height*.032
    textTransform: 'uppercase', // Se mantiene fijo
    margin: 'auto', // Se mantiene fijo
    textAlign: 'center', // Se mantiene fijo
    fontFamily: 'Effra_Medium',
    paddingTop: hp('1.25%'), // 10px a hp
    paddingBottom: hp('0.625%'), // 5px a hp
  },


        // efemerides

        skeletonEventContainer: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          paddingLeft: 15,
          gap: 10,
          height: height*0.095,
          borderRadius: 10,
        },
        skeletonEventCircle: {
          width: height*0.055,
          height: height*0.055,
          borderRadius: 25,
          backgroundColor: "#ddd",
          marginTop: 0,
          margin: 'auto'
        },
        skeletonEventTextContainer: {
          flex: 1,
          marginBottom: 10
        },
        skeletonEventLine: {
          height: 15,
          backgroundColor: "#e6e6e6",
          borderRadius: 4,
          marginVertical: 5,
        },
        efemeridesContainer:{
          height: height,
          marginVertical:'auto',
          marginBottom: 0,
        },
        topEfemeridesSpace:{
          height: height*.08,
        },
        efemeridesCardContainer: {
          paddingTop: 15,
        },
        efemeridesCard: {
          paddingTop: 10,
          flexDirection: 'row', 
          gap: 10,
          paddingLeft: 15
        },
        categoriaEventoLetra: {
          textAlign: 'center',
          margin: 'auto',
          color: theme.alwaysWhite,
          fontSize: height*0.05,
          fontFamily: 'Astronomicon',
          lineHeight: height*0.045,
        },
        categoriaCirculo: {
          width: height*0.055,
          height: height*0.055,
        marginVertical: 'auto',
        marginTop: 0,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        },
        signoEstilo:{
          textAlign: 'center',
          margin: 'auto',
          color: theme.alwaysWhite,
          fontSize: height*0.04,
          lineHeight: height*0.04,
          fontFamily: 'Astronomicon',
        },
        retroEstilo:{
          textAlign: 'center',
          margin: 'auto',
          marginTop: height*0.007,
          marginLeft: height*0.019,
          color: theme.alwaysWhite,
          fontSize: height*0.06,
          fontFamily: 'Astronomicon',
        },
        lunaEstilo:{
          textAlign: 'center',
          color: theme.alwaysWhite,
          margin: 'auto',
          marginTop: 'auto',
          fontSize: height*0.04,
          fontFamily: 'Astronomicon',
          textAlign: 'left',
          transform: [
            { translateY: .5 }, { translateX:2 }
          ],
        },
        eventContainer:{
          borderColor: theme.primaryBorder,
          borderBottomWidth: height*.000325,
          width: width*1,
          paddingBottom: 10,
        },
        eventTitle: {
          fontSize: height * 0.018,
          color: theme.primary,
          fontFamily: 'Effra_Medium',
          maxWidth: '90%',
          flexWrap: 'wrap',
        },
        eventShareIcon: {
          fill: theme.secondaryBorder,
          width: height*0.018,
          height: height*0.018,
          margin: 'auto',
        },
        eventInfo: {
          fontSize:  height*0.019,
          fontFamily: 'Effra_Regular',
          color: theme.secondaryBorder
        },
        noEventsContainer:{
          paddingTop: height*0.05,
          textAlign: 'center',
          justifyContent: 'center',
        alignItems: 'center',
        gap: height*0.015
        },
        noEventsText: {
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        fontSize: height*0.022,
        lineHeight: height*0.035,
        color: theme.secondary,
        marginHorizontal: 60,
        marginTop: 5,
        fontFamily: 'Effra_Light',
        },
        noEventsTitle: {
        fontSize:  height*0.04,
        lineHeight: height*0.045,
        width: width*0.7,
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'Effra_Light',
        color: theme.secondaryBorder
        },
        noEventsIcon:{
          width: width*0.6,
          height: width*0.6,
          margin: 'auto',
          fill: theme.secondaryBorder
        },  
        expandedContent: {
        overflow: 'hidden',
      },
      eventDetailsContainer:{
        marginTop: 10,
        marginBottom: 0,
        width: width*.765,
      },
      eventDetails: {
        fontSize: height*0.017,
        fontFamily: 'Effra_Regular',
        color: theme.primary,
        lineHeight: height*0.024,
        marginVertical: 'auto',
      },

      // errorboundary


      errorContainer:{
          flex: 1,
          alignItems: 'center',
          textAlign: 'center',
        },
        errorGradient:{
          position: 'absolute'
        },
        errorIcon:{
      position: 'absolute',
      bottom: 275,
      fill: theme.primary
        },
        UpsContainer:{
          margin: 'auto',
          marginHorizontal: 25,
          gap: 5,
          paddingTop: 60
        },
        UpsText:{
          color: theme.secondaryBorder,
          margin: 'auto',
          fontSize: 24,
          textAlign: 'center',
          fontFamily: 'Effra_Light'
        },
        UpsTextInfo:{
          color: theme.secondaryBorder,
          margin: 'auto',
          fontSize: 20,
          textAlign: 'center',
          fontFamily: 'Effra_Light',
          marginTop: 20
        },
        ErrorButton:{
          width: 170,
          borderRadius: 100,
          backgroundColor: theme.alwaysBlack,
          borderWidth: 1,
          borderColor: theme.alwaysWhite,
          margin: 'auto',
          marginTop:  20,
        },
        ErrorButtonTitle:{
          textAlign: 'center',
          fontSize: 18,
          color: theme.alwaysWhite,
          fontFamily: 'Effra_Regular',
          padding: 0,
          transform: [
            { translateY: 1.5 }
          ],
        },

        // alerts
        overlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        alertLogOutbox: {
          backgroundColor: theme.alertModal,
          borderRadius: 12,
          width: '70%',
          paddingTop: 40,
          height: height*.475,
          alignItems: 'center',
          justifyContent: 'space-between'
        },
        alertDeleteBox: {
          backgroundColor: theme.alertModal,
          borderRadius: 12,
          width: '80%',
          alignItems: 'center',
        },
        alertDeleteMessage: {
          textAlign: 'center',
          paddingTop: 50,
          paddingBottom: 5,
          fontFamily: 'Effra_Regular',
          width: width*.6,
          fontSize: height * 0.022,
          color: theme.secondary,
        },
        logOutMessage: {
          textAlign: 'center',
          width: width*.55,
          fontFamily: 'Effra_Regular',
          color: theme.secondary,
          fontSize: height * 0.022,
          lineHeight: height * 0.032,
        },
        alertButtons: {
          flexDirection: 'row',
          width: '100%',
          marginTop: 40,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          marginBottom: 0
        },
        cancelButton: {
          justifyContent: 'center',
          textAlign: 'center',
          width: '50%',
          paddingTop: 15,
          backgroundColor: theme.alertButtons,
          paddingBottom: 10,
          borderBottomLeftRadius: 12,
        },
        cancelButtonPressed: {
          backgroundColor: '#e0e0e0',
          borderBottomLeftRadius: 12,
        },
        cancelText: {
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'Effra_Regular',
          fontSize: height * 0.02,
          color: theme.primary,
        },
        cancelTextPressed: {
          color: '#000',
        },
        deleteButton: {
          width: '50%',
          paddingTop: 15,
          backgroundColor: theme.alertButtons,
          paddingBottom: 10,
          borderBottomRightRadius: 12,
        },
        deleteButtonPressed: {
          backgroundColor: '#ffd6d6',
          borderBottomRightRadius: 12,
        },
        deleteText: {
          color: theme.red,
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'Effra_Regular',
          fontSize: height * 0.02,
        },
        deleteTextPressed: {
          color: '#b30000',
        },

        alertConfirmBox: {
          backgroundColor: theme.alertModal,
          borderRadius: 12,
          width: '80%',
          alignItems: 'center',
        },
        alertConfirmMessage: {
          textAlign: 'center',
          paddingTop: 40,
          fontFamily: 'Effra_Light',
          color: theme.secondary,
          width: width*.7,
          fontSize: height * 0.022,
        },






  });
};