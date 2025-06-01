/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import '@walletconnect/react-native-compat';
import React, {useEffect, Component} from 'react';
import {
  UIManager,
  AppState,
  Platform,
  SafeAreaView,
  NativeModules,
  NativeEventEmitter,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import {Provider, useDispatch} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import reducers, {persistor, store} from './Redux/Reducers';
import {createStore, applyMiddleware} from 'redux';
import FlashMessage from 'react-native-flash-message';
import {firebase} from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';
import Singleton from './Singleton';
import * as Constants from './Constant';
import '../shim';
import {EventRegister} from 'react-native-event-listeners';
import {ThemeManager} from '../ThemeManager';
import EncryptedStorage from 'react-native-encrypted-storage';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {PreventScreenShotModule} = NativeModules;
const preventScreenShotModule = new NativeEventEmitter(PreventScreenShotModule);
import {transactionConfirm} from './Redux/Actions/WallectConnectActions';
import TransactionModal from './Components/common/TransactionModal';
import {request} from 'react-native-permissions';
import WalletConnect from './Utils/WalletConnect';
import {AppView} from './Components/common/AppView';
import {cardUserdata, getAppVersion} from './Redux/Actions';
import Routes from './Navigation/Routes';
import {getCurrentRouteName, navigate} from './navigationsService';
import {NavigationStrings} from './Navigation/NavigationStrings';
import {PersistGate} from 'redux-persist/integration/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import DeviceInfo from 'react-native-device-info';
global.alert = false;
let previousState = AppState.currentState;
const App = () => {
  const dispatch = useDispatch();
  let access_token = Singleton.getInstance().access_token;
  const queryClient = new QueryClient();

  const promptUpdate = () => {
    Alert.alert(
      'Update Required',
      'A new version of the app is available. Please update to continue.',
      [{text: 'Update Now', onPress: () => redirectToAppStore()}],
      {cancelable: false},
    );
  };

  const redirectToAppStore = () => {
    const playStoreLink =
      'https://play.google.com/store/apps/details?id=com.rezor&hl=en';
    Linking.openURL(playStoreLink);
  };

  const checkAppVersion = () => {
    dispatch(getAppVersion(access_token))
      .then(res => {
        console.log('-------', res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkAppVersion();
    const currentVersion = DeviceInfo.getBuildNumber();
    if (currentVersion < 11) {
      promptUpdate();
    }
    Singleton.getInstance()
      .newGetData(Constants.USER_DATA)
      .then(res => {
        cardUserdata(store.dispatch, JSON.parse(res));
      })
      .catch(error => {
        console.log('res::::::', error);
      });
    let Listener_event = preventScreenShotModule.addListener(
      'screenshotEvent',
      data => {
        getCurrentRouteName() == 'SecureWallet' &&
          Singleton.showAlert(
            `It isn't safe to take screenshot of secret phrase`,
          );
        getCurrentRouteName() == 'ExportPrivateKeys' &&
          Singleton.showAlert(
            `It isn't safe to take screenshot of private key`,
          );
        getCurrentRouteName() == 'RecoveryPhrase' &&
          Singleton.showAlert(
            `It isn't safe to take screenshot of secret phrase`,
          );
      },
    );
    if (!__DEV__) {
      console.log = () => {};
      console.warn = () => {};
    }
    const unsubscribe = NetInfo.addEventListener(checkConnection);
    initialize();
    return () => {
      unsubscribe();
      Listener_event.remove();
      // listenTheme?.remove();
    };
  }, []);

  const initialize = async () => {
    try {
      // this function is to check whelter the user has come after uninstalling the app or not , to clear the data in ios
      let device_token = await Singleton.getInstance().getData(
        Constants.device_token,
      );
      if (device_token == null && Platform.OS == 'ios') {
        await EncryptedStorage.clear();
        await AsyncStorage.clear();
        await Singleton.getInstance().saveData(Constants.device_token, 'true');
      }
      if (Platform.OS == 'android') {
        request('android.permission.POST_NOTIFICATIONS')
          .then(res => {
            console.log(res, 'fff');
          })
          .catch(er => {
            console.log('er', er);
          });
      }
      registerFCM();
      AppState.addEventListener('change', _handleAppStateChange);
    } catch (error) {}
  };
  const _handleAppStateChange = nextAppState => {
    try {
      if (previousState == 'background' && nextAppState == 'active') {
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
                  const {isFromDapp} = store.getState()?.swapReducer;
                  if (res == 1) {
                    if (
                      !Singleton.getInstance().isCamera &&
                      !global.isCamera &&
                      !global.stop_pin
                    ) {
                      getCurrentRouteName() != 'ConfirmPin' &&
                        navigate(NavigationStrings.ConfirmPin);
                    } else {
                      global.isCamera = false;
                      global.stop_pin = false;
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
      console.log('appState::::::error', e);
    }
  };

  const checkConnection = state => {
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
                  const saveRes = await Singleton.getInstance().newSaveData(
                    Constants.device_token,
                    fcmToken,
                  );
                  Singleton.getInstance().device_token = fcmToken;
                } else {
                }
              })
              .catch(error => {
                console.warn('MM', 'FCM TOKEN error111  ' + error);
              });
          })
          .catch(error => {
            console.warn('MM', 'FCdddM TOKEN error111  ' + error);
          });
      })
      .catch(error => {
        console.warn('MM', 'FCM TOKEN error222  ' + error);
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
    <QueryClientProvider client={queryClient}>
      {Platform.OS == 'ios' ? (
        <>
        {/* <Provider store={store}> */}
          {/* <PersistGate loading={null} persistor={persistor}> */}
            <ApproveRequestModal
              ref={ref => (Singleton.getInstance().walletConnectRef = ref)}
              store={store}
            />
            <Routes />
            <FlashMessage position="top" />
          {/* </PersistGate> */}
        {/* </Provider> */}
        </>
      ) : (
        <AppView>
          {/* <Provider store={store}> */}
            {/* <PersistGate loading={null} persistor={persistor}> */}
              <ApproveRequestModal
                ref={ref => (Singleton.getInstance().walletConnectRef = ref)}
                store={store}
              />
              <Routes />
              <FlashMessage position="top" />
            {/* </PersistGate> */}
          {/* </Provider> */}
        </AppView>
      )}
    </QueryClientProvider>
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
  onRejectTransaction = async msg => {
    let requests =
      WalletConnect.getInstance().web3Wallet.getPendingSessionRequests();
    requests.map(async el => {
      const response = {
        id: el?.id,
        jsonrpc: '2.0',
        error: {
          code: 5000,
          message: 'User rejected.',
        },
      };
      try {
        await WalletConnect.getInstance().web3Wallet?.respondSessionRequest({
          topic: el?.topic,
          response: response,
        });
      } catch (e) {
        console.log('----------dapp request reject----error', e);
      }
    });
    global.wcTxnPopup = false;
    Singleton.getInstance().walletConnectRef?.showWalletData(false);
    store.dispatch(transactionConfirm());
  };

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
          this.onRejectTransaction();
        }}>
        <SafeAreaView
          style={{flex: 1, backgroundColor: ThemeManager.colors.bg}}>
          <TransactionModal store={this.props.store} />
        </SafeAreaView>
      </Modal>
    );
  }
}
