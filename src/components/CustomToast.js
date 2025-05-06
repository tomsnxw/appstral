import React, { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet,Dimensions } from "react-native";
import CrossIcon from "../../assets/icons/CrossIcon";
import CheckIcon from "../../assets/icons/CheckIcon";
import AlertIcon from "../../assets/icons/AlertIcon";
import colors from '../utils/colors'
const { height, width } = Dimensions.get('screen');

const CustomToast = ({ message, type }) => {
  const toastAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const IconComponent = type === "success" ? CheckIcon : type === "error" ? CrossIcon : type === "alert"  ? AlertIcon : CrossIcon;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(toastAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastAnimation, {
          toValue: 0,
          duration: 300, 
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        })
      ]).start(() => {
       
      });
    }, 3000);

  }, []);


  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { 
          opacity: fadeAnimation, 
          transform: [{ translateY: toastAnimation.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) }]
        }
      ]}
    >
       
        <IconComponent style={styles.icon} />
       
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 50,
    left: width*0.05,
    right: width*0.05,
    height: width*0.17,
    backgroundColor:'#333333',
    paddingVertical: height*0.01,
    paddingHorizontal: height*0.02,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5, 
    shadowColor: "#000", 
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    gap: 15,
    zIndex: 1000
  },
  icon: {
    width: height*0.03,
    height: height*0.03,
    fill: 'white',
    marginVertical: 'auto',
    marginHorizontal: 0
  },
  toastText: {
    color: colors.alwaysWhite,
    fontSize: height*0.018,
    lineHeight: height*0.022,
    flexShrink: 1, 
    marginVertical: 'auto',
    marginLeft: 0,
    marginRight: 'auto',
    fontFamily: 'Effra_Light'
  },
});

export default CustomToast;
