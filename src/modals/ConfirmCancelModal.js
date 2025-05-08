import React, { useState, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, Linking } from "react-native";
const { height: height, width: width } = Dimensions.get('screen');
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';


const ConfirmCancelModal = ({ visible, onCancel, t }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  
  const [isCancelPressed, setIsCancelPressed] = useState(false);
  const [isDeletePressed, setIsDeletePressed] = useState(false);
  const openPlayStoreHome = () => {
    if (Platform.OS === 'android') {
      Linking.openURL('https://play.google.com/store')
        .catch(err => console.error('Error al abrir Play Store:', err));
    } else {
      console.warn('Esta función es solo para Android');
    }
  };
  return (
    <Modal transparent={true} statusBarTranslucent={true} onRequestClose={onCancel} visible={visible} animationType="fade">

      <View style={styles.overlay}>
        <View style={styles.alertConfirmBox}>
          <Text style={{textAlign: 'center',
          paddingTop: 45,
          fontFamily: 'Effra_Light',
          color: theme.secondary,
          width: width*.65,
          fontSize: height * 0.022,
          lineHeight: height*0.030}}>{t("alert.cancelTitle")}</Text>

          <View style={styles.alertButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>{t("alert.cancelar")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={openPlayStoreHome}>
              <Text style={styles.deleteText}>{t("alert.irATienda")}</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ConfirmCancelModal;

