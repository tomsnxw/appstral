import React, { useState, useRef } from "react";
import { View, Text, TextInput, Image, Alert, StyleSheet, Dimensions, TouchableOpacity, Animated } from "react-native";
import { resetPassword } from "../config/firebaseConfig"; 
import {LinearGradient} from 'expo-linear-gradient';
import colors from '../utils/colors'

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
    <View style={styles.container}>
    <LinearGradient
      colors={["#f5cffb", "#e1eff5", "#f8f5c5"]} 
      style={styles.gradient}
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
    height: height * 0.85, 
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 15
  },
  scrollContainer: {
    justifyContent: 'space-between',
    marginTop: height*0.04
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  title: {
    fontSize:  height * 0.045,
    fontFamily: 'Effra_Bold',
    textAlign: "center",
    lineHeight: height * 0.055,
    maxWidth: width*0.9,
    marginHorizontal: 'auto',
  },
  subtitle: {
    fontSize: height * 0.03,
    marginHorizontal: 'auto',
    fontFamily: 'Effra_Light',
    textAlign: "center",
    lineHeight: height * 0.04,
    maxWidth: width*0.8,
    marginVertical: 5
  },
  text: {
    fontSize: height*0.015,
    fontFamily: 'Effra_Regular',
    textAlign: "start",
    color: '#808080',
    paddingLeft: 10,
  },
  inputContainer: {
    height: height*0.045,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 50,
    paddingHorizontal: 15,
    justifyContent: 'center',
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
    flex: 1,
    fontSize: height*0.016,
    height: height*0.047,
    fontFamily: 'Effra_Regular',
    color: '#808080'
  },

  datePicker: {
    height: height*0.045,
    borderColor: '#808080',
    backgroundColor: 'transparent',
    borderWidth: 1,
    padding: 0,
    width: width*0.9,
    borderRadius: 50,
    fontFamily: 'Effra_Regular',
    fontSize: 15,
    margin: 'auto'
  },
  pickerPlaceContainer:{
  },
  dropdownBox:{
    height: height*0.045,
    borderRadius: 20,
  },
  dropdownList:{
    position: 'absolute', 
    top: height*0.04,
    width: width*0.85,
    alignSelf: 'center',
    maxHeight: height*0.2, 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 3, 
    zIndex: 2
  },
  inputStyles:{
    color: '#808080',
    fontFamily: 'Effra_Regular',
    fontSize: height*0.016,
    lineHeight: height*0.017,
    },
  dropdownTextStyles:{
    color: '#808080',
    fontSize: height*0.016,
    fontFamily: 'Effra_Regular',
  },
  titleDatePicker: {
    color: '#808080',
    fontSize: height*0.016,
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
    gap: 5
  },
  button: {
    width: width*0.4,
    height: height*0.04,
    borderRadius: 100,
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
    fontSize: 15,
    color: colors.alwaysWhite,
    fontFamily: 'Effra_Regular',
    transform: [{ translateY: 1 }]
  },
  loginText:{
    fontSize: height*0.016,
    color: '#333333',
    fontFamily: 'Effra_Light',
  },
  loginButton:{
    color: '#A358B5',
    fontSize: height*0.016,
    fontFamily: 'Effra_Medium',
  },
  footerText:{
    fontSize: width*0.03,
    color: '#333333',
    fontFamily: 'Effra_Light',
    bottom: height*.06,
},
footer:{
  position: "absolute",
  bottom: height*0.02,
  width: width,
  height: height*0.25,
  alignItems: "center",
  justifyContent: "center",
},
  Image:{
     width: "100%",
  height: "100%",
  opacity: 0.5,
  transform: [{scaleX: -1}]
  }
});

export default ForgotPasswordScreen;
