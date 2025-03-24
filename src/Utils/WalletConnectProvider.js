import React, {useEffect} from 'react';
import WalletConnect from '@walletconnect/react-native-compat';
// import ApproveRequestModal from './ApproveRequestModal'; // Import your modal

const WalletConnectProvider = ({onRequestReceived}) => {
  const connector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org',
  });

  useEffect(() => {
    if (connector.connected) {
      // Handle already connected state
    } else {
      // Listen for session requests
      connector.on('session_request', (error, payload) => {
        if (error) {
          throw error;
        }
        // Call the passed function to show the modal
        onRequestReceived(payload);
      });

      connector.on('disconnect', error => {
        if (error) {
          throw error;
        }
      });
    }

    return () => {
      connector.killSession(); // Cleanup on unmount
    };
  }, [connector]);

  return null; // This component does not render anything
};

export default WalletConnectProvider;
