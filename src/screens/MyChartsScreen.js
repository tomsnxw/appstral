import React, { useState, useEffect , useRef, useContext } from 'react';
import { View, TextInput, ActivityIndicator, RefreshControl, KeyboardAvoidingView, Platform, Modal, Dimensions, Keyboard, TouchableWithoutFeedback , Text, FlatList, StyleSheet, Alert, ScrollView,PanResponder , Easing , Animated, TouchableOpacity, Share, BackHandler } from 'react-native';
import { Button } from 'react-native-elements';
import { auth, db, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from '../config/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import {LinearGradient} from 'expo-linear-gradient';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AddIcon from '../../assets/icons/AddIcon';
import SeeIcon from "../../assets/icons/SeeIcon";
import EditIcon from "../../assets/icons/EditIcon";
import ShareIcon from "../../assets/icons/ShareIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import DeleteChartModal from '../modals/DeleteChartModal';
import ConfirmEditModal from '../modals/ConfirmEditModal';
import OptionsIcon from "../../assets/icons/OptionsIcon";
import SpecialChartIcon from "../../assets/icons/SpecialChartIcon";
import SpecialDetailsIcon from "../../assets/icons/SpecialDetailsIcon";
import NoChartsIcon from "../../assets/icons/NoChartsIcon";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../utils/colors';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import EditChartModal from '../modals/EditChartModal';
import AddChartModal from '../modals/AddChartModal';
import SpecialChartModal from '../modals/SpecialChartModal';
import ChartPremiumModal from '../modals/ChartPremiumModal';
import cities from '../data/cities.json';
import ShareChartModal from '../modals/ShareChartModal';
import { useToast } from "../contexts/ToastContext";
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const { height: height, width: width } = Dimensions.get('screen');
const { height: wHeight, width: wWidth } = Dimensions.get('window');

const SkeletonItem = ({ styles, theme }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonTextContainer}>
        <Animated.View style={[styles.skeletonLine, { opacity, width: "40%" }]} />
        <Animated.View style={[styles.skeletonLine, { opacity, width: "25%" }]} />
        <Animated.View style={[styles.skeletonLine, { opacity, width: "25%" }]} />
        <Animated.View style={[styles.skeletonLine, { opacity, width: "25%" }]} />
        <View style={{height: .5, marginVertical: 10, backgroundColor: theme.primaryBorder, marginLeft: width*0.01,}}/></View>

    </View>
  );
};

const MyCharts = ({ navigation }) => {
const { theme } = useContext(ThemeContext);
const styles = createStyles(theme);
const [cartasRestantes, setCartasRestantes] = useState(0);
const [confirmEditModalVisible, setConfirmEditModalVisible] = useState(false);

const fetchCartasRestantes = async () => {
  if (!auth.currentUser) return;

  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    // Obtén el valor de 'extraCharts' del documento del usuario
    const extraCharts = userSnap.data()?.extraCharts || 0;
    setCartasRestantes(extraCharts);

  } catch (error) {
    console.error("Error obteniendo el número de cartas restantes:", error);
  }
};

useEffect(() => {
  fetchCartasRestantes();
}, []);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', backAction);
  
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, []) 
  );
  const { showToast } = useToast();
  const [cartas, setCartas] = useState([]);
  const [cartasOriginales, setCartasOriginales] = useState([]); 
  const [sortOrder, setSortOrder] = useState('alfabeticamente');
  const [activeButton, setActiveButton] = useState('alfabeticamente'); 
  const [selectedCarta, setSelectedCarta] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [chartPremiumModalVisible, setChartPremiumModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(true);
  const [specialChartVisible, setSpecialChartVisible] = useState(false);
  const { t, i18n  } = useTranslation();
  const [isEdited, setIsEdited] = useState(false);
  const [translateY, setTranslateY] = useState(new Animated.Value(height));  
  
  useEffect(() => {
    if (isEdited) {
      onRefresh();
      setIsEdited(false); 
    }
  }, [isEdited]);

    const handleOpenOptions = () => {
      setModalVisible(true);
    };
    const handleCloseOptions = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false); 
      });
    };
    const handleOpenShareModal = () => {
      setShareModalVisible(true);
      handleCloseOptions();
    };
  
    const handleCloseShareModal = () => {
      setShareModalVisible(false);
    };

    const handleOpenEditModal = () => {
      setEditModalVisible(true);
      handleCloseOptions();
    };
  
    const handleCloseEditModal = () => {
      setEditModalVisible(false);
    };
 const {userData} = useUser();

 const panResponder = PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onMoveShouldSetPanResponder: () => true,
  onPanResponderMove: (event, gestureState) => {
    if (gestureState.dy > 100) {
      handleCloseOptions();
    }
  },
});

