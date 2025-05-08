import React, {useContext} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import BackArrowIcon from '../../assets/icons/BackArrowIcon'
import {LinearGradient} from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
const { height: height, width: width } = Dimensions.get('screen');
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import { useTranslation } from 'react-i18next';


const PolicyScreen = () => {
  const { t, i18n  } = useTranslation ();
    const navigation = useNavigation(); 
    const { theme } = useContext(ThemeContext);
    const styles = createStyles(theme);

  return ( 
  <View style={styles.policyContainer}>
  <View style={styles.policyHeader}>
            <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backArrow}>
        <BackArrowIcon style={{ width:width*.03, height: width*.03, fill: theme.secondary, margin: 'auto'}}/>
        </TouchableOpacity></View>
    <ScrollView style={styles.policyScrollContainer}>

  <Text style={styles.policyTitle}>{t("Policy.title")}</Text>
      <Text style={styles.policySectionText}>
        
      {t("Policy.introduction")}
      </Text>

      <Text style={styles.policySectionTitle}>{t("Policy.subtitle1")}</Text>
      <Text style={styles.policySectionText}>{t("Policy.description1")}</Text>

      <Text style={styles.policySectionTitle}>{t("Policy.subtitle2")}</Text>
      <Text style={styles.policySectionText}>{t("Policy.description2")}</Text>

      <Text style={styles.policySectionTitle}>{t("Policy.subtitle3")}</Text>
      <Text style={styles.policySectionText}>{t("Policy.description3")}</Text>

      <Text style={styles.policySectionTitle}>{t("Policy.subtitle4")}</Text>
      <Text style={styles.policySectionText}>{t("Policy.description4")}</Text>

      <Text style={styles.policySectionTitle}>{t("Policy.subtitle5")}</Text>
      <Text style={styles.policySectionText}>{t("Policy.description5")}</Text>

      <Text style={styles.policySectionTitle}>{t("Policy.subtitle6")}</Text>
      <Text style={styles.policySectionText}>{t("Policy.description6")}</Text>

      <Text style={styles.policySectionTitle}>{t("Policy.subtitle7")}</Text>
      <Text style={styles.policySectionText}>{t("Policy.description7")}</Text>

      <Text style={styles.policySectionTitle}>{t("Policy.subtitle8")}</Text>
      <Text style={styles.policySectionText}>{t("Policy.description8")}</Text>

      <Text style={styles.policySectionTitle}>{t("Policy.subtitle9")}</Text>
      <Text style={styles.policySectionText}>{t("Policy.description9")}</Text>

      <Text style={styles.policySectionTitle}>{t("Policy.subtitle10")}</Text>
      <Text style={styles.policySectionText}>{t("Policy.description10")}</Text>

      <Text style={styles.policySectionTitle}>{t("Policy.subtitle11")}</Text>
      <Text style={styles.policySectionText}>{t("Policy.description11")}</Text>

      <Text style={styles.policySectionTitle}>{t("Policy.subtitle12")}</Text>
      <Text style={styles.policySectionText}>{t("Policy.description12")}</Text>


      <View style={styles.scrollBottomSpace}></View>
    </ScrollView>
       <LinearGradient pointerEvents="none" colors={['transparent',  theme.shadowBackground, theme.shadowBackground]} style={{  position: 'absolute',bottom: height*0.025,left: 0,right: 0,height: height*0.45,zIndex: 1}}/>
    
    </View>
  );
};

export default PolicyScreen;
