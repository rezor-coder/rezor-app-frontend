import React from 'react';
import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  FlatList,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import styles from './ConnectWithDappStyles';
import QRReaderModal from '../../common/QRReaderModal';
import Singleton from '../../../Singleton';
import {launchImageLibrary} from 'react-native-image-picker';
import QrImageReader from 'react-native-qr-image-reader';
import {
  deleteSession,
  getRequestedSession,
  saveCallRequestId,
  wallectConnectParamsUpdate,
} from '../../../Redux/Actions/WallectConnectActions';
import {connect} from 'react-redux';
import ApproveConnection from './ApproveConnection';
import Loader from '../Loader/Loader';
import CurrencyCard2 from '../../common/CurrencyCard2';
import {Fonts} from '../../../theme';
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
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import WalletConnect from '../../../Utils/WalletConnect';
import {getCurrentRouteName, goBack} from '../../../navigationsService';
import {useRoute} from '@react-navigation/native';
let isPrivateKey = null;
const ConnectWithDapp2 = props => {
  const [visible, setvisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approveRequest, setApproveRequest] = useState(false);
  const [sessionRequestPayload, setSessionRequestPayload] = useState({});
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [selectedDapp, setSelectedDapp] = useState({});
  const [chainList, setChainList] = useState([]);
  const [setis_private_wallet] = useState('0');
  let clickDocument = false;
  const [activeSessions, setActiveSessions] = useState([]);
  const route = useRoute();

  useEffect(() => {
    route.params?.fromWallet && setvisible(true);
    let backHandle = null;
    backHandle = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      backHandle?.remove();
    };
  }, []);
  const backAction = () => {
    setvisible(false);
    Singleton.visible = false;
    setShowDisconnect(false);
    return true;
  };
  useEffect(() => {
    Singleton.getInstance()
      .newGetData(Constants.IS_PRIVATE_WALLET)
      .then(isPrivateWallet => {
        setis_private_wallet(isPrivateWallet);
        isPrivateKey = isPrivateWallet || '0';
      });
    getActiveConnections();
    EventRegister.addEventListener('wallet_connect_event', link => {
      console.log('----------------wallet_connect_event');
      Singleton.getInstance()
        .newGetData(Constants.IS_PRIVATE_WALLET)
        .then(isPrivateWallet => {
          if (isPrivateWallet != 'btc' && isPrivateWallet != 'trx') {
            initializingWalletConnect(link, true);
          }
        });
    });

    EventRegister.addEventListener('sessionProposal', data => {
      console.log('----------------sessionProposal', JSON.stringify(data));
      sessionProposalV2(data);
    });

    EventRegister.addEventListener('sessionDeleted', data => {
      console.log('----------------sessionDeleted');
      getActiveConnections();
    });
    let focus = props.navigation.addListener('focus', () => {
      Singleton.getInstance()
        .newGetData(Constants.IS_PRIVATE_WALLET)
        .then(isPrivateWallet => {
          setis_private_wallet(isPrivateWallet);
          isPrivateKey = isPrivateWallet || '0';
        });
      getActiveConnections();
      if (props?.route?.params?.url) {
        Singleton.getInstance()
          .newGetData(Constants.IS_PRIVATE_WALLET)
          .then(isPrivateWallet => {
            if (isPrivateWallet != 'btc' && isPrivateWallet != 'trx') {
              initializingWalletConnect(props?.route?.params?.url, true);
            }
          });
      }
    });

    return () => {
      focus();
    };
  }, []);
  const getActiveConnections = async () => {
    console.log('getActiveConnections');
    let sessions =
      await WalletConnect.getInstance()?.web3Wallet?.getActiveSessions();
    console.log('sessions:::::::', sessions);
    if (sessions) {
      let keys = Object?.keys(sessions);
      let connectionList = [];
      keys?.map(el => {
        connectionList.push(sessions[el]);
      });
      console.log('connectionList:::::::', JSON.stringify(connectionList));
      setActiveSessions(connectionList);
      return connectionList;
    }
  };
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
      Singleton.showAlert(
        response.error + '. Please turn on Permisssions in Settings',
      );
    } else {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.assets[0].error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets[0].customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        if (response.assets[0].uri.includes('.gif')) {
          getCurrentRouteName() == 'ConnectWithDapp' &&
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
        getCurrentRouteName() == 'ConnectWithDapp' &&
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
    setvisible(false);
    if (walletUri?.includes('relay-protocol')) {
      setLoading(true);
      try {
        let interval = setInterval(() => {
          if (WalletConnect.getInstance()?.web3Wallet != null) {
            clearInterval(interval);
            WalletConnect.getInstance()
              .connect(walletUri)
              .then(res => {
                console.log('WalletConnect.getInstance().connect_res:::', res);
                setLoading(false);
                getActiveConnections();
              })
              .catch(err => {
                console.log('connect_catch:::', err);
                Singleton.showAlert(err);
                setLoading(false);
              });
          }
        }, 1000);
      } catch (e) {
        console.log('Instance initializing_V2', e);
        setLoading(false);
      }
    }
  };

  const sessionProposalV2 = async event => {
    if (
      Object.keys(event?.params?.requiredNamespaces)
        ?.toString()
        ?.includes('eip155') ||
      Object.keys(event?.params?.optionalNamespaces)
        ?.toString()
        ?.includes('eip155')
    ) {
      console.log('if>>>>>');
      setSessionRequestPayload(event);
      setApproveRequest(true);
      setLoading(false);
    } else {
      console.log('else>>>>>');
      setLoading(false);
      Singleton.showAlert('Unsupported chain');
    }
  };

  const onRejectSession = payload => {
    setApproveRequest(false);
    WalletConnect.getInstance()?.rejectSession(payload?.id);
    setTimeout(() => {
      getActiveConnections();
    }, 100);
  };

  const onConnectionConfirm = async (currency, sessionRequestPayload) => {
    console.log(
      'sessionRequestPayload::::',
      JSON.stringify(sessionRequestPayload?.params?.optionalNamespaces.eip155),
    );
    setLoading(true);

    if (global.disconnected) {
      setLoading(false);
      Singleton.showAlert(Constants.NO_NETWORK);
      return;
    }
    if (WalletConnect.getInstance().web3Wallet) {
      try {
        let namespaces = {};
        let accounts = [];
        let chainList =
          sessionRequestPayload?.params?.optionalNamespaces.eip155?.chains;
        let requiredNamespacesChains =
          sessionRequestPayload?.params?.requiredNamespaces.eip155?.chains;
        let optionalNamespacesChains =
          sessionRequestPayload?.params?.optionalNamespaces.eip155?.chains;
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
        }
        console.log('chainList::::::', chainList);
        console.log('requiredNamespacesChains::::::', requiredNamespacesChains);
        if (
          chainList.toString()?.includes('eip155:1') ||
          chainList.toString()?.includes('eip155:56') ||
          chainList.toString()?.includes('eip155:137') ||
          chainList.toString()?.includes('eip155:1209')
        ) {
          if (requiredNamespacesChains.toString()?.includes('eip155:56')) {
            console.log('bsc::::::requiredNamespacesChains');
            accounts = [
              `eip155:56:${Singleton.getInstance().defaultEthAddress}`,
            ];
          } else if (
            requiredNamespacesChains.toString()?.includes('eip155:137')
          ) {
            console.log('matic::::::requiredNamespacesChains');
            accounts = [
              `eip155:137:${Singleton.getInstance().defaultEthAddress}`,
            ];
          } else if (
            requiredNamespacesChains.toString()?.includes('eip155:42161')
          ) {
            console.log('arbitrum::::::requiredNamespacesChains');
            accounts = [
              `eip155:137:${Singleton.getInstance().defaultEthAddress}`,
            ];
          } else if (
            requiredNamespacesChains.toString()?.includes('eip155:1209')
          ) {
            console.log('eth::::::requiredNamespacesChains');
            accounts = [
              `eip155:1209:${Singleton.getInstance().defaultEthAddress}`,
            ];
          } else if (
            requiredNamespacesChains.toString()?.includes('eip155:1')
          ) {
            console.log('eth::::::requiredNamespacesChains');
            accounts = [
              `eip155:1:${Singleton.getInstance().defaultEthAddress}`,
            ];
          } else {
            console.log('else::::::requiredNamespacesChains');
            accounts = [
              `${requiredNamespacesChains[0]}:${
                Singleton.getInstance().defaultEthAddress
              }`,

              // `eip155:56:${Singleton.getInstance().defaultEthAddress}`,
              // `eip155:137:${Singleton.getInstance().defaultEthAddress}`,
              // `eip155:1:${Singleton.getInstance().defaultEthAddress}`,
              // `eip155:1209:${Singleton.getInstance().defaultEthAddress}`,
            ];
          }
          if (optionalNamespacesChains?.toString()?.includes('eip155:137')) {
            let isPresent = accounts?.find(item =>
              item?.toString()?.includes('eip155:137:'),
            );
            if (!isPresent) {
              accounts = [
                ...accounts,
                `eip155:137:${Singleton.getInstance().defaultEthAddress}`,
              ];
            }
          }
          if (optionalNamespacesChains?.toString()?.includes('eip155:56')) {
            let isPresent = accounts?.find(item =>
              item?.toString()?.includes('eip155:56:'),
            );
            if (!isPresent) {
              accounts = [
                ...accounts,
                `eip155:56:${Singleton.getInstance().defaultEthAddress}`,
              ];
            }
          }
          if (optionalNamespacesChains?.toString()?.includes('eip155:1209')) {
            let isPresent = accounts?.find(item =>
              item?.toString()?.includes('eip155:1209:'),
            );
            if (!isPresent) {
              accounts = [
                ...accounts,
                `eip155:1209:${Singleton.getInstance().defaultEthAddress}`,
              ];
            }
          }
          if (optionalNamespacesChains?.toString()?.includes('eip155:1')) {
            let isPresent = accounts?.find(item =>
              item?.toString()?.includes('eip155:1:'),
            );
            if (!isPresent) {
              accounts = [
                ...accounts,
                `eip155:1:${Singleton.getInstance().defaultEthAddress}`,
              ];
            }
          }
          console.log('multiRequest:::::', accounts);
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
        const session =
          await WalletConnect.getInstance()?.web3Wallet?.approveSession({
            id: sessionRequestPayload?.id,
            namespaces: namespaces,
          });
        console.log('session::::', session);
        setLoading(false);
        setApproveRequest(false);
        getActiveConnections();
      } catch (error) {
        console.log('-------------err', error);
        Singleton.walletConnectObj[global.count].connector = null;
        Singleton.showAlert('Unable to connect');
        setLoading(false);
        setApproveRequest(false);
        getActiveConnections();
      }
    } else {
      setLoading(false);
      setApproveRequest(false);
    }
  };

  const onPressDapp = dapp => {
    setSelectedDapp(dapp);
    setShowDisconnect(true);
    Singleton.showDisconnect = true;
  };
  const onDisconnect = async event => {
    setLoading(true);
    try {
      await WalletConnect.getInstance().deleteSession(event);
      setLoading(false);
    } catch (error) {
      console.log('dissssss', error);
      setLoading(false);
    } finally {
      setLoading(false);
      setTimeout(() => {
        getActiveConnections();
      }, 100);
      setShowDisconnect(false);
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
            isPrivateKey={isPrivateKey}
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
                isPrivateKey={isPrivateKey}
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
                  goBack();
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
                  {activeSessions?.length > 0 && (
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
                              color: ThemeManager.colors.inActiveColor + '95',
                            },
                          ]}>
                          Wallet Listing
                        </Text>
                      </View>
                      <View
                        style={{
                          marginHorizontal: widthDimen(20),
                          borderRadius: 10,
                          marginTop: heightDimen(10),
                        }}>
                        <FlatList
                          data={activeSessions}
                          contentContainerStyle={{
                            marginVertical: heightDimen(5),
                            paddingHorizontal: widthDimen(5),
                            paddingTop: heightDimen(5),
                          }}
                          renderItem={({item, index}) => {
                            let data = item?.peer?.metadata;
                            return (
                              <CurrencyCard2
                                styleNew={styles.currencyCardStyle2}
                                image={{
                                  uri: data?.icons[data?.icons?.length - 1],
                                }}
                                onPress={() => onPressDapp(item)}
                                style={{
                                  height: areaDimen(35),
                                  width: areaDimen(35),
                                  resizeMode: 'cover',
                                }}
                                appName={data?.name != '' ? data?.name : 'Home'}
                                address={data?.url}
                              />
                            );
                          }}
                        />
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
  deleteSession,
  saveCallRequestId,
  getRequestedSession,
})(ConnectWithDapp2);