const handleOpenAddModal = async () => {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      showToast({ message: t("toast.Ups"), type: "error" });
      return;
    }

    const isEstelar = userData.membresia === 'estelar';
    const hasExtraCharts = userData.extraCharts > 0;

    if (!isEstelar && hasExtraCharts) {
      setAddModalVisible(true);
      handleCloseOptions();
      return;
    }

    if (!isEstelar && !hasExtraCharts) {
      setChartPremiumModalVisible(true);
      return;
    }

    // Si es 'estelar', siempre abre el modal (sin importar extraCharts)
    setAddModalVisible(true);
    handleCloseOptions();

  } catch (error) {
    console.error("Error al verificar el usuario:", error);
    showToast({ message: t("toast.Error_Verificacion"), type: "error" });
  }
};
    const handleCloseAddModal = () => {
      setAddModalVisible(false);
    };

    const handleOpenSpecialChartModal = () => {
      setSpecialChartVisible(true);
    };

    const handleCloseChartPremiumModal = () => {
      setChartPremiumModalVisible(false);
    };
  
    const handleCloseSpecialChartModal = () => {
      setSpecialChartVisible(false);
    };

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(height)).current;
  
useEffect(() => {
  if (modalVisible) {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }
}, [modalVisible]);


  const handleOptionsPress = (item) => {
        setSelectedCarta(item);
        handleOpenOptions();
      };

    const onRefresh = async () => {
        setRefreshing(true);
        await obtenerCartas(); // Asegúrate de que obtenerCartas termine antes de actualizar cartas restantes
        await fetchCartasRestantes();
        setRefreshing(false);
      };
      

  useFocusEffect(
    React.useCallback(() => {
      obtenerCartas();
    }, [])
  );
  
  useEffect(() => {
    ordenarCartas(cartas, sortOrder);
  }, [sortOrder]);
  
  const obtenerCartas = async () => {
    if (!auth.currentUser) {
      showToast({ message: t("toast.Auth"), type: "error" });
      return;
    }

    try {
      setLoading(true);

      const cartasRef = collection(db, 'users', auth.currentUser.uid, 'cartas');
      const querySnapshot = await getDocs(cartasRef);
      const cartasData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      setCartasOriginales(cartasData);
      ordenarCartas(cartasData, sortOrder);
    } catch (error) {
      showToast({ message: t("toast.No_Cartas"), type: "error" });
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

  const ordenarCartas = (cartasAOrdenar, orden) => {
    let cartasOrdenadas = [...cartasAOrdenar];
  
    const cartaEspecial = cartasOrdenadas.find((carta) => carta.especial === true);
    const cartasSinEspecial = cartasOrdenadas.filter((carta) => carta.especial !== true);
  
    switch (orden) {
      case 'recientes':
        cartasOrdenadas = cartasSinEspecial.sort((a, b) => b.creado.toDate() - a.creado.toDate());
        break;
      case 'antiguas':
        cartasOrdenadas = cartasSinEspecial.sort((a, b) => a.creado.toDate() - b.creado.toDate());
        break;
      case 'alfabeticamente':
        cartasOrdenadas = cartasSinEspecial.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'alfabeticamente-inverso':
        cartasOrdenadas = cartasSinEspecial.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        break;
    }
  
    if (cartaEspecial) {
      cartasOrdenadas = [cartaEspecial, ...cartasOrdenadas];
    }
  
    setCartas(cartasOrdenadas);
  };
  
  
  const [showAlert, setShowAlert] = useState(false);

  const eliminarCarta = async () => {
    if (selectedCarta) {
      setShowAlert(true);
    }
  };
  
  const confirmarEliminacion = async () => {
    try {
      const cartaRef = doc(db, 'users', auth.currentUser.uid, 'cartas', selectedCarta.id);
      await deleteDoc(cartaRef);
  
      setCartas((prevCartas) => prevCartas.filter((carta) => carta.id !== selectedCarta.id));
      setSelectedCarta(null);
      showToast({ message: t("toast.Eliminada"), type: "success" });
      handleCloseOptions();
      await onRefresh();
    } catch (error) {
      showToast({ message: t("toast.No_Eliminada"), type: "error" });
      console.error(error);
    } finally {
      setShowAlert(false); 
    }
  };
  const verCarta = (item) => {
    
    handleCloseOptions();
    navigation.navigate('ChartDetails', {
      cartaId: item.id,
      cartaData: item
    })
  };

  const handleSort = (orden) => {
    if (orden === 'alfabeticamente') {
      if (sortOrder === 'alfabeticamente') {
        setSortOrder('alfabeticamente-inverso');
        setActiveButton('alfabeticamente');
      } else {
        setSortOrder('alfabeticamente');
        setActiveButton('alfabeticamente');
      }
    } else {
      setSortOrder(orden);
      setActiveButton(orden);
    }
  };
  
   
  const renderItem = ({ item }) => (
    
    
    <View style={styles.chart}>
      {item.especial ? (
      <TouchableOpacity
        style={{flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: theme.background,}}
        onPress={() =>
          navigation.navigate('ChartDetails', {
            cartaId: item.id,
            cartaData: item
          })
        }>
        <View style={styles.chartInfoContainer}>
        <View style={styles.chartNameContainer}>
        <SpecialChartIcon style={styles.chartOptionsIcon} />
          <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.chartName, { color: '#7ebcec' }]}>
            {item.nombre} {item.apellido}
          </Text></View>
          <Text style={styles.chartText}>
          {item.fecha && item.hora ? i18n.language === 'es'
    ? new Date(`${item.fecha}T${item.hora}:00`).toLocaleDateString(
        'es-AR',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }
      ).replace(/\//g, '/')
    : `${item.fecha}`.replace(/-/g, '/') 
  : item.fecha}
          </Text>
          {item.hora ? <Text style={styles.chartText}>{item.hora}</Text> : null}
          {item.ciudad ? <Text style={styles.chartText}>{item.ciudad}</Text> : null}
        </View>
        <TouchableOpacity style={styles.specialChartIconContainer} onPress={handleOpenSpecialChartModal}>
          <View>
            <SpecialDetailsIcon style={styles.specialChartIcon} />
          </View>
        </TouchableOpacity>
      
      </TouchableOpacity>
      ) : (
        <TouchableOpacity
        style={{ flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: theme.background,}}
        onPress={() =>
          navigation.navigate('ChartDetails', {
            cartaId: item.id,
            cartaData: item
          })
        }>
        <View style={styles.chartInfoContainer}>
          <Text style={styles.chartName}>
            {item.nombre} {item.apellido}
          </Text>
          <Text style={styles.chartText}>
          {item.fecha && item.hora ? i18n.language === 'es'
    ? new Date(`${item.fecha}T${item.hora}:00`).toLocaleDateString(
        'es-AR',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }
      ).replace(/\//g, '/')
    : `${item.fecha}`.replace(/-/g, '/') 
  : item.fecha}
          </Text>
          {item.hora ? <Text style={styles.chartText}>{item.hora}</Text> : null}
          {item.ciudad ? <Text style={styles.chartText}>{item.ciudad}</Text> : null}
        </View>
        <TouchableOpacity style={styles.chartOptionsIconContainer} onPress={() => handleOptionsPress(item)}>
          <View>
            <OptionsIcon style={styles.chartOptionsIcon} />
          </View>
        </TouchableOpacity>
       
      </TouchableOpacity>)}
      <View style={{height: .6, marginVertical: 10, backgroundColor: theme.primaryBorder, marginLeft: width*0.05,}}/></View>
  );

  return  (
    
    <View style={{  margin: 'auto', height:height*1,marginTop:hp('13.5%'),
    width: width,
    backgroundColor: theme.background}}>
       
        <View style={{backgroundColor: theme.background}}>
  <View style={{height: hp('7.5%'),flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', gap: 10}}>
    <TouchableOpacity
      onPress={() => handleSort('alfabeticamente')}
      style={[
        styles.sortChartButton,
        activeButton === 'alfabeticamente' && styles.activeSortChartButton,
      ]}
    >
      <Text
        style={
          activeButton === 'alfabeticamente'
            ? styles.activeSortChartButtonText
            : styles.sortChartbuttonText
        }
      >
        A-Z
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => handleSort('recientes')}
      style={[
        styles.sortChartButton,
        activeButton === 'recientes' && styles.activeSortChartButton,
      ]}
    >
      <Text
        style={
          activeButton === 'recientes'
            ? styles.activeSortChartButtonText
            : styles.sortChartbuttonText
        }
      >
        {t("Recientes")}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => handleSort('antiguas')}
      style={[
        styles.sortChartButton,
        activeButton === 'antiguas' && styles.activeSortChartButton,
      ]}
    >
      <Text
        style={
          activeButton === 'antiguas'
            ? styles.activeSortChartButtonText
            : styles.sortChartbuttonText
        }
      >
      {t("Antiguas")}
      </Text>
    </TouchableOpacity>
  </View>
  </View>

 <FlatList
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
  ListFooterComponent={<View style={styles.chartFooter} />}
  style={{marginTop: height*.01}}
  data={loading ? Array(5).fill({}) : cartas} 
  keyExtractor={(item, index) => (loading ? index.toString() : item.id.toString())}
  nestedScrollEnabled={true}
  renderItem={({ item }) =>
    loading ? <SkeletonItem styles={styles} theme={theme}/> : renderItem({ item })
  }

  ListEmptyComponent={
    !loading && (
      <View style={{  flex: 1,
        textAlign: 'center',
        gap: 25,
        paddingTop: height*0.15,}}>
         <NoChartsIcon style={styles.noChartsIcon} />
        <Text style={styles.noChartsText}>{t("No_Cartas")}</Text>
      </View>
    )
  }
/>


        
           <LinearGradient pointerEvents="none" colors={['transparent', theme.shadowBackground, theme.shadowBackground, theme.shadowBackground]} style={{  position: 'absolute',bottom: 0, left: 0,right: 0, height: hp('35%'), zIndex: 1}}/>

         <LinearGradient
        colors={[theme.buttonGradientTop, theme.buttonGradientBottom]}
        style={{  position: 'absolute',
          alignSelf: 'center',
          bottom: height * 0.31,
          width: 50,
          height: 50,
          borderRadius: 50,
          zIndex: 2,}}
      >
         <TouchableOpacity style={styles.AddChartModalButtonIconContainer} onPress={handleOpenAddModal}>
      <AddIcon style={styles.AddChartModalButtonIcon} />
      </TouchableOpacity>
    
      {userData.membresia !== 'estelar' && (

      <Text style={styles.remainingChartsText}>{cartasRestantes}</Text>

    )}
      </LinearGradient>

      <Modal
      animationType="none"
      statusBarTranslucent={true}
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCloseOptions}
    >
              <Animated.View style={[styles.modalOptionContainer, { opacity: fadeAnim }]}>

      <TouchableWithoutFeedback onPress={handleCloseOptions}>
        <View style={styles.modalOptionContainer}>
        <Animated.View style={[styles.modalOptionContent, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.modalOptionSlider}/>
          <View style={styles.modalOptionContent}>

          <View style={styles.optionsContainer}>
  <TouchableOpacity style={styles.option} onPress={() => verCarta(selectedCarta)}>
    <Text style={styles.optionText}>{t("opciones.Ver")}</Text>
    <View style={styles.optionIcon}>
      <SeeIcon width={width * 0.05} height={width * 0.05} fill={theme.primary} />
    </View>
  </TouchableOpacity>

  <View style={styles.separatorBar} />

  {(userData.membresia === 'estelar' || !selectedCarta?.editado) && (
  <>
   <TouchableOpacity
  style={styles.option}
  onPress={() => {
    if (userData.membresia === 'estelar'  || selectedCarta?.editado) {
      handleOpenEditModal();
    } else {
      setConfirmEditModalVisible(true);
    }
  }}
>
  <Text style={styles.optionText}>{t("opciones.Editar")}</Text>
  <View style={styles.optionIcon}>
    <EditIcon width={width * 0.05} height={width * 0.05} fill={theme.primary} />
  </View>
</TouchableOpacity>

    <View style={styles.separatorBar} />
  </>
)}

  <TouchableOpacity style={styles.option} onPress={handleOpenShareModal}>
    <Text style={styles.optionText}>{t("opciones.Compartir")}</Text>
    <View style={styles.optionIcon}>
      <ShareIcon width={width * 0.05} height={width * 0.05} fill={theme.primary} />
    </View>
  </TouchableOpacity>

  {userData.membresia === 'estelar' && (
    <>
      <View style={styles.separatorBar} />

      <TouchableOpacity style={styles.option} onPress={eliminarCarta}>
        <Text style={styles.optionDeleteText}>{t("opciones.Eliminar")}</Text>
        <View style={styles.optionIcon}>
          <DeleteIcon width={width * 0.05} height={width * 0.05} fill={theme.red} />
        </View>
      </TouchableOpacity>
    </>
  )}
</View>

            
          </View></Animated.View>
        </View>
      </TouchableWithoutFeedback>
      </Animated.View>
    </Modal> 
    
    {selectedCarta && (
    <EditChartModal
        visible={editModalVisible}
        route={{ params: { cartaId: selectedCarta?.id, cartaData: selectedCarta } }}
        handleCloseEditModal={handleCloseEditModal}
        setIsEdited={setIsEdited}
    />)}
<AddChartModal
visible={addModalVisible}
handleCloseAddModal={handleCloseAddModal}
navigation={navigation}
/>
<SpecialChartModal
        visible={specialChartVisible}
        handleCloseSpecialChartModal={handleCloseSpecialChartModal}
        setSpecialChartVisible={setSpecialChartVisible}
      />
      <ChartPremiumModal
        visible={chartPremiumModalVisible}
        handleCloseChartPremiumModal={handleCloseChartPremiumModal}
        setChartPremiumModalVisible={setChartPremiumModalVisible}
      />
{shareModalVisible && (
<ShareChartModal
        visible={shareModalVisible}
        route={{ params: { cartaId: selectedCarta?.id, cartaData: selectedCarta } }}
        handleCloseShareModal={handleCloseShareModal}
      />)}
      <ConfirmEditModal
      visible={confirmEditModalVisible}
      onConfirm={() => {
    setConfirmEditModalVisible(false); handleOpenEditModal();}}
    onCancel={() => setConfirmEditModalVisible(false)}
    t={t}/>
          {selectedCarta && (<DeleteChartModal
            visible={showAlert}
            t={t}
            onClose={() => setShowAlert(false)}
            onConfirm={confirmarEliminacion}/>)}
</View>


  ) 
};



export default MyCharts;