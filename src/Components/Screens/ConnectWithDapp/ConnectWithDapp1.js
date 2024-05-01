import React, {useRef} from 'react';
import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  FlatList,
  AppState,
  Linking,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import styles from './ConnectWithDappStyles';
import QRReaderModal from '../../common/QRReaderModal';
import Singleton from '../../../Singleton';
import {launchImageLibrary} from 'react-native-image-picker';
import QrImageReader from 'react-native-qr-image-reader';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {SignClient} from '@walletconnect/sign-client';
import {store} from '../../../App';
import {
  deleteSession,
  getRequestedSession,
  saveCallRequestId,
  saveSession,
  wallectConnectParamsUpdate,
} from '../../../Redux/Actions/WallectConnectActions';
import {connect, useDispatch, useSelector} from 'react-redux';
import ApproveConnection from './ApproveConnection';
import {Actions} from 'react-native-router-flux';
import Loader from '../Loader/Loader';
import CurrencyCard2 from '../../common/CurrencyCard2';
import {Colors, Fonts} from '../../../theme';
import DisconnectDapp from './DisconnectDapp';
import * as Constants from '../../../Constant';
import {EventRegister} from 'react-native-event-listeners';
import {
  BasicButton,
  BorderLine,
  ButtonPrimary as Button,
  SimpleHeader,
} from '../../common';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import {QRreader} from 'react-native-qr-decode-image-camera';

import {useState} from 'react';
import {useEffect} from 'react';
import images from '../../../theme/Images';
import AsyncStorage from '@react-native-community/async-storage';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import {area} from 'd3-shape';

