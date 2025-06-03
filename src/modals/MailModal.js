import { enviarMensaje } from '../config/firebaseConfig';
import { View, Text, TextInput, TouchableOpacity, Modal,StyleSheet, Alert, Dimensions } from 'react-native';
import { useState, useContext } from 'react';
import { useUser } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
const { height: height, width: width } = Dimensions.get('screen');

const MailModal = ({ visible, onClose, t }) => {
    const { showToast } = useToast();
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const { userData } = useUser();
  const { theme } = useContext(ThemeContext);
  const [isCancelPressed, setIsCancelPressed] = useState(false);
  const [isDeletePressed, setIsDeletePressed] = useState(false);
  

  const handleEnviar = async () => {
    if (!userData || !userData.email) {
      showToast({ message: t("toast.Auth"), type: "error" });
      return;
    }

    try {
      await enviarMensaje(userData.email, asunto, mensaje);
      showToast({ message: t("toast.Mensaje"), type: "error" });
      setAsunto('');
      setMensaje('');
      onClose();
    } catch (error) {
      showToast({ message: t("toast.No_Mensaje"), type: "error" });
    }
  };

  return (
     <Modal transparent={true} statusBarTranslucent={true} visible={visible} animationType="fade">
       <View style={{flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',}}>
           <View style={{backgroundColor: theme.alertModal,
          borderRadius: 12,
          width: '80%',
          paddingTop: 40,
          gap: 15,
          alignItems: 'center',}}>
        <Text style={styles(theme).logOutMessage}>{t("alert.enviarMensaje")}</Text>

        <TextInput
          placeholder={t("alert.asunto")}
          value={asunto}
          onChangeText={setAsunto}
          placeholderTextColor={theme.tertiary}
          style={{color: theme.secondary, borderColor: theme.secondary, marginBottom: 5, width: '75%', borderWidth: 1, paddingVertical: 2, paddingHorizontal: 10, borderRadius: 10 }}
        />
        <TextInput
          placeholder={t("alert.mensaje")}
          value={mensaje}
          onChangeText={setMensaje}
          multiline
          numberOfLines={12}
          placeholderTextColor={theme.tertiary}
          style={{ color: theme.secondary, borderColor: theme.secondary, marginBottom: 10,textAlignVertical: 'top', width: '75%', paddingVertical: 10, borderWidth: 1, paddingHorizontal: 10, borderRadius: 10,  }}
        />
         <View style={{ flexDirection: 'row',
          width: '100%',
          marginTop: 20,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          marginBottom: 0}}>
                             <TouchableOpacity
                               onPress={onClose}
                               onPressIn={() => setIsCancelPressed(true)}
                               onPressOut={() => setIsCancelPressed(false)}
                               style={[styles(theme).cancelButton, isCancelPressed && styles(theme).cancelButtonPressed]}>
                               <Text style={styles(theme).cancelText}>{t("alert.cancelar")}</Text>
                             </TouchableOpacity>
                             <TouchableOpacity onPress={handleEnviar} onPressIn={() => setIsDeletePressed(true)}
                               onPressOut={() => setIsDeletePressed(false)}style={[styles(theme).deleteButton, isDeletePressed && styles(theme).deleteButtonPressed]}>
                               <Text style={styles(theme).deleteText}>{t("alert.enviar")}</Text>
                             </TouchableOpacity>
                           </View>
{/* 
        <Button title="Enviar" onPress={handleEnviar} />
        <Button title="Cancelar" color="grey" onPress={onClose} /> */}
      </View></View>
    </Modal>
  );
};

const styles = (theme) => StyleSheet.create({
    alertLogOutbox: {
        backgroundColor: theme.alertModal,
        borderRadius: 12,
        width: '70%',
        paddingTop: 40,
        height: height*.475,
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      alertDeleteBox: {
        backgroundColor: theme.alertModal,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center',
      },
      alertDeleteMessage: {
        textAlign: 'center',
        paddingTop: 50,
        paddingBottom: 5,
        fontFamily: 'Effra_Regular',
        width: width*.6,
        fontSize: height * 0.022,
        color: theme.secondary,
      },
      logOutMessage: {
        textAlign: 'center',
        width: width*.55,
        fontFamily: 'Effra_Regular',
        color: theme.secondary,
        fontSize: height * 0.022,
        lineHeight: height * 0.032,
      },
      alertButtons: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 40,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        marginBottom: 0
      },
      cancelButton: {
        justifyContent: 'center',
        textAlign: 'center',
        width: '50%',
        paddingTop: 15,
        backgroundColor: theme.alertButtons,
        paddingBottom: 10,
        borderBottomLeftRadius: 12,
      },
      cancelButtonPressed: {
        backgroundColor: '#e0e0e0',
        borderBottomLeftRadius: 12,
      },
      cancelText: {
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: 'Effra_Regular',
        fontSize: height * 0.02,
        color: theme.primary,
      },
      cancelTextPressed: {
        color: '#000',
      },
      deleteButton: {
        width: '50%',
        paddingTop: 15,
        backgroundColor: theme.alertButtons,
        paddingBottom: 10,
        borderBottomRightRadius: 12,
      },
      deleteButtonPressed: {
        backgroundColor: '#ffd6d6',
        borderBottomRightRadius: 12,
      },
      deleteText: {
        color: theme.red,
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: 'Effra_Regular',
        fontSize: height * 0.02,
      },
      deleteTextPressed: {
        color: '#b30000',
      },
})

export default MailModal;
