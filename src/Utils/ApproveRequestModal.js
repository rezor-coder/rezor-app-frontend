import React, { useEffect, Component, useState, useRef } from 'react';
import WalletConnect from './WalletConnect';
import TransactionModal from '../Components/common/TransactionModal';
import {
    UIManager,
    AppState,
    Platform,
    SafeAreaView,
    NativeModules,
    NativeEventEmitter,
    Modal,
    View,
    BackHandler
  } from 'react-native';

const ApproveRequestModal = React.forwardRef((props, ref) => {
  const {visible, payload, onClose, store} = props;

  const onRejectTransaction = async () => {
    if (payload) {
      const response = {
        id: payload.params[0].id,
        jsonrpc: '2.0',
        error: {
          code: 5000,
          message: 'User rejected.',
        },
      };

      await WalletConnect.getInstance().web3Wallet.respondSessionRequest({
        topic: payload.topic,
        response,
      });
    }
    onClose();
  };

  useEffect(() => {
    if (payload) {
      console.log('Session request received:', payload);
    }
  }, [payload]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRejectTransaction}>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <TransactionModal store={store} />
      </SafeAreaView>
    </Modal>
  );
});

export default ApproveRequestModal;
