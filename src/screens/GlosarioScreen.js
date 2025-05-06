import React, { useEffect, useContext, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, SectionList, Pressable, Dimensions , Alert, ScrollView,PanResponder , TouchableOpacity, Modal, BackHandler } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { useFonts } from "expo-font";
import glosarioEs from "../data/eventos/glosario_es.json";
import glosarioEn from "../data/eventos/glosario_en.json";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useDerivedValue } from 'react-native-reanimated';
import SearchIcon from "../../assets/icons/SearchIcon";
import CopyIcon from "../../assets/icons/CopyIcon";
import { useTranslation } from 'react-i18next';
import '../i18n/i18n';
const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import * as Clipboard from "expo-clipboard";


const Glosario = () => {
  const { theme } = useContext(ThemeContext);
    const styles = createStyles(theme);
  const { t, i18n  } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
  const toggleAccordion = (key) => {
    setExpandedIndex(expandedIndex === key ? null : key); 
  };
   useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
     
        navigation.navigate('Home');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', backAction);
  
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [navigation])
  );
  const getGlosarioData = () => {
    const { theme } = useContext(ThemeContext);
    const styles = createStyles(theme);
    const idioma = i18n.language; 
    const glosarioData = idioma === 'es' ? glosarioEs : glosarioEn;
    return glosarioData;
  };
  
  const glosarioLista = Object.keys(getGlosarioData())
    .map((letra) => ({
      letra,
      data: getGlosarioData()[letra].filter((term) => {
        if (/ele/i.test(searchQuery)) {
          return ['fuego', 'agua', 'tierra', 'aire', 'elementos'].includes(term.nombre.toLowerCase());
        }
        if (/mod/i.test(searchQuery)) {
          return ['cardinalidad', 'fijeza', 'mutabilidad', 'modalidades'].includes(term.nombre.toLowerCase());
        } else if (searchQuery.toLowerCase() === 'planeta') {
          return ['sol', 'luna', 'mercurio', 'marte', 'júpiter', 'saturno', 'urano', 'neptuno', 'plutón'].includes(term.nombre.toLowerCase());
        } else if (searchQuery.toLowerCase() === 'signo') {
          return ['aries', 'tauro', 'géminis', 'cáncer', 'leo', 'virgo', 'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis'].includes(term.nombre.toLowerCase());
        }
        return term.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      }),
    }))
    .filter((item) => item.data.length > 0);
  
  return (
    <View style={{height: height, backgroundColor: theme.background}}>
         <View style={{paddingTop: height*.0325, paddingBottom: height*.0155, justifyContent: 'center'}}>
                    <View style={styles.searchBar}>
                      <SearchIcon style={styles.searchBarIcon} />
                      <TextInput
                        style={styles.searchBarInput}
                        value={searchQuery}
                        placeholderTextColor={theme.secondary}
                        onChangeText={setSearchQuery}
                        placeholder={t('buscar')}
                      />
                    </View>
                  </View>
      <FlatList
          ListFooterComponent={
            <View style={styles.glosarioFooter}></View>
          }
          data={glosarioLista}
          keyExtractor={(item) => item.letra}
          renderItem={({ item, index }) => {
            const circleColor = theme.glosarioCircles[index % theme.glosarioCircles.length];
    
            return (
              <View style={{     marginHorizontal: 15,
                flexDirection: 'row', 
                gap: 10,
                marginVertical: 5}}>
                <View
                  style={[styles.categoriaCirculo, { backgroundColor: circleColor }]}>
                  <Text style={styles.categoriaLetra}>{item.letra}</Text>
                </View>
                <View style={styles.termList}>
                  {item.data.map((term, index) => (
                    <AccordionItem
                      key={`${term.nombre}-${index}`}
                      item={term}
                      styles={styles}
                      theme={theme}
                      index={`${term.nombre}-${index}`}
                      expandedIndex={expandedIndex}
                      toggleAccordion={toggleAccordion}
                    />
                  ))}
                  <View style={{ minHeight: height *.001,maxHeight: height *.001,
        backgroundColor: theme.primaryBorder,}} />
                </View>
              </View>
            );
          }}
        />
   <LinearGradient colors={['transparent',  theme.shadowBackground, theme.shadowBackground]} style={{  position: 'absolute',bottom: height*0.025,left: 0,right: 0,height: height*0.45,zIndex: 1}}/>
   </View>
  );
};

const AccordionItem = ({ item, index, expandedIndex, toggleAccordion, theme, styles }) => {
  const copyToClipboard = (nombre, descripcion) => {
    const formattedText = `${nombre}: ${descripcion}`;
    Clipboard.setStringAsync(formattedText);
  };
  const height = useSharedValue(0);
  const expanded = expandedIndex === index;

  useEffect(() => {
    height.value = withSpring(expanded ? 400 : 0, { damping: 20, stiffness: 90 });
  }, [expandedIndex]);
  const iconOpacity = useDerivedValue(() => (height.value >= 400 ? 1 : 0));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
  }));
  
  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: height.value,
    opacity: height.value > 0 ? 1 : 0,
  }));

  return (
    <View style={styles.glosarioTerm}>
     
      <TouchableOpacity onPress={() => toggleAccordion(index)}>
        <Text style={styles.termTitle}>{item.nombre}</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.termDetailsContainer, animatedStyle]}>
      <Text style={styles.termDetails}>
  {item.descripcion}
  <Animated.View style={[iconAnimatedStyle]}>
  <Pressable onPress={() => copyToClipboard(item.nombre, item.descripcion)} style={{ zIndex: 5, paddingHorizontal: 5, transform: [{ translateY: 2 }] }}>
    <CopyIcon style={{ width: 15, height: 15, fill: '#b3b3b3' }} />
  </Pressable>
</Animated.View>
</Text>

      </Animated.View>
     
    </View>
  );
};



export default Glosario;
