import {
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  requestSubscription,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';
import { Platform } from 'react-native';

let purchaseUpdateSubscription = null;
let purchaseErrorSubscription = null;

const setupIAP = async (purchaseUpdateCallback, purchaseErrorCallback) => {
  try {
    await initConnection();
    // Limpiar compras fallidas pendientes en Android
    await flushFailedPurchasesCachedAsPendingAndroid().catch(() => {
      // Manejar posibles errores (ver documentación)
    });

    purchaseUpdateSubscription = purchaseUpdatedListener(
      (purchase) => { // Removemos los tipos
        console.log('iapService - purchaseUpdatedListener', purchase);
        if (purchase && purchase.transactionReceipt) {
          purchaseUpdateCallback(purchase);
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      (error) => { // Removemos el tipo
        console.warn('iapService - purchaseErrorListener', error);
        purchaseErrorCallback(error);
      },
    );

    console.log('iapService - Conexión a IAP establecida y listeners configurados.');
    return true;
  } catch (error) {
    console.error('iapService - Error al inicializar la conexión a IAP:', error);
    return false;
  }
};

const requestPurchaseItem = async (sku) => { // Removemos el tipo
  try {
    let purchaseParams = {
      sku,
      andDangerouslyFinishTransactionAutomaticallyIOS: false,
    };
    if (Platform.OS === 'android') {
      purchaseParams = { skus: [sku] };
    }
    const purchase = await requestPurchase(purchaseParams);
    return purchase;
  } catch (error) {
    console.warn('iapService - Error al solicitar la compra:', error.code, error.message);
    throw error;
  }
};

const requestSubscriptionItem = async (sku, offerToken) => { // Removemos los tipos
  try {
    const purchase = await requestSubscription({
      sku,
      ...(offerToken && { subscriptionOffers: [{ sku, offerToken }] }),
    });
    return purchase;
  } catch (error) {
    console.warn('iapService - Error al solicitar la suscripción:', error.code, error.message);
    throw error;
  }
};

const finishTransactionItem = async (purchase, isConsumable) => { // Removemos los tipos
  try {
    await finishTransaction({ purchase, isConsumable });
    console.log('iapService - Transacción finalizada para:', purchase.productId);
  } catch (error) {
    console.error('iapService - Error al finalizar la transacción:', error);
  }
};

const clearIAP = () => {
  if (purchaseUpdateSubscription) {
    purchaseUpdateSubscription.remove();
    purchaseUpdateSubscription = null;
  }
  if (purchaseErrorSubscription) {
    purchaseErrorSubscription.remove();
    purchaseErrorSubscription = null;
  }
  console.log('iapService - Listeners de IAP removidos.');
};

export const iapService = {
  setupIAP,
  requestPurchase: requestPurchaseItem,
  requestSubscription: requestSubscriptionItem,
  finishTransaction: finishTransactionItem,
  clearIAP,
};