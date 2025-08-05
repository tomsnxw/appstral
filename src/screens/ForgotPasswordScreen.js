import React, { useState, useRef } from "react";
import { View, Text, TextInput, Image, Alert, StyleSheet, Dimensions,ImageBackground, TouchableOpacity, Animated } from "react-native";
import { resetPassword } from "../config/firebaseConfig"; 
import {LinearGradient} from 'expo-linear-gradient';
import colors from '../utils/colors'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";

const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');
import { useToast } from "../contexts/ToastContext";
import { useTranslation } from "react-i18next";

const ForgotPasswordScreen = ({ navigation }) => {
const { showToast } = useToast();
const [email, setEmail] = useState("");
const [isLoading, setIsLoading] = useState(false);
const progress = useRef(new Animated.Value(0)).current;
const [focusedField, setFocusedField] = useState(null);
  const { t, i18n  } = useTranslation();
const handleResetPassword = async () => {
    if (isLoading) return;

    if (!email) {
      showToast({ message: t("toast.Ingresar_Correo"), type: "alert" });
      return;
    }

    setIsLoading(true);
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    try {
      await resetPassword(email);
      Alert.alert(
        "Correo enviado",
        "Revisa tu bandeja de entrada para restablecer tu contraseña."
      );
      navigation.goBack();
    } catch (error) {
      showToast({ message: t("toast.Ups"), type: "error" });
    }

    setIsLoading(false);
    Animated.timing(progress, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
    
  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });
  

  return (
          <LinearGradient
     colors={["#ccfbe7", "#e1eff5", "#f3c3f5"]}
      style={styles.linearGradient} // <-- Aplica el nuevo estilo
      start={{ x: 0, y: 0 }} // <-- Punto de inicio del degradado (superior izquierda)
      end={{ x: 1, y: 1 }}   // <-- Punto final del degradado (inferior derecha)
    >
      <View style={styles.formContainer}>
      <View style={styles.titleContainer}>
      <Text style={styles.subtitle}>{t("Contraseña_Titulo")}</Text>
      </View>
     <View style={[styles.inputContainer, focusedField === 'email' ? styles.focusedBorder : styles.defaultBorder]}>
      <TextInput
        style={[styles.input, focusedField === 'email' ? styles.focusedText : styles.defaultText]}
        placeholder={t("Correo")}
        placeholderTextColor={'#808080'}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField(null)}
      /></View>

       <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={isLoading}>
                   <View style={styles.progressContainer}>
                     <Animated.View style={[styles.progressFill, { width: widthInterpolation }]} />
                     <Text style={styles.buttonText}>{t("Contraseña_Boton")}</Text>
                   </View>
                 </TouchableOpacity>
    
    </View>
 <ImageBackground source={require('../../assets/images/loginStars.png')}
            style={styles.footerImageBackground}
            resizeMode="cover">
            <Text style={styles.footerText}>&copy; {new Date().getFullYear()}{t("Footer")}</Text>
          </ImageBackground>
            </LinearGradient>
  );
};

