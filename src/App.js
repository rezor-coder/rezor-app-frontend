/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import '@walletconnect/react-native-compat';
import React, { useEffect, Component, } from 'react';
import {
  UIManager,
  AppState,
  Platform,
  SafeAreaView,
  NativeModules,
  NativeEventEmitter,
  Modal,
  View
} from 'react-native';
import RouterComponent from './Router';
import KeyboardManager from 'react-native-keyboard-manager';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import reducers from './Redux/Reducers';
import { createStore, applyMiddleware } from 'redux';
import FlashMessage from 'react-native-flash-message';
import { firebase } from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';
import Singleton from './Singleton';
import * as Constants from './Constant';
import '../shim';
import { Actions } from 'react-native-router-flux';
import { EventRegister } from 'react-native-event-listeners';
import { ThemeManager } from '../ThemeManager';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-community/async-storage';
const { PreventScreenShotModule } = NativeModules;
const preventScreenShotModule = new NativeEventEmitter(PreventScreenShotModule);
import {
  transactionConfirm,
} from './Redux/Actions/WallectConnectActions';
import TransactionModal from './Components/common/TransactionModal';
import { request } from 'react-native-permissions';
import WalletConnect from './Utils/WalletConnect';
global.alert = false
export const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
let previousState = AppState.currentState;
const App = () => {
  useEffect(() => {
    let Listener_event = preventScreenShotModule.addListener(
      'screenshotEvent',
      data => {
        Actions.currentScene == 'SecureWallet' &&
          Singleton.showAlert(
            `It isn't safe to take screenshot of secret phrase`,
          );
        Actions.currentScene == 'ExportPrivateKeys' &&
          Singleton.showAlert(
            `It isn't safe to take screenshot of private key`,
          );
        Actions.currentScene == 'RecoveryPhrase' &&
          Singleton.showAlert(
            `It isn't safe to take screenshot of secret phrase`,
          );
      },
    );
    if (!__DEV__) {
      console.log = () => { };
      console.warn = () => { }
    }
    const unsubscribe = NetInfo.addEventListener(checkConnection);
    initialize();
    return () => {
      unsubscribe();
      Listener_event.remove();
      listenTheme?.remove()
    };
  }, []);

  const initialize = async () => {
    try {
      // this function is to check whelter the user has come after uninstalling the app or not , to clear the data in ios
      let device_token = await Singleton.getInstance().getData(
        Constants.device_token,
      );
      //  console.warn('MM', 'initialize');
      if (device_token == null && Platform.OS == 'ios') {
        //  console.warn('MM', 'need to clear all');
        await EncryptedStorage.clear();
        await AsyncStorage.clear();
        await Singleton.getInstance().saveData(Constants.device_token, 'true');
      }
      if (Platform.OS == 'android') {

        request('android.permission.POST_NOTIFICATIONS')
          .then(res => {
            console.log(res, 'fff');

          }).catch(er => {
            console.log('er', er);
          })
      }
      registerFCM();
      AppState.addEventListener('change', _handleAppStateChange);
    } catch (error) {
    }
  };
  const _handleAppStateChange = nextAppState => {
    try {
      if (previousState == 'background' && nextAppState == 'active') {
        console.log('previousState', previousState, 'nextAppState', nextAppState);
        EventRegister.emit('downModal', '');
        Singleton.getInstance()
          .newGetData(Constants.IS_LOGIN)
          .then(res => {
            Singleton.getInstance()
              .newGetData(Constants.PIN)
              .then(enablePin => {
                if (enablePin) {
                  if (global.callRequest) {
                    Singleton.getInstance().walletConnectRef?.showWalletData(
                      false,
                    );
                  }
                  const { isFromDapp } = store.getState()?.swapReducer
                  if (res == 1) {
                    if (!Singleton.getInstance().isCamera && !global.isCamera && !global.stop_pin) {
                      Actions.currentScene != 'ConfirmPin' &&
                        Actions.ConfirmPin();
                    } else {
                      global.isCamera = false;
                      global.stop_pin = false
                      Singleton.getInstance().isCamera = false;
                    }
                  }
                }
              });
          });
      } else if (previousState == 'active' && nextAppState == 'background') {
      }
      previousState = nextAppState;
    } catch (e) {
      console.log("appState::::::error", e);
    }
  };

  const checkConnection = state => {
    console.log('checkConnection', state.isConnected);
    global.isConnected = state.isConnected;
    global.disconnected = !state.isConnected;
    global.isInternetReachable =
      state.isInternetReachable == null ? true : state.isInternetReachable;
  };
  const registerFCM = async () => {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        firebase
          .messaging()
          .registerDeviceForRemoteMessages()
          .then(res => {
            firebase
              .messaging()
              .getToken()
              .then(async fcmToken => {
                if (fcmToken) {
                  console.warn('MM', 'FCM TOKEN app.js  ', fcmToken);
                  const saveRes = await Singleton.getInstance().newSaveData(
                    Constants.device_token,
                    fcmToken,
                  );
                  Singleton.getInstance().device_token = fcmToken;
                } else {
                }
              })
              .catch(error => {
                //console.warn('MM', 'FCM TOKEN error111  ' + error);
              });
          })
          .catch(error => {
            //console.warn('MM', 'FCdddM TOKEN error111  ' + error);
          });
      })
      .catch(error => {
        //console.warn('MM', 'FCM TOKEN error222  ' + error);
      });
  };

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  if (Platform.OS === 'ios') {
    KeyboardManager.setToolbarPreviousNextButtonEnable(true);
  }
  return (
    <>
      <View style={{ flex: 1, backgroundColor: ThemeManager.colors.bg }}>
        <Provider store={store}>
          <ApproveRequestModal
            ref={ref => (Singleton.getInstance().walletConnectRef = ref)}
            store={store}
          />
          <RouterComponent />
          <FlashMessage position="top"
          />
        </Provider>
      </View>
    </>
  );
};

export default App;
export class ApproveRequestModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlertDialog3: false,
    };
  }
  showWalletData(val) {
    this.setState({
      showAlertDialog3: val,
    });
  }
  onRejectTransaction = async (msg) => {
    let requests = WalletConnect.getInstance().web3Wallet.getPendingSessionRequests()
    console.log("--------------------------pending WC requests", requests);
    requests.map(async el => {
      const response = {
        id: el?.id,
        jsonrpc: '2.0',
        error: {
          code: 5000,
          message: 'User rejected.'
        }
      }
      try {
        await WalletConnect.getInstance().web3Wallet?.respondSessionRequest({
          topic: el?.topic,
          response: response,
        });
      } catch (e) {
        console.log('----------dapp request reject----error', e)
      }
    })
    global.wcTxnPopup = false
    Singleton.getInstance().walletConnectRef?.showWalletData(false)
    store.dispatch(transactionConfirm())
  }

  render() {
    if (!this.state.showAlertDialog3) {
      return null;
    }
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showAlertDialog3}
        onRequestClose={() => {
          this.onRejectTransaction()
        }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: ThemeManager.colors.bg }}>
          <TransactionModal store={this.props.store} />
        </SafeAreaView>
      </Modal>
    );
  }
}

