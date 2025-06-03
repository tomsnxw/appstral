import React, {useContext} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import BackArrowIcon from '../../assets/icons/BackArrowIcon'
import {LinearGradient} from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
const { height: height, width: width } = Dimensions.get('screen');
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import { useTranslation } from 'react-i18next';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize"; 


const TermsScreen = () => {
  const { t, i18n  } = useTranslation ();
    const navigation = useNavigation(); 
    const { theme } = useContext(ThemeContext);
    const styles = createStyles(theme);

  return ( 
  <View style={styles.policyContainer}>
      <View style={styles.policyHeader}>
            <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backArrow}>
        <BackArrowIcon style={{ width:width*.03, height: width*.03, fill: theme.secondary, margin: 'auto'}}/>
        </TouchableOpacity>

        </View>
    <ScrollView style={styles.policyScrollContainer}>
       
    <Text style={styles.policyTitle}>{t("Terms.title")}</Text>


      <Text style={styles.policySectionTitle}>{t("Terms.subtitle1")}</Text>
      <Text style={styles.policySectionText}>{t("Terms.description1")}</Text>

      <Text style={styles.policySectionTitle}>{t("Terms.subtitle2")}</Text>
      <Text style={styles.policySectionText}>{t("Terms.description2")}</Text>

      <Text style={styles.policySectionTitle}>{t("Terms.subtitle3")}</Text>
      <Text style={styles.policySectionText}>{t("Terms.description3")}</Text>

      <Text style={styles.policySectionTitle}>{t("Terms.subtitle4")}</Text>
      <Text style={styles.policySectionText}>{t("Terms.description4")}</Text>

      <Text style={styles.policySectionTitle}>{t("Terms.subtitle5")}</Text>
      <Text style={styles.policySectionText}>{t("Terms.description5")}</Text>

      <Text style={styles.policySectionTitle}>{t("Terms.subtitle6")}</Text>
      <Text style={styles.policySectionText}>{t("Terms.description6")}</Text>

      <Text style={styles.policySectionTitle}>{t("Terms.subtitle7")}</Text>
      <Text style={styles.policySectionText}>{t("Terms.description7")}</Text>

      <Text style={styles.policySectionTitle}>{t("Terms.subtitle8")}</Text>
      <Text style={styles.policySectionText}>{t("Terms.description8")}</Text>

      <Text style={styles.policySectionTitle}>{t("Terms.subtitle9")}</Text>
      <Text style={styles.policySectionText}>{t("Terms.description9")}</Text>

      <Text style={styles.policySectionTitle}>{t("Terms.subtitle10")}</Text>
      <Text style={styles.policySectionText}>{t("Terms.description10")}</Text>

      <Text style={styles.policySectionTitle}>{t("Terms.subtitle11")}</Text>
      <Text style={styles.policySectionText}>{t("Terms.description11")}</Text>

      <Text style={styles.policySectionTitle}>{t("Terms.subtitle12")}</Text>
      <Text style={styles.policySectionText}>{t("Terms.description12")}</Text>


      <View style={styles.scrollBottomSpace}></View>
    </ScrollView>
       <LinearGradient pointerEvents="none" colors={['transparent',  theme.shadowBackground, theme.shadowBackground]} style={{  position: 'absolute',bottom: height*0.025,left: 0,right: 0,height: hp('24.75%'),zIndex: 1}}/>
    
    </View>
  );
};

export default TermsScreen;
