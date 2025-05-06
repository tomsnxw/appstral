import React, { useState, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
const { height: height, width: width } = Dimensions.get('screen');
import { ThemeContext } from '../contexts/ThemeContext';
import { createStyles } from '../utils/styles';


const DeleteChartModal = ({ visible, onClose, onConfirm, t }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const [isCancelPressed, setIsCancelPressed] = useState(false);
  const [isDeletePressed, setIsDeletePressed] = useState(false);

  return (
    <Modal transparent={true} statusBarTranslucent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertDeleteBox}>
          <Text style={styles.alertDeleteMessage}>{t("alert.deleteTitle")}</Text>
          <View style={styles.alertButtons}>
            <TouchableOpacity
              onPress={onClose}
              onPressIn={() => setIsCancelPressed(true)}
              onPressOut={() => setIsCancelPressed(false)}
              style={[styles.cancelButton, isCancelPressed && styles.cancelButtonPressed]}>
              <Text style={styles.cancelText}>{t("alert.cancelar")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} onPressIn={() => setIsDeletePressed(true)}
              onPressOut={() => setIsDeletePressed(false)}style={[styles.deleteButton, isDeletePressed && styles.deleteButtonPressed]}>
              <Text style={styles.deleteText}>{t("alert.eliminar")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteChartModal;