const styles = StyleSheet.create({
    linearGradient: { 
      flex: 1,
    },
    container: {
      flex: 1,
      zIndex: 1
    },
  formContainer: {
    height: hp('85%'),
    justifyContent: 'center',
    alignSelf: 'center',
    gap: hp('1.8%') // Aproximadamente 15 / 812 * 100%
  },
  scrollContainer: {
    justifyContent: 'space-between',
    marginTop: hp('4%') // 4% de la altura de la pantalla
  },
  formContainer: {
    marginTop:hp(3),
    height: hp('85%'),
    justifyContent: 'center',
    alignSelf: 'center',
    gap: hp('1.8%') // Aproximadamente 15 / 812 * 100%
  },
  scrollContainer: {
    justifyContent: 'space-between',
    marginTop: hp('4%') // 4% de la altura de la pantalla
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  title: {
    fontSize: RFValue(34), // Equivalente a height * 0.045
    fontFamily: 'Effra_Bold',
    textAlign: "center",
    lineHeight: RFValue(44), // Equivalente a height * 0.055
    maxWidth: wp('95%'), // 90% del ancho de la pantalla
    marginHorizontal: 'auto',
  },
  subtitle: {
    fontSize: RFValue(22), // Equivalente a height * 0.03
    marginHorizontal: 'auto',
    fontFamily: 'Effra_Light',
    textAlign: "center",
    lineHeight: RFValue(26), // Equivalente a height * 0.04
    maxWidth: wp('80%'), // 80% del ancho de la pantalla
    marginVertical: hp('0.6%') // Aproximadamente 5 / 812 * 100%
  },
  text: {
    fontSize: RFValue(12), // Equivalente a height * 0.015
    fontFamily: 'Effra_Regular',
    textAlign: "start",
    color: '#808080',
    paddingLeft: wp('2.7%'), // Aproximadamente 10 / 375 * 100%
  },
  inputContainer: {
     height: RFValue(28), // Equivalente a height * 0.045
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: RFValue(50),
    paddingHorizontal: wp('4%'), // Aproximadamente 15 / 375 * 100%
    justifyContent: 'space-between',
    alignItems:'center',
    marginHorizontal: 'auto',
    width: wp('80%')
  },
  focusedBorder:{
    borderWidth: 1,
    borderColor: 'black',
  },
  defaultBorder:{
    borderWidth: 1,
    borderColor: '#808080',
  },
  focusedText:{
    color: 'black',
  },
  defaultText:{
    color: '#808080',
  },
  input: {
    paddingHorizontal: wp('0.5%'),
    borderRadius: RFValue(20),
    textAlign: 'left',
    height: RFValue(32),
    color: '#808080',
    fontSize: RFValue(13),
    fontFamily: 'Effra_Regular',
    width: '90%',
  },
  datePicker: {
    height: hp('4.5%'), // Equivalente a height * 0.045
    borderColor: '#808080',
    backgroundColor: 'transparent',
    borderWidth: 1,
    padding: 0,
    width: wp('90%'), // 90% del ancho de la pantalla
    borderRadius: RFValue(50),
    fontFamily: 'Effra_Regular',
    fontSize: RFValue(15),
    margin: 'auto'
  },
  pickerPlaceContainer:{
  },
  dropdownBox:{
    height: hp('4.5%'), // Equivalente a height * 0.045
    borderRadius: RFValue(20),
  },
  dropdownList:{
    position: 'absolute',
    top: hp('4%'), // Equivalente a height * 0.04
    width: wp('85%'), // 85% del ancho de la pantalla
    alignSelf: 'center',
    maxHeight: hp('20%'), // 20% de la altura de la pantalla
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 3,
    zIndex: 2
  },
  inputStyles:{
    color: '#808080',
    fontFamily: 'Effra_Regular',
    fontSize: RFValue(13), // Equivalente a height * 0.016
    lineHeight: RFValue(14), // Equivalente a height * 0.017
  },
  dropdownTextStyles:{
    color: '#808080',
    fontSize: RFValue(13), // Equivalente a height * 0.016
    fontFamily: 'Effra_Regular',
  },
  titleDatePicker: {
    color: '#808080',
    fontSize: RFValue(13), // Equivalente a height * 0.016
    fontFamily: 'Effra_Regular',
    padding: 0,
    margin: 0
  },
  navigate: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: RFValue(5)
  },
  button: {
    width: wp('40%'), // 40% del ancho de la pantalla
    height: hp('4%'), // 4% de la altura de la pantalla
    borderRadius: RFValue(100),
    marginHorizontal: 'auto',
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  progressContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    height: "100%",
    backgroundColor: "#666666",
  },
  buttonText: {
    fontSize: RFValue(13), 
    color: '#ffffff',
    fontFamily: 'Effra_Regular',
    transform: [{ translateY: RFValue(-1) }]
  },
  loginText:{
    fontSize: RFValue(13), // Equivalente a height * 0.016
    color: '#333333',
    fontFamily: 'Effra_Light',
  },
  loginButton:{
    color: '#A358B5',
    fontSize: RFValue(13), // Equivalente a height * 0.016
    fontFamily: 'Effra_Medium',
  },
    footerImageBackground: {
      position: 'absolute',
      width: width,
      margin:'auto',
      height: 215, 
      justifyContent: 'flex-end',
      alignItems: 'center',
      bottom: -height*0.01,
      zIndex: 0,
      transform: [{scaleX: -1}]
    },
    footerText: {
      fontSize: 12,
       height: height*.06,
      color: '#333333',
      textAlign: 'center',
      paddingHorizontal: 20, 
      transform: [{scaleX: -1}]
    },
});

export default ForgotPasswordScreen;
