import React, { useState, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LogOutStars from '../../assets/icons/LogOutStars';
const { height: height, width: width } = Dimensions.get('screen');
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';

const LogOutModal = ({ visible, onConfirm, onCancel, t }) => {
    const { theme } = useContext(ThemeContext);
    const styles = createStyles(theme);
    const [isCancelPressed, setIsCancelPressed] = useState(false);
    const [isDeletePressed, setIsDeletePressed] = useState(false);

  return (
        <Modal transparent={true} statusBarTranslucent={true} onRequestClose={onCancel} visible={visible} animationType="fade">
    <View style={styles.overlay}>
            <View style={styles.alertLogOutbox}>
                <View style={{alignContent: 'center', alignItems: 'center', marginVertical: 'auto', paddingTop: height*.03}}>
          <Text style={styles.logOutMessage}>{t("alert.logOutTitle")}</Text>
          <Text style={styles.logOutMessage}>{t("alert.logOutSubtitle")}</Text>
          </View>
          <View style={styles.alertButtons}>
                     <TouchableOpacity
                       onPress={onCancel}
                       onPressIn={() => setIsCancelPressed(true)}
                       onPressOut={() => setIsCancelPressed(false)}
                       style={[styles.cancelButton, isCancelPressed && styles.cancelButtonPressed]}>
                       <Text style={styles.cancelText}>{t("alert.cancelar")}</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={onConfirm} onPressIn={() => setIsDeletePressed(true)}
                       onPressOut={() => setIsDeletePressed(false)}style={[styles.deleteButton, isDeletePressed && styles.deleteButtonPressed]}>
                       <Text style={styles.deleteText}>{t("alert.cerrar")}</Text>
                     </TouchableOpacity>
                   </View>
        <LogOutStars style={{position: 'absolute', fill: '#CCCCCC', width: width*.625, height: '95%', }}/>
        </View>
      </View>
    </Modal>
  );
};

export default LogOutModal;
