import React, { useState, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
const { height: height, width: width } = Dimensions.get('screen');
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';


const ConfirmEditModal = ({ visible, onConfirm, onCancel, t }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  
  const [isCancelPressed, setIsCancelPressed] = useState(false);
  const [isDeletePressed, setIsDeletePressed] = useState(false);

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
          lineHeight: height*0.030}}>{t("alert.editTitle")}</Text>

          <View style={styles.alertButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>{t("alert.cancelar")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
              <Text style={styles.deleteText}>{t("alert.editar")}</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ConfirmEditModal;

