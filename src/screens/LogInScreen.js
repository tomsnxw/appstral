import React, { useState, useRef } from "react";
import { View, Text, Image, TextInput, TouchableOpacity,KeyboardAvoidingView, Animated, Dimensions, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { logInUser } from "../config/firebaseConfig";
import {LinearGradient} from 'expo-linear-gradient';
import { Button } from 'react-native-elements';
import colors from '../utils/colors';
import { useToast } from "../contexts/ToastContext";
import SeeIcon from '../../assets/icons/SeeIcon';
import NoSeeIcon from '../../assets/icons/NoSeeIcon';
import { useTranslation } from "react-i18next";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";

const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');

const LogInScreen = ({ gotoForgot }) => {
  const { showToast } = useToast();
  const { t, i18n  } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [focusedField, setFocusedField] = useState(null);

  const handleLogIn = async () => {
    if (isLoading) return;
  
    if (!email || !password) {
      showToast({ message: t("toast.Completar"), type: "alert" });
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
      const user = await logInUser(email, password);
      console.log("Usuario autenticado:", user);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        showToast({ message: t("toast.No_Usuario"), type: "error" });
      } else if (error.code === "auth/wrong-password") {
        showToast({ message: t("toast.Contraseña"), type: "error" });
      } else {
        showToast({ message: t("toast.Correo_Contraseña"), type: "error" });
      }
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
    <View style={styles.container}>
    <LinearGradient
      colors={["#f5cffb", "#e1eff5", "#f8f5c5"]} 
      style={styles.gradient}
    >
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t("Ingresar_Titulo")}</Text>
          <Text style={styles.title}>{t("Ingresar_Subtitulo")}</Text>
        </View>
          <View style={[styles.inputContainer, focusedField === 'email' ? styles.focusedBorder : styles.defaultBorder]}>
        <TextInput  placeholderTextColor={'#808080'}
          style={[styles.input, focusedField === 'email' ? styles.focusedText : styles.defaultText]}
          placeholder={t("Correo")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
        />
        </View>
        <View style={[styles.inputContainer, focusedField === 'password' ? styles.focusedBorder : styles.defaultBorder]}>
  <TextInput  placeholderTextColor={'#808080'}
    style={[styles.input, focusedField === 'password' ? styles.focusedText : styles.defaultText]}
    placeholder={t("Contraseña")}
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!passwordVisible}
    onFocus={() => setFocusedField('password')}
    onBlur={() => setFocusedField(null)}
  />
  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
    {passwordVisible ? (
      <NoSeeIcon style={[styles.passwordIcon, focusedField === 'password' ? styles.focusedPassword : styles.defaultPassword]} />
    ) : (
      <SeeIcon style={[styles.passwordIcon, focusedField === 'password' ? styles.focusedPassword : styles.defaultPassword]} />
    )}
  </TouchableOpacity>
</View>
        <TouchableOpacity style={styles.button} onPress={handleLogIn} disabled={isLoading}>
             <View style={styles.progressContainer}>
               <Animated.View style={[styles.progressFill, { width: widthInterpolation }]} />
               <Text style={styles.buttonText}>{t("Ingresar_Boton")}</Text>
             </View>
           </TouchableOpacity>
  
        <View style={styles.navigate}>
          <Text style={styles.loginText}>{t("Contraseña_Pregunta")}</Text>
          <TouchableOpacity onPress={gotoForgot}>
            <Text style={styles.loginButton}>{t("Contraseña_Link")}</Text>
          </TouchableOpacity>
        </View>
        </View>
  
      
        <View style={styles.footer}>
          <Image source={require('../../assets/images/loginStars.png')} style={styles.Image} resizeMode="cover" />
          <Text style={styles.footerText}>{t("Footer")}</Text>
        </View>
    </LinearGradient></View> 
  );
  
};