global.count = 0;
const ConnectWithDapp2 = props => {
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const [visible, setvisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletUri, setWalletUri] = useState('');
  const [approveRequest, setApproveRequest] = useState(false);
  const [sessionRequestPayload, setSessionRequestPayload] = useState({});
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [selectedDapp, setSelectedDapp] = useState({});
  const [count, setCount] = useState(0);
  const [chainList, setChainList] = useState([]);
  const [is_private_wallet, setis_private_wallet] = useState('0');
  const activeSessions = useSelector(
    state => state.walletConnectReducer.activeSessions,
  );
  const backhandleSetting = useRef(null);
  let clickDocument = false;

  useEffect(() => {
    global.stop_pin = false;
    Singleton.getInstance()
      .newGetData(Constants.IS_PRIVATE_WALLET)
      .then(res => {
        if (res) {
          setis_private_wallet(res);
        }
      });
    setTimeout(() => {
      setDisabled(false);
    }, 1000);
    EventRegister.addEventListener('showApprovalModal', data => {
      setSessionRequestPayload(data);
      setApproveRequest(true);
      Singleton.approveRequest = true;
      setLoading(false);
    });
    EventRegister.addEventListener('showLoader', data => {
      setLoading(true);
    });
    EventRegister.addEventListener('hideLoader', data => {
      setLoading(false);
    });
    getValues();
    return () => {};
  }, []);

  useEffect(() => {
    AsyncStorage.removeItem('wc@2:core:0.3//subscription');
    const backAction = () => {
      console.log('visible:::::', visible);
      if (loading) {
        return false;
      }
      if (
        Singleton.visible ||
        Singleton.approveRequest ||
        Singleton.showDisconnect
      ) {
        console.log('Called if');
        setvisible(false);
        Singleton.visible = false;
        setApproveRequest(false);
        Singleton.approveRequest = false;
        setShowDisconnect(false);
        Singleton.showDisconnect = false;
        EventRegister.emit('hideLoader');
        return true;
      } else {
        console.log('Called else');
        global.count = global.count + 1;
        global.isDeepLink = false;
        global.alreadyCalled = false;
        global.deepLinkUrl = '';
        global.requestFromDeepLink = false;
        global.sessionRequest == false;
        Actions.pop();
        return true;
      }
    };
    EventRegister.addEventListener('downModal', () => {
      setLoading(false);
    });
    let focus = props.navigation.addListener('didFocus', event => {
      if (global.isDeepLink) {
        setTimeout(() => {
          if (!global.alreadyCalled) {
            if (Actions.currentScene == 'ConnectWithDapp') {
              global.alreadyCalled = true;
              console.log('Called walletCOnnect navigation');
              Singleton.getInstance()
                .newGetData(Constants.IS_PRIVATE_WALLET)
                .then(isPrivateWallet => {
                  if (isPrivateWallet != 'btc' && isPrivateWallet != 'trx') {
                    initializingWalletConnect(global.deepLinkUrl, true);
                  }
                });
            }
          }
        }, 500);
      }
      if (props.url) {
        Singleton.getInstance()
          .newGetData(Constants.IS_PRIVATE_WALLET)
          .then(isPrivateWallet => {
            if (isPrivateWallet != 'btc' && isPrivateWallet != 'trx') {
              initializingWalletConnect(global.deepLinkUrl, true);
            }
          });
      }
      backhandleSetting.current = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
    });
    let blur = props.navigation.addListener('didBlur', event => {
      if (backhandleSetting) {
        backhandleSetting?.current?.remove();
      }
    });
    return () => {
      focus?.remove();
      blur?.remove();
      EventRegister.removeEventListener('downModal');
    };
  }, [visible, approveRequest, showDisconnect, loading]);
  const onPressNewConnection = () => {
    Singleton.isCameraOpen = true;
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'Camera Permission',
        message: 'SaitaPro wants to access camera to scan QR Code',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      })
        .then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
            setvisible(true);
            Singleton.visible = true;
          } else {
            Singleton.showAlert('Permission Denied');
            setvisible(false);
            Singleton.visible = false;
          }
        })
        .catch(err => {
          Singleton.showAlert(err);
          setvisible(false);
          Singleton.visible = false;
        });
    } else {
      setvisible(true);
      Singleton.visible = true;
    }
  };

  //----- Decode Uris
  const decodeUris = async uri => {
    try {
      let url;
      if (Platform.OS == 'android') {
        url = await QrImageReader.decode({path: uri});
      }
      console.log('uri===>>>>>>', uri);
      result = Platform.OS == 'ios' ? await QRreader(uri) : url.result;
      console.log('result::::::', result);
      if (result) {
        console.log(result);
        EventRegister.emit('hideLoader');
        Singleton.getInstance()
          .newGetData(Constants.IS_PRIVATE_WALLET)
          .then(isPrivateWallet => {
            if (isPrivateWallet != 'btc' && isPrivateWallet != 'trx') {
              initializingWalletConnect(result, true);
            }
          });
      } else {
        EventRegister.emit('hideLoader');
        Singleton.showAlert('Please select valid image');
      }
    } catch (E) {
      EventRegister.emit('hideLoader');
      Singleton.showAlert('Please select valid image');
    }
  };

  const imagePickerResponse = (response, eventType) => {
    setTimeout(() => {
      global.stop_pin = false;
    }, 3000);
    console.log('Response', response);
    if (Object.keys(response).includes('error')) {
      Singleton.showAlert(response.error + '. Please turn on Permisssions in Settings');
    } else {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.assets[0].error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets[0].customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        if (response.assets[0].uri.includes('.gif')) {
          Actions.currentScene == 'ConnectWithDapp' &&
            Singleton.showAlert('this media type is not supported');
          return;
        } else {
          decodeUris(response.assets[0].uri);
        }
      }
    }
  };
  const attachBtnClicked = () => {
    Singleton.isCameraOpen = true;
    global.stop_pin = true;
    launchImageLibrary(
      {
        title: 'Select Image',
        allowsEditing: true,
        quality: 0.5,
        mediaType: 'photo',
        customButtons: [],
        cameraType: 'front',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        lastMappedIndex: '',
      },
      response => {
        imagePickerResponse(response, 'SelectPhoto');
      },
    );
    setTimeout(() => {
      clickDocument = false;
    }, 1000);
  };

  const pickDocument = async () => {
    global.isCamera = true;
    if (Platform.OS == 'ios') {
      attachBtnClicked();
    } else {
      global.isCamera = true;
      try {
        global.stop_pin = true;
        console.log('----', global.stop_pin);
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.images],
        });

        console.log('RESSSSS', res);
        setvisible(false);
        Singleton.visible = false;
        setLoading(true);
        if (
          res[0].name.includes('.png') ||
          res[0].name.includes('.jpg') ||
          res[0].name.includes('.jpeg')
        ) {
          RNFetchBlob.fs
            .stat(res[0].uri)
            .then(stats => {
              console.log('stats', stats);
              decodeUris('file://' + stats.path);
            })
            .catch(err => {
              console.log('chk uri err:::::::', err);
            });
        } else {
          Actions.currentScene == 'ConnectWithDapp' &&
            Singleton.showAlert('Please select valid image');
          EventRegister.emit('hideLoader');
        }
        setTimeout(() => {
          global.stop_pin = false;
          console.log('----', global.stop_pin);
        }, 2000);
      } catch (err) {
        global.stop_pin = false;
        setLoading(false);
        console.log('Errr', err);
        if (DocumentPicker.isCancel(err)) {
        } else {
          throw err;
        }
      }
    }
  };
  const getValues = async () => {
    AppState.addEventListener('change', nextState => {
      global.alreadyCalled = false;
      setTimeout(() => {
        if (global.isDeepLink) {
          setTimeout(() => {
            if (!global.alreadyCalled) {
              if (Actions.currentScene == 'ConnectWithDapp') {
                console.log('Called walletCOnnect AppState');
                global.alreadyCalled = true;
                Singleton.getInstance()
                  .newGetData(Constants.IS_PRIVATE_WALLET)
                  .then(isPrivateWallet => {
                    if (isPrivateWallet != 'btc' && isPrivateWallet != 'trx') {
                      initializingWalletConnect(global.deepLinkUrl, true);
                    }
                  });
              }
            }
          }, 500);
        }
      }, 500);
    });
    Singleton.getInstance()
      .newGetData(Constants.ENABLE_PIN)
      .then(pin => {
        if (pin == 'false') {
          Linking.addEventListener('url', event => {
            if (Actions.currentScene !== 'DappBrowser') {
              setTimeout(async () => {
                const link = decodeURIComponent(event.url);
                if (link?.includes('https')) {
                  global.isDeepLink = true;
                  global.deepLinkUrl = link;
                  if (global.isDeepLink) {
                    setTimeout(() => {
                      if (
                        !global.alreadyCalled &&
                        Actions.currentScene == 'ConnectWithDapp'
                      ) {
                        global.alreadyCalled = true;
                        console.log('Called walletCOnnect DeepLink');
                        Singleton.getInstance()
                          .newGetData(Constants.IS_PRIVATE_WALLET)
                          .then(isPrivateWallet => {
                            if (
                              isPrivateWallet != 'btc' &&
                              isPrivateWallet != 'trx'
                            ) {
                              initializingWalletConnect(
                                global.deepLinkUrl,
                                true,
                              );
                            }
                          });
                      }
                    }, 500);
                  }
                }
              }, 500);
            }
          });
        }
      });
  };
  const requestExternalStoreageRead = async () => {
    global.isCamera = true;
    try {
      if (Platform.OS == 'ios') {
        return true;
      }
      if (Platform.Version >= 33) {
        return true;
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      console.log('granted', granted);

      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        Actions.currentScene == 'ConnectWithDapp' &&
          Singleton.showAlert('Grant storage permission in settings');
        return false;
      }
    } catch (err) {
      return false;
    }
  };
  const onImageUpload = async () => {
    if (clickDocument == false) {
      clickDocument = true;
      global.isCamera = true;
      if (await requestExternalStoreageRead()) {
        attachBtnClicked();
      }
    }
  };
  const initializingWalletConnect = async (walletUri, newSession) => {
    console.log('Called walletUri:::: ', walletUri, newSession, global.count);
    if (!global.disconnected) {
      console.log('global.count', global.count, count);
      setLoading(true);
      setCount(global.count);
      setvisible(false);
      Singleton.visible = false;
      setTimeout(() => {
        global.alreadyCalled = false;
      }, 4000);
      global.sessionRequest = false;
      global.called = true;
      setTimeout(async () => {
        Singleton.walletConnectObj = {
          [global.count]: activeSessions[activeSessions?.length - 1],
        };

        Singleton.walletConnectObj[global.count].connector = null;
        try {
          if (!Singleton.walletConnectObj[global.count]?.connector) {
            console.log('initiititit');
            console.log('ffff');
            EventRegister.emit('showLoader');
            console.log(
              'started init ',
              Singleton.walletConnectObj[global.count],
            );
            setWalletUri(walletUri);

            Singleton.walletConnectObj[global.count].connector =
              await SignClient.init({
                projectId: Constants.WALLET_CONNECT_PROJECT_ID,
                metadata: {
                  name: 'SaitaPro',
                  description:
                    'SaitaPro is here to make crypto and decentralized finance simple and safe for you. Buying crypto, trading assets, staking .',
                  url: 'https://www.saitamatoken.com/saitapro/',
                  icons: ['https://walletconnect.org/walletconnect-logo.png'],
                },
              });
            console.log(
              ' Singleton.getInstance().connector if ',
              Singleton.walletConnectObj[global.count]?.connector,
            );

            let timer = setTimeout(() => {
              console.log(
                'setttimeout Called',
                Singleton.walletConnectObj[global.count],
              );
              try {
                if (Singleton.walletConnectObj[global.count]?.connector) {
                  if (
                    !Singleton.walletConnectObj[global.count]?.connector
                      ?.connected
                  ) {
                    console.log('global.sessionReques', global.sessionRequest);
                    if (global.sessionRequest == false) {
                      console.log('global.count', global.count, count);
                      Singleton.walletConnectObj[global.count].connector = null;
                      console.log('setttimeout Called');
                      global.count = global.count + 1;
                      EventRegister.emit('hideLoader');
                      Singleton.getInstance().confirmation = null;
                      if (!global.disconnected) {
                        Actions.currentScene == 'ConnectWithDapp' &&
                          Singleton.showAlert('Invalid QR Code.');
                      } else {
                        Actions.currentScene == 'ConnectWithDapp' &&
                          Singleton.showAlert(Constants.NO_NETWORK);
                      }
                      global.isDeepLink = false;
                      global.alreadyCalled = false;
                      global.deepLinkUrl = '';
                      global.requestFromDeepLink = false;
                      global.sessionRequest == false;
                      global.called = false;
                    } else {
                      EventRegister.emit('hideLoader');
                      setTimeout(() => {
                        if (global.sessionRequest == false) {
                          Singleton.walletConnectObj[global.count].connector =
                            null;
                          console.log('setttimeout Called');
                          global.count = global.count + 1;
                          EventRegister.emit('hideLoader');
                          if (!global.disconnected) {
                            Actions.currentScene == 'ConnectWithDapp' &&
                              Singleton.showAlert('Invalid QR Code.');
                          } else {
                            Actions.currentScene == 'ConnectWithDapp' &&
                              Singleton.showAlert(Constants.NO_NETWORK);
                          }
                          global.isDeepLink = false;
                          global.deepLinkUrl = '';
                          global.alreadyCalled = false;
                          global.requestFromDeepLink = false;
                          global.sessionRequest == false;
                          global.called = false;
                        }
                      }, 1000);
                    }
                  }
                }
              } catch (e) {
                EventRegister.emit('hideLoader');
                console.log('exception--------', e);
              }
            }, 20000);
            Singleton.walletConnectObj[global.count]?.connector.on(
              'session_proposal',
              async event => {
                console.log(
                  'connected_session_proposal successfully_V2',
                  event,
                );
                clearTimeout(timer);
                sessionProposalV2(event);
              },
            );
            Singleton.walletConnectObj[global.count]?.connector.on(
              'session_delete',
              async event => {
                console.log('chk delete_event::::', event);
                deleteSessionV2(event);
              },
            );

            Singleton.walletConnectObj[global.count]?.connector.on(
              'session_request',
              async payload => {
                console.log(
                  'Transaction request from web_v2',
                  JSON.stringify(payload),
                );
                let isPrivateWallet = await Singleton.getInstance().newGetData(
                  Constants.IS_PRIVATE_WALLET,
                );
                console.log('isPrivateWallet', isPrivateWallet);
                if (
                  isPrivateWallet == 'eth' &&
                  payload?.params?.chainId?.includes('eip155:1')
                ) {
                  sessionRequestV2(payload);
                } 
                 if (
                  isPrivateWallet == 'bnb' &&
                  payload?.params?.chainId?.includes('eip155:56')
                ) {
                  sessionRequestV2(payload);
                } 
                 if (
                  isPrivateWallet == 'matic' &&
                  payload?.params?.chainId?.includes('eip155:137')
                ) {
                  sessionRequestV2(payload);
                } 
                 if (
                  isPrivateWallet == 0
                ) {
                  sessionRequestV2(payload);
                }
              },
            );
            console.log('aaaaaaaaaaaa');
            await Singleton.walletConnectObj[global.count]?.connector.pair({
              uri: walletUri,
            });
            console.log('aaaaaaaaaaaa111');
          }
        } catch (e) {
          console.log('Instance initializing', e);
          if (Singleton.walletConnectObj[global.count]) {
            Singleton.walletConnectObj[global.count].connector = null;
          }
          EventRegister.emit('hideLoader');
          global.isDeepLink = false;
          Actions.currentScene == 'ConnectWithDapp' &&
            Singleton.showAlert('Invalid QR code');
        }
      }, 1000);
    } else {
      setvisible(false);
      Singleton.visible = false;
      Actions.currentScene == 'ConnectWithDapp' &&
        Singleton.showAlert(Constants.NO_NETWORK);
    }
  };

  const sessionRequestV2 = async (payload, item) => {
    console.log('::::::::::::', JSON.stringify(payload));
    let walletConnectReducer = store.getState().walletConnectReducer;
    console.log('::::::::::::', walletConnectReducer);
    let requestedItem = walletConnectReducer?.activeSessions?.find(
      session => session?.session?.topic == payload?.topic,
    );
    console.log('requestedItem::::::::::', requestedItem);
    if (requestedItem?.session?.hasOwnProperty('pairingTopic') || true) {
      if (payload?.params?.request?.method.includes('eth_signTypedData')) {
        let approvalParam = JSON.parse(payload?.params?.request?.params[1]);
        let permitDetails = approvalParam.types.PermitDetails;
        let permitSingle = approvalParam.types.PermitSingle;
        console.log('approvalParam::::::', approvalParam);
        let newParams = {
          domain: approvalParam.domain,
          types: {
            PermitSingle: permitSingle,
            PermitDetails: permitDetails,
          },
          message: approvalParam.message,
        };
        console.log('newParams::::', newParams);
        let payloadData = {
          id: payload?.id,
          topic: payload?.topic,
          jsonrpc: '2.0',
          method: payload?.params?.request?.method,
          params: [
            {
              gas: '0',
              value: '0',
              from: payload?.params?.request?.params[0],
              to: approvalParam?.message?.details?.token,
              data: '0x0',
              gasPrice: '0',
              nonce: '0',
              approvalParam: newParams,
            },
          ],
        };
        global.callRequest = true;

        store.dispatch(
          saveCallRequestId(requestedItem?.sessionData?.params?.pairingTopic),
        );
        store.dispatch(
          wallectConnectParamsUpdate({
            prop: 'callRequestPayload',
            value: payloadData,
          }),
        );
        store.dispatch(
          wallectConnectParamsUpdate({
            prop: 'approvalParam',
            value: newParams,
          }),
        );
        let data = {
          connType: 'wcv2',
          item: requestedItem?.sessionData?.params?.pairingTopic,
        };
        store.dispatch(getRequestedSession(data));
        console.log(
          '======call_request connectwithdapp11111=====',
          payload,
          item,
        );

        if (
          Actions.currentScene != 'ConfirmPin' &&
          AppState.currentState == 'active' &&
          Actions.currentScene != 'DappBrowser'
        ) {
          console.log('show modal 1');
          Singleton.getInstance().walletConnectRef?.showWalletData(true);
        }
      } else if (
        payload?.params?.request?.method !== 'wallet_switchEthereumChain' &&
        payload?.params?.request?.method !== 'wallet_addEthereumChain'
      ) {
        setTimeout(() => {
          global.callRequest = true;
          store.dispatch(saveCallRequestId(payload.topic));
          store.dispatch(
            wallectConnectParamsUpdate({
              prop: 'callRequestPayload',
              value: payload,
            }),
          );
          store.dispatch(getRequestedSession(payload.topic));
          if (!global.requestFromDeepLink) {
            Actions.currentScene != 'ConfirmPin' &&
              Singleton.getInstance().walletConnectRef?.showWalletData(true);
          } else {
            Singleton.getInstance()
              .newGetData(Constants.ENABLE_PIN)
              .then(pin => {
                if (pin == 'false') {
                  Actions.currentScene != 'ConfirmPin' &&
                    Singleton.getInstance().walletConnectRef?.showWalletData(
                      true,
                    );
                }
              });
          }
        }, 1000);
      }
    }
  };

  const deleteSessionV2 = async event => {
    console.log('deleteSession____Event:::::', event?.topic);
    let walletConnectReducer = store.getState()?.walletConnectReducer;
    let requestedItem = walletConnectReducer?.activeSessions?.find(
      session => session?.session?.topic == event?.topic,
    );
    console.log('requestedItem:::::', requestedItem);
    let allOldSession = await Singleton.getInstance().newGetData(
      Constants.SESSION_LIST,
    );
    console.log('---------old session', allOldSession);
    let arrOldSession = JSON.parse(allOldSession);
    console.log('arrOldSession::::', arrOldSession);
    let filteredList = arrOldSession.filter(wallet => {
      return (
        wallet?.sessionData?.params?.pairingTopic !=
        requestedItem?.sessionData?.params?.pairingTopic
      );
    });
    try {
      await requestedItem.connector.disconnect({
        topic: requestedItem?.session?.topic,
        reason: {code: 1, message: 'USER_DISCONNECTED'},
      });
    } catch (error) {
      console.log('errror in disssssccont topic', error);
    }
    try {
      await requestedItem.connector.disconnect({
        topic: requestedItem?.sessionData?.params?.pairingTopic,
        reason: {code: 1, message: 'USER_DISCONNECTED'},
      });
    } catch (error) {
      console.log('errror in disssssccont pairingTopic', error);
    }
    let data = {
      item: requestedItem?.sessionData?.params?.pairingTopic,
      connType: 'wcv2',
    };
    dispatch(deleteSession(data));
    Singleton.getInstance().newSaveData(
      Constants.SESSION_LIST,
      JSON.stringify(filteredList),
    );
    Singleton.getInstance().confirmation = null;
    global.isDeepLink = false;
    global.callRequest = false;
    console.log('requestFromDeepLink 12cccc', global.requestFromDeepLink);

    global.requestFromDeepLink = false;
    Singleton.getInstance().walletConnectRef?.showWalletData(false);
    setLoading(false);
  };

  const sessionProposalV2 = async event => {
    console.log('sessionProposalV2_called');
    if (global.called) {
      console.log(
        'chainssession_request_V2:::: req ',
        event?.params?.requiredNamespaces,
      );
      console.log(
        'chainssession_request_V2::::',
        event?.params?.optionalNamespaces,
      );
      console.log('chainssession_request_V2::::');
      if (
        Object.keys(event?.params?.requiredNamespaces)
          ?.toString()
          ?.includes('eip155') ||
        Object.keys(event?.params?.optionalNamespaces)
          ?.toString()
          ?.includes('eip155')
      ) {
        console.log('here>>>>>>>>>');
        // if (Object.keys(event?.params?.requiredNamespaces)?.toString()?.includes('eip155')) {
        global.isDeepLink = false;
        global.deepLinkUrl = '';
        setLoading(false);

        let requiredNamespacesChains =
          event?.params?.requiredNamespaces?.eip155?.chains ||
          event?.params?.optionalNamespaces?.eip155?.chains;
        console.log('requiredNamespacesChains::::', requiredNamespacesChains);
        // let isPrivateWallet = await Singleton.getInstance().newGetData(
        //   Constants.IS_PRIVATE_WALLET,
        // );

        // if (isPrivateWallet == 'eth') {
        //   if (!requiredNamespacesChains?.toString()?.includes('eip155:1')) {
        //     onRejectSession(event);
        //     setLoading(false);
        //     Singleton.showAlert('Network is incompatible with Selected Wallet');
        //     return;
        //   }
        // } else if (isPrivateWallet == 'bnb') {
        //   if (!requiredNamespacesChains?.toString()?.includes('eip155:56')) {
        //     onRejectSession(event);
        //     setLoading(false);
        //     Singleton.showAlert('Network is incompatible with Selected Wallet');
        //     return;
        //   }
        // } else if (isPrivateWallet == 'matic') {
        //   if (!requiredNamespacesChains?.toString()?.includes('eip155:137')) {
        //     onRejectSession(event);
        //     setLoading(false);
        //     Singleton.showAlert('Network is incompatible with Selected Wallet');
        //     return;
        //   }
        // }
        EventRegister.emit('showApprovalModal', event);
        global.sessionRequest = true;
      } else {
        console.log('else>>>>>>>>>');
        global.isDeepLink = false;
        global.deepLinkUrl = '';
        setLoading(false);
      }
    }
  };

  const onRejectSession = payload => {
    setApproveRequest(false);
    Singleton.approveRequest = false;
    global.isDeepLink = false;
    global.alreadyCalled = false;
    global.deepLinkUrl = '';
    global.requestFromDeepLink = false;
    if (Singleton.walletConnectObj[global.count]?.connector) {
      try {
        Singleton.walletConnectObj[global.count]?.connector.reject({
          id: payload?.id,
          reason: {
            code: 5000,
            message: 'Session Rejected',
          },
        });
      } catch (error) {
        console.log('error in reject', error);
      }
    }
    global.count = global.count + 1;
  };
  // const onConnectionConfirm1 = currency => {
  //   console.log('ON Connection Confirm', Singleton.walletConnectObj[global.count]);
  //   console.log('Global.count+++At Connect', global.count);
  //   if (Singleton.walletConnectObj[global.count]?.connector) {
  //     Singleton.walletConnectObj[global.count]?.connector.approve({
  //       accounts: [currency?.coin_address],
  //       chainId: currency.chainId,
  //     });
  //     Singleton.walletConnectObj[global.count].connectionTime = new Date();
  //     Singleton.walletConnectObj[global.count].walletAddress = currency?.coin_address;
  //     Singleton.walletConnectObj[global.count].coinChain = currency?.coin_chain;
  //     dispatch(saveSession(Singleton.walletConnectObj[global.count], false));
  //     let finalSessionPayload = sessionRequestPayload;
  //     finalSessionPayload.connectionTime = new Date();
  //     finalSessionPayload.walletAddress = currency?.coin_address;
  //     finalSessionPayload.coinChain = currency?.coin_chain;
  //     dispatch(
  //       wallectConnectParamsUpdate({
  //         prop: 'sessionRequestPayload',
  //         value: finalSessionPayload,
  //       }),
  //     );
  //     global.isDeepLink = false;
  //     global.deepLinkUrl = null;
  //     setApproveRequest(false);
  //     Singleton.approveRequest = false;
  //     EventRegister.removeEventListener('showApprovalModal');
  //     EventRegister.removeEventListener('showLoader');
  //     EventRegister.removeEventListener('hideLoader');
  //     global.sessionRequest = false;
  //   } else {
  //     setApproveRequest(false);
  //     Singleton.approveRequest = false;
  //   }
  // };

  const onConnectionConfirm = async (currency, sessionRequestPayload) => {
    console.log('sessionRequestPayload::::', sessionRequestPayload);
    setLoading(true);
    if (global.disconnected) {
      setLoading(false);
      Singleton.showAlert(Constants.NO_NETWORK);
      return;
    }

    if (Singleton.walletConnectObj[global.count]?.connector) {
      try {
        let namespaces = {};
        let accounts = [];
        let chainList =
          sessionRequestPayload?.params?.optionalNamespaces.eip155?.chains;
        let requiredNamespacesChains =
          sessionRequestPayload?.params?.requiredNamespaces.eip155?.chains;
        // if (!chainList || chainList?.length == 0) {
        //   chainList = []
        // }

        if (!chainList || (chainList && chainList?.length == 0)) {
          console.log('else::::::1');
          chainList =
            sessionRequestPayload?.params?.requiredNamespaces.eip155?.chains;
        }
        if (
          !requiredNamespacesChains ||
          (requiredNamespacesChains && requiredNamespacesChains?.length == 0)
        ) {
          console.log('requiredNamespacesChains::::::1');
          requiredNamespacesChains =
            sessionRequestPayload?.params?.optionalNamespaces.eip155?.chains;
          // chainList = approveRequestData?.params?.requiredNamespaces['eip155']?.chains
        }

        console.log('chainList::::::', chainList);
        console.log('requiredNamespacesChains::::::', requiredNamespacesChains);
        if (
          chainList.toString()?.includes('eip155:1') ||
          chainList.toString()?.includes('eip155:56') ||
          chainList.toString()?.includes('eip155:137')
        ) {
          // let bnbChain = chainList.toString()?.includes('eip155:56');
          // let ethChain = chainList.toString()?.includes('eip155:1');
          // let maticChain = chainList.toString()?.includes('eip155:137');
          let isPrivateWallet = await Singleton.getInstance().newGetData(
            Constants.IS_PRIVATE_WALLET,
          );
          console.log(
            'requiredNamespacesChains:::::',
            requiredNamespacesChains,
          );
          // if (isPrivateWallet == 'eth') {
          //   if (requiredNamespacesChains.toString()?.includes('eip155:1')) {
          //     accounts.push(
          //       `eip155:1:${Singleton.getInstance().defaultEthAddress}`,
          //     );
          //   }
          // } else if (isPrivateWallet == 'bnb') {
          //   if (requiredNamespacesChains.toString()?.includes('eip155:56')) {
          //     accounts.push(
          //       `eip155:56:${Singleton.getInstance().defaultBnbAddress}`,
          //     );
          //   }
          // } else if (isPrivateWallet == 'matic') {
          //   if (requiredNamespacesChains.toString()?.includes('eip155:137')) {
          //     accounts.push(
          //       `eip155:137:${Singleton.getInstance().defaultMaticAddress}`,
          //     );
          //   }
          // } else {
          if (requiredNamespacesChains.toString()?.includes('eip155:56')) {
            console.log('bsc::::::requiredNamespacesChains');
            accounts = [
              `eip155:56:${Singleton.getInstance().defaultEthAddress}`,
              `eip155:1:${Singleton.getInstance().defaultEthAddress}`,
              `eip155:137:${Singleton.getInstance().defaultEthAddress}`,
            ];
          } else if (
            requiredNamespacesChains.toString()?.includes('eip155:1')
          ) {
            console.log('eth::::::requiredNamespacesChains');
            accounts = [
              `eip155:1:${Singleton.getInstance().defaultEthAddress}`,
              `eip155:56:${Singleton.getInstance().defaultEthAddress}`,
              `eip155:137:${Singleton.getInstance().defaultEthAddress}`,
            ];
          } else if (
            requiredNamespacesChains.toString()?.includes('eip155:137')
          ) {
            console.log('matic::::::requiredNamespacesChains');
            accounts = [
              `eip155:137:${Singleton.getInstance().defaultEthAddress}`,
              `eip155:1:${Singleton.getInstance().defaultEthAddress}`,
              `eip155:56:${Singleton.getInstance().defaultEthAddress}`,
            ];
          } else if (
            requiredNamespacesChains.toString()?.includes('eip155:42161')
          ) {
            console.log('arbitrum::::::requiredNamespacesChains');
            accounts = [
              `eip155:137:${Singleton.getInstance().defaultEthAddress}`,
              `eip155:1:${Singleton.getInstance().defaultEthAddress}`,
              `eip155:56:${Singleton.getInstance().defaultEthAddress}`,
            ];
          } else {
            console.log('else::::::requiredNamespacesChains');
            accounts = [
              `${requiredNamespacesChains[0]}:${
                Singleton.getInstance().defaultEthAddress
              }`,

              `eip155:56:${Singleton.getInstance().defaultEthAddress}`,
              `eip155:137:${Singleton.getInstance().defaultEthAddress}`,
              `eip155:1:${Singleton.getInstance().defaultEthAddress}`,
            ];
          }
          // }

          console.log('multiRequest:::::');
          namespaces = {
            eip155: {
              accounts,
              methods: [
                'eth_sendTransaction',
                'personal_sign',
                'eth_signTypedData',
                'eth_signTypedData_v4',
                'eth_sign',
              ],
              events:
                sessionRequestPayload?.params?.requiredNamespaces?.eip155
                  ?.events ||
                sessionRequestPayload?.params?.optionalNamespaces?.eip155
                  ?.events,
            },
          };
        } else {
          console.log('singleRequest:::::');
          requiredNamespacesChains?.map(chain => {
            accounts.push(
              `${chain}:${Singleton.getInstance().defaultEthAddress}`,
            );
          });
          namespaces = {
            eip155: {
              accounts,
              methods: [
                'eth_sendTransaction',
                'personal_sign',
                'eth_signTypedData',
                'eth_signTypedData_v4',
                'eth_sign',
              ],
              events:
                sessionRequestPayload?.params?.requiredNamespaces?.eip155
                  ?.events ||
                sessionRequestPayload?.params?.optionalNamespaces?.eip155
                  ?.events,
            },
          };
        }
        console.log('namespaces::::', namespaces);
        const session = await Singleton.walletConnectObj[
          global.count
        ]?.connector.approve({
          id: sessionRequestPayload?.id,
          namespaces: namespaces,
        });
        console.log('sessionDDDD', session);
        Singleton.walletConnectObj[global.count].connectionTime = new Date();
        Singleton.walletConnectObj[global.count].walletAddress =
          Singleton.getInstance().defaultEthAddress;
        Singleton.walletConnectObj[global.count].coinChain =
          requiredNamespacesChains[0].substr(
            7,
            requiredNamespacesChains[0]?.length,
          );
        Singleton.walletConnectObj[global.count].connType = 'wcv2';
        Singleton.walletConnectObj[global.count].session = session;
        Singleton.walletConnectObj[global.count].sessionData =
          sessionRequestPayload;
        Singleton.walletConnectObj[global.count].walletUri = walletUri;
        let newData = {...Singleton.walletConnectObj[global.count]};
        newData.connector = null;
        let finalData = [newData];
        console.log(
          '-_______________- connected alive ? ',
          Singleton.walletConnectObj[global.count]?.connector,
        );
        let oldSession = await Singleton.getInstance().newGetData(
          Constants.SESSION_LIST,
        );

        console.log('oldSessionoldSessionoldSessionoldSessionV2', oldSession);
        console.log('finalData 34234234234V2', finalData);
        if (oldSession != null) {
          let parsedOldSession = JSON.parse(oldSession);
          console.log('oldSession ----', parsedOldSession);
          let combinedSession = [...parsedOldSession, ...finalData];
          console.log('combinedSession:::::', combinedSession);
          Singleton.getInstance().newSaveData(
            Constants.SESSION_LIST,
            JSON.stringify(combinedSession),
          );
        } else {
          Singleton.getInstance().newSaveData(
            Constants.SESSION_LIST,
            JSON.stringify(finalData),
          );
        }

        dispatch(saveSession(Singleton.walletConnectObj[global.count], false));
        let finalSessionPayload = sessionRequestPayload;
        finalSessionPayload.connectionTime = new Date();
        finalSessionPayload.walletAddress = currency?.coin_address;
        finalSessionPayload.coinChain = currency?.coin_chain;

        dispatch(
          wallectConnectParamsUpdate({
            prop: 'sessionRequestPayload',
            value: finalSessionPayload,
          }),
        );
        global.isDeepLink = false;
        global.deepLinkUrl = null;
        setLoading(false);
        setApproveRequest(false);
        global.sessionRequest = false;
      } catch (error) {
        console.log('-------------err', error);
        Singleton.walletConnectObj[global.count].connector = null;
        setLoading(false);
        setApproveRequest(false);
        Singleton.showAlert('Unable to connect');
      }
    } else {
      setLoading(false);
      setApproveRequest(false);
    }
  };
  const ItemSeparatorComponent = () => (
    <View
      style={{
        height: 0.8,
        opacity: 1,
        width: '100%',
        backgroundColor: Colors.lightGrey,
      }}
    />
  );
  const onPressDapp = dapp => {
    setSelectedDapp(dapp);
    setShowDisconnect(true);
    Singleton.showDisconnect = true;
  };
  const onDisconnect = async (event, item) => {
    try {
      console.log('item:::::::::::', item);
      if (global.disconnected) {
        Singleton.showAlert(Constants.NO_NETWORK);
        return;
      }
      setLoading(true);
      try {
        await item.connector.disconnect({
          topic: event ? item?.session?.pairingTopic : item?.session?.topic,
          reason: {
            code: 1,
            message: 'USER_DISCONNECTED',
          },
        });
      } catch (error) {
        console.log('erro in dis', error);
      }

      console.log('deleteSession____Event:::::', item?.session?.topic);
      console.log(
        'deleteSessionV2:::::',
        item?.sessionData?.params?.pairingTopic,
      );
      let allOldSession = await Singleton.getInstance().newGetData(
        Constants.SESSION_LIST,
      );
      let arrOldSession = JSON.parse(allOldSession);
      console.log('arrOldSession::::', arrOldSession);

      let filteredList = arrOldSession.filter(wallet => {
        return (
          wallet?.sessionData?.params?.pairingTopic !=
          item?.sessionData?.params?.pairingTopic
        );
      });
      let data = {
        item: item?.sessionData?.params?.pairingTopic,
        connType: 'wcv2',
      };
      dispatch(deleteSession(data));
      Singleton.getInstance().newSaveData(
        Constants.SESSION_LIST,
        JSON.stringify(filteredList),
      );
      Singleton.getInstance().confirmation = null;
      global.isDeepLink = false;
      global.callRequest = false;
      console.log('requestFromDeepLink 12', global.requestFromDeepLink);

      global.requestFromDeepLink = false;
      Singleton.getInstance().walletConnectRef?.showWalletData(false);
      setLoading(false);
      setShowDisconnect(false);
    } catch (error) {
      console.log('dissssss', error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: ThemeManager.colors.bg}]}>
      {visible ? (
        <QRReaderModal
          visible={visible}
          setvisible={setvisible}
          onCodeRead={initializingWalletConnect}
          onImageUpload={onImageUpload}
        />
      ) : approveRequest ? (
        <>
          <ApproveConnection
            onRejectSession={onRejectSession}
            visible={approveRequest}
            setvisible={setApproveRequest}
            chainList={chainList}
            isPrivateKey={is_private_wallet}
            sessionRequestPayload={sessionRequestPayload}
            onConnectionConfirm={onConnectionConfirm}
          />
        </>
      ) : (
        <>
          {showDisconnect ? (
            <>
              <DisconnectDapp
                visible={showDisconnect}
                setvisible={setShowDisconnect}
                selectedDapp={selectedDapp}
                chainList={chainList}
                isPrivateKey={is_private_wallet}
                onDisconnect={onDisconnect}
              />
            </>
          ) : (
            <>
              <SimpleHeader
                title={LanguageManager.WalletConnect}
                backImage={ThemeManager.ImageIcons.iconBack}
                titleStyle
                imageShow
                back={false}
                backPressed={() => {
                  global.count = global.count + 1;
                  global.isDeepLink = false;
                  global.alreadyCalled = false;
                  global.deepLinkUrl = '';
                  global.requestFromDeepLink = false;
                  global.sessionRequest == false;
                  Actions.pop();
                }}
              />
              <BorderLine
                borderColor={{
                  backgroundColor: ThemeManager.colors.viewBorderColor,
                }}
              />
              <View style={styles.innerContainer}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.headTextStyle,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {' '}
                  To make transactions, link your wallet to Wallet Connect.{' '}
                </Text>
                <View style={{flex: 1}}>
                  {activeSessions?.filter(
                    item => item.coinChain !== '' && item.connector,
                  )?.length !== 0 && (
                    <View style={styles.walletListingStyle}>
                      <View
                        style={{
                          borderWidth: 1,
                          borderRadius: 100,
                          height: heightDimen(50),
                          marginHorizontal: widthDimen(22),
                          justifyContent: 'center',
                          marginTop: heightDimen(20),
                          borderColor: ThemeManager.colors.viewBorderColor,
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.walletListingTextStyle,
                            {
                              fontSize: areaDimen(14),
                              // lineHeight:areaDimen(50),
                              color: ThemeManager.colors.inActiveColor+'95',
                              // height:heightDimen(50),
                            },
                          ]}>
                          Wallet Listing
                        </Text>
                      </View>
                      <View
                        style={{
                          margin: 20,
                          backgroundColor: ThemeManager.colors.mnemonicsView,
                          borderRadius: 10,
                        }}>
                        {activeSessions?.filter(
                          item =>
                            item.coinChain !== '' && item.connector !== null,
                        )?.length !== 0 && (
                          <FlatList
                            data={activeSessions?.filter(
                              item =>
                                item.coinChain !== '' &&
                                item.connector !== null,
                            )}
                            contentContainerStyle={{marginVertical:heightDimen(10),marginHorizontal:widthDimen(5)}}
                            renderItem={({item, index}) => {
                              if (!item.connector) {
                                return null;
                              } else {
                                return (
                                  <CurrencyCard2
                                    disabled={disabled}
                                    styleNew={styles.currencyCardStyle2}
                                    image={
                                      item?.sessionData?.params?.proposer
                                        ?.metadata?.icons[0]
                                        ? {
                                            uri: item?.sessionData?.params
                                              ?.proposer?.metadata?.icons[
                                              item?.sessionData?.params
                                                ?.proposer?.metadata?.icons
                                                ?.length - 1
                                            ],
                                          }
                                        : images.icon_walletConnect
                                    }
                                    onPress={() => onPressDapp(item)}
                                    style={{
                                      height: areaDimen(35),
                                      width: areaDimen(35),
                                      resizeMode: 'cover',
                                    }}
                                    appName={
                                      item?.sessionData?.params?.proposer
                                        ?.metadata?.name || 'Home'
                                    }
                                    address={
                                      item?.sessionData?.params?.proposer
                                        ?.metadata?.url
                                    }
                                  />
                                );
                              }
                            }}
                            ItemSeparatorComponent={ItemSeparatorComponent}
                          />
                        )}
                      </View>
                    </View>
                  )}
                </View>
                <BasicButton
                  onPress={() => {
                    onPressNewConnection();
                  }}
                  customGradient={{width: widthDimen(370), alignSelf: 'center'}}
                  textStyle={{
                    fontSize: 16,
                    fontFamily: Fonts.medium,
                    paddingVertical: 5,
                  }}
                  text="New Connection"
                  disabled={disabled}
                />
              </View>
            </>
          )}
        </>
      )}
      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
};

const mapStateToProp = state => {
  const {activeSessions, appActiveSessions} = state.walletConnectReducer;
  const walletConnectReducer = state.walletConnectReducer;
  return {activeSessions, appActiveSessions, walletConnectReducer};
};

export default connect(mapStateToProp, {
  wallectConnectParamsUpdate,
  saveSession,
  deleteSession,
  saveCallRequestId,
  getRequestedSession,
})(ConnectWithDapp2);
