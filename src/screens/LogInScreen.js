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
    height: height * 0.85, 
    justifyContent: 'center',
    alignSelf: 'center',
  },
  titleContainer:{
    marginHorizontal: 'auto',
    marginBottom: 35
  },
  title: {
    fontSize:  height * 0.045,
    fontFamily: 'Effra_Bold',
    textAlign: "center",
    lineHeight: 50,
    color: '#333333'
  },
  text: {
    fontSize: 18,
    fontFamily: 'Effra_Regular',
    textAlign: "start",
    color: '#808080',
    paddingLeft: 10
  },
  inputContainer: {
    height: height*0.045,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 50,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginBottom: 10
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
  width: 20,
  height: 20,
  marginVertical: 'auto',
  },
  focusedPassword:{
  fill:'black'
  }, 
  defaultPassword:{
  fill:'#808080'
  },  
  input: {
    flex: 1,
    fontSize: height*0.016,
    height: height*0.046,
    fontFamily: 'Effra_Regular'
  },
  pickerContainer: {
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#808080',
    padding: 'auto',
    borderRadius: 35,
    color: '#808080',
    fontSize: 16,
    fontFamily: 'Effra_Regular',
    marginBottom: 15
  },
  picker: {
    color: '#808080',
    fontSize: 16,
    fontFamily: 'Effra_Regular',
  },
  datePicker: {
    height: 50,
    borderColor: '#808080',
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: 250,
    paddingVertical: 0,
    borderRadius: 20,
    fontFamily: 'Effra_Regular',
    fontSize: 16,
    margin: 'auto'
  },
  titleDatePicker: {
    color: '#808080',
    fontSize: 16,
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
    margin: 20,
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
    fontSize: height*0.016,
    color: colors.alwaysWhite,
    fontFamily: 'Effra_Regular',
    transform: [{ translateY: 1 }]
  },
  loginText:{
    fontSize: height*0.017,
    color: '#333333',
    fontFamily: 'Effra_Light',
  },
  loginButton:{
    color: '#A358B5',
    fontSize: height*0.017,
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
  bottom: height*.02,
  width: width,
  height: height*0.25,
  alignItems: "center",
  justifyContent: "center",
},
  Image:{
     width: "100%",
  height: "100%",
  }
});

export default LogInScreen;