const styles = StyleSheet.create({
  gradient: {
    height: height,
  },
  container: {
    height: height,
  },
  formContainer: {
    height: hp('85%'), // 85% de la altura de la pantalla
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 'auto',
    marginBottom: hp('15%'),
    marginHorizontal: hp('2%')
  },
  titleContainer:{
    marginHorizontal: 'auto',
    marginBottom: hp('4.3%')
    
  },
  title: {
    fontSize: RFValue(34), // Equivalente a height * 0.045
    fontFamily: 'Effra_Bold',
    textAlign: "center",
    lineHeight: RFValue(34), // Puedes ajustar esto también con RFValue si es necesario
    color: '#333333'
  },
  text: {
    fontSize: RFValue(18),
    fontFamily: 'Effra_Regular',
    textAlign: "start",
    color: '#808080',
    paddingLeft: wp('2.5%') // Aproximadamente 10 / 375 (ancho típico de un iPhone X) * 100%
  },
  inputContainer: {
     height: RFValue(28), // Equivalente a height * 0.045
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: RFValue(50),
    paddingHorizontal: wp('4%'), 
    justifyContent: 'space-between',
    alignItems:'center',
    marginHorizontal: 'auto',
    width: wp('85%'),
    marginTop:'0',
    marginBottom: hp('2%')

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
  passwordIcon:{
    width: wp('5.3%'), // Aproximadamente 20 / 375 * 100%
    height: hp('2.5%'), // Aproximadamente 20 / 812 * 100%
    marginVertical: 'auto',
  },
  focusedPassword:{
    fill:'black'
  },
  defaultPassword:{
    fill:'#808080'
  },
  input: {
    paddingHorizontal: wp('0.5%'),
    borderRadius: RFValue(20),
    textAlign: 'left',
    height: '125%',
    color: '#808080',
    fontSize: RFValue(13),
    fontFamily: 'Effra_Regular',
    width: '90%',
  },
  pickerContainer: {
    paddingHorizontal: wp('1.3%'), // Aproximadamente 5 / 375 * 100%
    borderWidth: 1,
    borderColor: '#808080',
    padding: 'auto',
    borderRadius: RFValue(35),
    color: '#808080',
    fontSize: RFValue(16),
    fontFamily: 'Effra_Regular',
    marginBottom: hp('1.8%') // Aproximadamente 15 / 812 * 100%
  },
  picker: {
    color: '#808080',
    fontSize: RFValue(16),
    fontFamily: 'Effra_Regular',
  },
  datePicker: {
    height: hp('6.1%'), // Aproximadamente 50 / 812 * 100%
    borderColor: '#808080',
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginTop: hp('0.6%'), // Aproximadamente 5 / 812 * 100%
    marginBottom: hp('1.8%'), // Aproximadamente 15 / 812 * 100%
    paddingHorizontal: wp('2.7%'), // Aproximadamente 10 / 375 * 100%
    width: wp('66.7%'), // Aproximadamente 250 / 375 * 100%
    paddingVertical: 0,
    borderRadius: RFValue(20),
    fontFamily: 'Effra_Regular',
    fontSize: RFValue(16),
    margin: 'auto'
  },
  titleDatePicker: {
    color: '#808080',
    fontSize: RFValue(16),
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
    margin: RFValue(20),
    gap: RFValue(5)
  },
  button: {
    width: wp('30%'), // 40% del ancho de la pantalla
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
    fontSize: RFValue(14), // Equivalente a height * 0.017
    color: '#333333',
    fontFamily: 'Effra_Light',
  },
  loginButton:{
    color: '#A358B5',
    fontSize: RFValue(14), // Equivalente a height * 0.017
    fontFamily: 'Effra_Medium',
  },
  footerText:{
    fontSize: wp('3%'), // 3% del ancho de la pantalla
    color: '#333333',
    fontFamily: 'Effra_Light',
    bottom: hp('7%'), // 6% de la altura de la pantalla
  },
  footer:{
    position: "absolute",
    bottom: hp('2%'), // 2% de la altura de la pantalla
    width: wp('100%'), // 100% del ancho de la pantalla
    height: hp('25%'), // 25% de la altura de la pantalla
    alignItems: "center",
    justifyContent: "center",
  },
  Image:{
    width: "100%",
    height: "100%",
  }
});
export default LogInScreen;
