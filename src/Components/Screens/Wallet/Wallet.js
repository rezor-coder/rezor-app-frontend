/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View, Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Dimensions,
  Modal,
  Linking,
  BackHandler,
  Alert,
  StatusBar,
  AppState,
} from 'react-native';
import {
  Wrap,
  MainHeader,
  BasicButton,
  PinInput,
  KeyboardDigit,
  SimpleHeader,
} from '../../common/index';
import styles from './WalletStyle';
import { Colors, Images } from './../../../theme/index';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { useDispatch, useSelector } from 'react-redux';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import {
  fetchBankDetails,
  getCardList,
  getDexUrls,
  getMyWallets,
  getRouterDetails,
  getUserCardAddress,
  getUserCardDetail,
} from '../../../Redux/Actions';
import Loader from '../Loader/Loader';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { EventRegister } from 'react-native-event-listeners';
import { exponentialToDecimalWithoutComma } from '../../../utils';
import FastImage from 'react-native-fast-image';
import fonts from '../../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import images from '../../../theme/Images';
import WalletCard from './WalletCard';
import WalletHomeCard from './WalletHomeCard';
import DepositModalCard from '../SaitaCardBlack/DepositModalCard';
import SelectNetworkPopUp from '../../common/SelectNetworkPopUp';
import WalletConnect from '../../../Utils/WalletConnect';
import { wallectConnectParamsUpdate } from '../../../Redux/Actions/WallectConnectActions';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import messaging from '@react-native-firebase/messaging';
import { showMessage } from 'react-native-flash-message';
let Page = 1;
let stopAsk = false;
const tabs = ['Tokens', 'SaitaCard', 'Staking'];
const Wallet = props => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const CoinData = useSelector(state => state?.walletReducer?.myWallets);
  const { totalBalance, lastDepositData } = useSelector(
    state => state?.walletReducer,
  );
  const themeChange = useSelector(state => state.mnemonicreateReducer?.currentTheme)
  const [accessTokenCard, setAccessTokenCard] = useState(null);
  const [isIncompatible, setInCompatible] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const gradientColor = [
    '#9ABFFF',
    '#4C80FF',
    '#6F6CFF',
    '#4C80FF',
  ]
  const [viewKey, setViewKey] = useState(new Date())
  const [activeWallet, setActiveWallet] = useState(null);
  const [PinModal, setPinModal] = useState(false);
  const [cardActive, setCardActive] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [walletsDetailData, setWalletsDetailData] = useState([]);
  const [showBalance, setShowBalance] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [showDetails, setShowdetails] = useState(false);
  const [showSelectChain, setshowSelectChain] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [Pin, setPin] = useState('');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '**** **** **** ****',
    cvv: 'XXX',
    expire: 'MM/YY',
  });
  const [actualCardInfo, setActualCardInfo] = useState({
    cardNumber: '**** **** **** ****',
    cvv: 'XXX',
    expire: 'MM/YY',
  });

  useEffect(() => {
    Notification();
    getRouterDetailsApi()
    EventRegister.addEventListener('themeChanged', () => {
      setViewKey(new Date())
    })
    initialCall();
    let backHandle = null;
    backHandle = BackHandler.addEventListener('hardwareBackPress', backAction);
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(res => {
        setAccessTokenCard(res);
      });
    EventRegister.addEventListener('requestFromDapp', data => {
      dispatch(wallectConnectParamsUpdate({ prop: 'wcTransactionInfo', value: data?.payload, }));
      dispatch(wallectConnectParamsUpdate({ prop: 'wcCoinFamily', value: data?.coinFamily, }));
      if (Actions.currentScene != 'ConfirmPin') {
        Singleton.getInstance().walletConnectRef?.showWalletData(true);
      } else {
        global.wcTxnPopup = true;
      }
    });
    EventRegister.addEventListener('downModal', () => {
      setPinModal(false)
    })
    addDeepLinkListner();
    let focus = props.navigation.addListener('didFocus', () => {
      Notification();
      getRouterDetailsApi()
      setPinModal(false)
      backHandle = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      setActiveTab('Tokens')
      initialCall();
    });
    let blur = props.navigation.addListener('didBlur', () => {
      backHandle?.remove();
    });
    return () => {
      backHandle?.remove();
      focus?.remove();
      blur?.remove();
      EventRegister.removeEventListener('themeChanged')
      EventRegister.removeEventListener('downModal')
    };
  }, []);
  const handleNotification = data => {
    console.log('AppState.currentState::::::', AppState.currentState);
    if (AppState.currentState == 'active') {
      global.isAppOpen = true;
    }
    global.isNotification = true;
  };
  useEffect(() => {
    if (activeTab == 'SaitaCard') {
      getCardDetails();
    }
  }, [activeTab]);
  const backAction = () => {
    if (!stopAsk) {
      stopAsk = true;
      Alert.alert(
        Constants.APP_NAME,
        'Are you sure you want to exit the app?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              stopAsk = false;
            },
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => {
              stopAsk = false;
              BackHandler.exitApp();
            },
          },
        ],
      );
    }
    return true;
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDetails();
  }, []);
  const getRouterDetailsApi = () => {
    dispatch(getRouterDetails())
      .then(response => {
        console.warn('MM', 'response== router ==== pin', response.data);
        let instance = Singleton.getInstance();
        instance.SwapRouterAddress = response.data.Router;
        instance.SwapFactoryAddress = response.data.Factory;
        instance.StakeSaitamaAddress = response.data.SaitamaAddress;
        instance.StakingContractAddress = response.data.StakingContractAddress;
        instance.SwapWethAddress = response.data.WethAddress;
        instance.SwapRouterBNBAddress = response.data.BnbRouter;
        instance.SwapRouterStcAddress = response.data.StcRouter;
        instance.SwapRouterStcAddress = response.data.StcRouter;
        instance.SwapWBNBAddress = response.data.WbnbAddress;
        instance.SwapWethAddressSTC = response.data.StcWeth;
        instance.SwapFactoryAddressSTC = response.data.StcFactory;
        instance.SwapFactoryAddressBNB = response.data.BnbFactory;
      })
      .catch(error => {
        //console.warn('MM','error==contract=== pin', error);
      });
  };
  const handleDeepLink = event => {
    if (Actions.currentScene == 'DappBrowser') {
      Singleton.getInstance().isCamera = true;
      global.isCamera = true;
      global.stop_pin = true;
    }
    setTimeout(async () => {
      const decodedLink = decodeURIComponent(event.url);
      const link = decodedLink.includes('saitapro')
        ? decodedLink
          .replace('saitapro:///wc?uri=', '')
          .replace('saitapro://wc?uri=', '')
          .replace('saitapro://app/wc?uri=', '')
        : decodedLink;
      if (link.includes('requestId=') || link.includes('sessionTopic=')) {
        if (Actions.currentScene == 'DappBrowser') {
          global.requestFromDeepLink = false;
        } else {
          global.requestFromDeepLink = true;
        }
      } else {
        Singleton.getInstance()
          .newGetData(Constants.IS_LOGIN)
          .then(res => {
            if (res == 1) {
              Singleton.getInstance()
                .newGetData(Constants.ENABLE_PIN)
                .then(pin => {
                  if (pin == 'false') {
                    if (Actions.currentScene !== 'ConnectWithDapp') {
                      Actions.ConnectWithDapp({ url: link });
                    } else {
                      EventRegister.emitEvent('wallet_connect_event', link);
                    }
                  } else {
                    if (Actions.currentScene == 'DappBrowser') {
                      Actions.ConnectWithDapp({ url: link });
                    } else {
                      global.isDeepLink = true;
                      global.deepLinkUrl = link;
                    }
                  }
                });
            }
          });
      }
    }, 500);
  };
  const addDeepLinkListner = () => {
    try {
      Linking.addEventListener('url', event => handleDeepLink(event));
      Linking.getInitialURL()
        .then(url => {
          console.log('------killed------', url);
          if (url) {
            Linking.canOpenURL(url).then(async supported => {
              // console.log('------killed------', url);
              if (supported) {
                const decodedLink = decodeURIComponent(url);
                const link = decodedLink.includes('saitapro')
                  ? decodedLink
                    .replace('saitapro:///wc?uri=', '')
                    .replace('saitapro://wc?uri=', '')
                    .replace('saitapro://app/wc?uri=', '')
                  : decodedLink;
                if (link?.includes('relay')) {
                  Singleton.getInstance()
                    .newGetData(Constants.IS_LOGIN)
                    .then(res => {
                      if (res == 1) {
                        Singleton.getInstance()
                          .newGetData(Constants.ENABLE_PIN)
                          .then(pin => {
                            if (pin == 'false') {
                              if (Actions.currentScene !== 'ConnectWithDapp') {
                                Actions.ConnectWithDapp({ url: link });
                              } else {
                                EventRegister.emitEvent(
                                  'wallet_connect_event',
                                  link,
                                );
                              }
                            } else {
                              global.isDeepLink = true;
                              global.deepLinkUrl = link;
                            }
                          });
                      }
                    });
                } else {
                  global.requestFromDeepLink = true;
                }
              } else {
                global.requestFromDeepLink = true;
              }
            });
          }
        })
        .catch(e => console.log('errr::::::', e));
    } catch (e) {
      console.log('deeplink listener error::::::', e);
    }
  };
  const getActiveConnections = async () => {
    let sessions =
      await WalletConnect.getInstance()?.web3Wallet?.getActiveSessions();
    if (sessions) {
      let keys = Object?.keys(sessions);
      let connectionList = [];
      keys?.map(el => {
        connectionList.push(sessions[el]);
      });
      setDappList(connectionList);

      return connectionList;
    }
  };
  const initialCall = () => {
    WalletConnect.getInstance();
    getActiveConnections();
    Singleton.getInstance()
      .newGetData(Constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (isPrivate == null || isPrivate == '0') {
          isPrivate = 0;
        }
        setActiveWallet(isPrivate);
        if (!isPrivate) {
          setInCompatible(false);
        } else if (isPrivate != 'bnb' && isPrivate != 'eth' && isPrivate != 0) {
          setInCompatible(true);
        } else {
          setInCompatible(false);
        }
      });
    getCardDetails();
    getDetails();
  };

  const getCardDetails = () => {
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(res => {
        setAccessTokenCard(res);
        if (res) {
          dispatch(getUserCardDetail({ access_token: res }))
            .then(userDetails => {
              setUserDetails(userDetails);
              if (userDetails?.cards[0]?.card_id !== null) {
                setCardActive(true);
              } else {
                setCardActive(false);
                return;
              }
              setCardInfo({
                ...cardInfo,
                cardNumber: userDetails?.cards[0]?.card_number,
              });
              let data = {
                card_id: userDetails?.cards[0]?.card_id,
              };
              dispatch(fetchBankDetails({ data, access_token: res }))
                .then(res => {
                  var date = res.expire.substring(0, 3);
                  var year = res.expire.substring(5, 7);
                  var expire = date + year;
                  setActualCardInfo({
                    cardNumber: res.card_number,
                    cvv: res.cvv,
                    expire: expire,
                  });
                })
                .catch(err => {
                });
            })
            .catch(err => {
              console.log('err:::::', err);
              setAccessTokenCard(null);
            });
        }
      });
  };
  const coinSelection = item => {
    Actions.currentScene !== 'CoinHome' && Actions.CoinHome({ coin: item });
  };
  const getDetails = async () => {
    let access_token = Singleton.getInstance().access_token;
    dispatch(getDexUrls(access_token))
    getMyWalletsData();
    Singleton.getInstance()
      .newGetData(Constants.multi_wallet_array)
      .then(res => {
        let data = JSON.parse(res);
        if (Array.isArray(data)) {
          setWalletsDetailData.push(data);
          setCheckIsArray(true);
        } else {
          console.warn('MM', 'notArray-----=-=-=-=', Object.entries(data));
          setWalletsDetailData.push(Object.entries(data));
          setCheckIsArray(false);
        }
      });
  };

  const getMyWalletsData = () => {
    Singleton.getInstance()
      .newGetData(Constants.multi_wallet_array)
      .then(res => {
        if (!res) {
          return;
        }
        let data = JSON.parse(res);
        const objIndex1 = walletsDetailData.findIndex(
          obj => obj.defaultWallet == true,
        );
        setWalletsDetailData(data);
      });
    balance_fiat = 0;
    let page = Page;
    let limit = 100;
    let access_token = Singleton.getInstance().access_token;
    Singleton.getInstance()
      .newGetData(Constants.addresKeyList)
      .then(addresKeyList => {
        Singleton.getInstance()
          .newGetData(Constants.coinFamilyKeys)
          .then(coinFamilyKey => {
            let addrsListKeys = JSON.parse(addresKeyList);
            let coinFamilyKeys =coinFamilyKey?.split(',');
            dispatch(
              getMyWallets({
                page,
                limit,
                addrsListKeys,
                coinFamilyKeys,
                access_token,
              }),
            )
              .then(response => {
                Constants.isFirstTime = false;
                setisLoading(false);
                setRefreshing(false)
              })
              .catch(error => {
                setRefreshing(false)
                setRefreshing(false);
                setisLoading(false);
              });
          })
          .catch(err => {
            setRefreshing(false)
            setisLoading(false);
            setRefreshing(false);
          });
      });
  };

  const leftComponent = () => {
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={() => {
          Actions.currentScene != 'MultiWalletList' &&
            Actions.MultiWalletList();
        }}>
        <View
          style={{
            height: areaDimen(24),
            width: areaDimen(24),
            borderRadius: 24,
            backgroundColor: ThemeManager.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: widthDimen(10),
          }}>
          <FastImage
            source={Images.walletIcon}
            style={{
              height: widthDimen(13),
              width: widthDimen(13),
              resizeMode: 'contain',
            }}
            resizeMode="contain"
          />
        </View>
        <Text
          style={{
            color: ThemeManager.colors.textColor,
            fontFamily: fonts.semibold,
            marginLeft: areaDimen(10.5),
            fontSize: areaDimen(14),
          }}>
          {Singleton.getInstance().walletName}
        </Text>
        <FastImage
          source={Images.walletDownArrow}
          style={{
            height: areaDimen(5.86),
            width: areaDimen(11.7),
            resizeMode: 'contain',
            marginLeft: widthDimen(7),
            marginTop: 1,
          }}
          tintColor={ThemeManager.colors.textColor}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };
  const onPressEye = () => {
    if (!showDetails) {
      setPinModal(true);
    } else {
      setShowdetails(false);
    }
  };
  const onSelectChain = chain => {
    Actions.currentScene !== 'Stake' && Actions.Stake({ chain: chain });
  };
  const onPressStake = () => {
    Singleton.getInstance()
      .newGetData(Constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (isPrivate == 'btc' || isPrivate == 'matic' || isPrivate == 'trx' || isPrivate == 'stc') {
        } else if (isPrivate == 'eth') {
          onSelectChain('eth');
        } else if (isPrivate == 'bnb') {
          onSelectChain('bnb');
        }
        else {
          setshowSelectChain(true);
        }
      });
  };
  const switchTabs = () => {
    switch (activeTab) {
      case 'Tokens': {
        return (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.coinListWrapStyle}
            data={CoinData || []}
            renderItem={({ item, index }) => (
              <WalletCard
                item={item}
                onPress={coinSelection}
                showBalance={showBalance}
              />
            )}
          />
        );
      }
      case 'SaitaCard': {
        if (activeWallet == 0) {
          if (!accessTokenCard) {
            return (
              <View style={[styles.cardContainer, { height: heightDimen(392) }]}>
                <FastImage
                  source={images.not_found}
                  style={styles.notFoundImage}
                  resizeMode="contain"
                />
                <Text style={styles.notFoundText}>No Card Found</Text>
              </View>
            );
          } else if (cardActive) {
            return (
              <>
                <ScrollView>
                  {activeWallet == 0 && userDetails && (
                    <>
                      <WalletHomeCard
                        userDetails={userDetails}
                        cardInfo={showDetails ? actualCardInfo : cardInfo}
                        onPressEye={onPressEye}
                        showDetails={showDetails}
                      />
                    </>
                  )}
                </ScrollView>
              </>
            );
          } else {
            return (
              <View style={[styles.cardContainer, { height: heightDimen(392) }]}>
                <FastImage
                  source={images.not_found}
                  style={styles.notFoundImage}
                  resizeMode="contain"
                />
                <Text style={styles.notFoundText}>No Card Found</Text>
              </View>
            );
          }
        }
      }
      case 'Staking': {
        return <></>;
      }
      default: {
        return <></>;
      }
    }
  };
  const createWalletAddress = async (card, user = userDetails) => {
    return new Promise(async (resolve, reject) => {
      try {
        setisLoading(true);
        console.log('createWalletAddress req', card, user);
        let data = {
          full_name: user.full_name,
          email: user.email,
          mobile_no: user.mobile_no,
          card_name: card?.name,
          card_status: card?.card_status,
          card_id: card?.card_id,
        };
        let res = await dispatch(getUserCardAddress({ data }));
        return resolve(res);
      } catch (err) {
        setisLoading(false);
        reject(err);
      }
    });
  };
  const onPressBPay = () => {
    setDepositModal(false);
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(res => {
        Actions.currentScene != 'SaitaCardDepositBinance' &&
          Actions.SaitaCardDepositBinance({
            token: res,
          });
      });
  };
  const onPressPay = () => {
    setDepositModal(false);
    setisLoading(true);
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(res => {
        dispatch(getCardList({}))
          .then(async res1 => {
            let selectedItem = res1?.virtual?.find(
              item => item.name == userDetails?.cards[0]?.name,
            );
            let wallet = await createWalletAddress(
              userDetails?.cards[0],
              false,
            );
            setisLoading(false);
            Actions.currentScene != 'SaitaCardDepositQr' &&
              Actions.SaitaCardDepositQr({
                myAddress: wallet?.wallet[0]?.address,
                token: wallet?.access_token,
                tokenListItem: [],
                fees: selectedItem?.card_fee,
              });
            console.log('wallet::::::', wallet);
          })
          .catch(err => {
            // console.log('err:::::onPressPay:', err);
            setisLoading(false);
          });
      });
  };

  const onProceed = text => {
    Singleton.getInstance()
      .newGetData(Constants.PIN)
      .then(pin => {
        if (text == pin) {
          setPinModal(false);
          setPin('');
          setShowdetails(true);
        } else {
          Singleton.showAlert(LanguageManager.wrongPin);
          setPin('');
        }
      });
    return;
  };
  const updatePin = item => {
    if (item == ' ' || Pin.length == 6) {
      return;
    }
    if (Pin.length != 6) {
      setPin(prev => {
        return prev + item;
      });

      if (Pin.length == 5) {
        let pin = Pin + item;
        onProceed(pin);
      }
    }
  };
  const deletePin = () => {
    if (Pin.length == 0) {
      return;
    }
    setPin(prev => prev.slice(0, prev.length - 1));
  };
  const getMarketPrice = itemData => {
    let selectedPrice = itemData?.fiat_price_per_unit?.find(item => {
      return (
        item.fiat_type == Singleton.getInstance().CurrencySelected.toLowerCase()
      );
    });
    return selectedPrice?.value;
  };
  const Notification = () => {
    messaging()
      .getInitialNotification()
      .then(notificationOpen => { });
    messaging().onNotificationOpenedApp(notificationOpen => {
      console.warn('MM', 'data notify----', notificationOpen);
      handleNotification(notificationOpen);
    });
    messaging().onMessage(async notification => {
      console.warn(
        'MM',
        'A new FCM message arrived!',
        JSON.stringify(notification),
      );
      showMessage({
        message: notification.data.body,
        backgroundColor: '#fff',
        titleStyle: { color: '#000', marginTop: -12, marginBottom: 10 },
        style: { borderRadius: 8, margin: 10 },
        duration: 4000,
        type: 'success',
        onPress: () => { },
      });
    });
  };
  return (
    <View
      style={{ flex: 1, backgroundColor: ThemeManager.colors.bg, position: 'relative', paddingTop: insets.top }} key={viewKey}>
      <StatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={ThemeManager.colors.themeColor === 'light'
          ? 'dark-content'
          : 'light-content'}
      />
      <View style={styles.container}>

        <MainHeader
          leftComponent={leftComponent}
          goback={false}
          searchEnable={false}
          onpress2={() => {
            Actions.currentScene != 'Setting' && Actions.Setting();
          }}
          onpress1={() =>
            Singleton.getInstance()
              .newGetData(Constants.IS_PRIVATE_WALLET)
              .then(isPrivate => {
                if (isPrivate == 'btc' || isPrivate == 'trx' ) {
                  Singleton.showAlert(Constants.UNCOMPATIBLE_WALLET);
                } else {
                  Actions.currentScene != 'ConnectWithDapp' &&
                    Actions.ConnectWithDapp();
                }
              })
          }
          styleImg1={{
            tintColor: ThemeManager.colors.iconColor,
            width: widthDimen(20),
          }}
          styleImg2={{
            tintColor: ThemeManager.colors.iconColor,
            width: widthDimen(20),
          }}
          styleImg3={{
            tintColor: ThemeManager.colors.iconColor,
            width: widthDimen(20),
          }}
          onChangedText={text => { }}
          onpress3={() => {
            Actions.currentScene != 'Notification' && Actions.Notification();
          }}
          secondImg={ThemeManager.ImageIcons.setting}
          firstImg={images.walletConnect}
          thridImg={ThemeManager.ImageIcons.bellIcon}
        />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps={true}
          stickyHeaderIndices={[2]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                onRefresh();
              }}
              tintColor={ThemeManager.colors.headingText}
            />
          }
          showsVerticalScrollIndicator={false}>
          {gradientColor ? (
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              colors={gradientColor}
              style={styles.balanceBoxStyle}>
              <Text style={styles.balanceTextTotal}>Total Balance</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: heightDimen(68),
                  flex: 1,
                }}>
                <Text style={styles.balanceTextStyle}>{`${Singleton.getInstance().CurrencySymbol
                  } `}</Text>

                <Text
                  style={[
                    styles.balanceTextStyle,
                    {
                      marginLeft: widthDimen(0),
                      paddingBottom: !showBalance ? heightDimen(15) : 0,
                    },
                  ]}>{`${showBalance
                    ? Singleton.getInstance().toFixed(
                      exponentialToDecimalWithoutComma(totalBalance || 0),
                      2,
                    )
                    : '...'
                    } `}</Text>
                <TouchableOpacity
                  onPress={() => setShowBalance(!showBalance)}
                  style={{ padding: areaDimen(10) }}>
                  <FastImage
                    source={
                      showBalance ? images.hideShow : images.amountHideIcon
                    }
                    style={{
                      height: heightDimen(24),
                      width: widthDimen(24),
                    }}
                    tintColor={'#fff'}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingLeft: widthDimen(25),
                  paddingRight: widthDimen(15),
                }}>
                <Text style={styles.lastDepositText}>
                  Last Deposit - {Singleton.getInstance().CurrencySymbol}
                  {lastDepositData?.amount != ''
                    ? getMarketPrice(lastDepositData)
                      ? lastDepositData?.amount.toString().includes('e')
                        ? (
                          getMarketPrice(lastDepositData) *
                          Singleton.getInstance().exponentialToDecimal(
                            parseFloat(lastDepositData?.amount).toFixed(8),
                          )
                        ).toFixed(2)
                        : (
                          getMarketPrice(lastDepositData) *
                          Singleton.getInstance().toFixed(
                            lastDepositData?.amount != ''
                              ? parseFloat(lastDepositData?.amount)
                              : 0,
                            5,
                          )
                        ).toFixed(2)
                      : '0.00'
                    : '0.00'}{' '}
                  {lastDepositData?.coin?.toUpperCase()}
                </Text>
                <TouchableOpacity
                  style={{ paddingHorizontal: widthDimen(10) }}
                  onPress={() => {
                    global.currentScreen = 'Settings';
                    Actions.currentScene != 'HistoryComponent' &&
                      Actions.HistoryComponent({ fromSetting: true });
                  }}>
                  <Text style={styles.lastDepositText}>Statement</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          ) : (
            <View />
          )}

          <View
            style={[
              styles.tabsContainer,
              {
                backgroundColor: ThemeManager.colors.backgroundColor,
                borderColor: ThemeManager.colors.tabsBorder,
              },
            ]}>
            {tabs?.map((tab, index) => {
              return (
                <BasicButton
                  onPress={() => {
                    if (tab == 'Staking') {
                      onPressStake();
                    }
                    if (tab == 'SaitaCard') {
                      getCardDetails()
                    }
                    setActiveTab(tab);
                  }}
                  customGradient={[
                    styles.tabStyle,
                    { width: widthDimen(358 / 3) },
                  ]}
                  customColor={
                    activeTab == tab
                      ? [Colors.buttonColor1, Colors.buttonColor2]
                      : [
                        ThemeManager.colors.backgroundColor,
                        ThemeManager.colors.backgroundColor,
                      ]
                  }
                  text={tab}
                  textStyle={[
                    styles.tabText,
                    {
                      color:
                        activeTab == tab
                          ? Colors.white
                          : ThemeManager.colors.textColor,
                    },
                  ]}
                />
              );
            })}
          </View>
          <View
            style={{
              backgroundColor: ThemeManager.colors.bg,
            }}></View>
          {switchTabs()}
          {CoinData?.length == 0 && activeTab == 'Tokens' && (
            <View style={{ height: Dimensions.get('screen').height / 3 }}>
              <Text
                style={[
                  styles.noCoinText,
                  { color: ThemeManager.colors.textColor },
                ]}>
                {LanguageManager.noCoinEnabled}
              </Text>
            </View>
          )}
          {activeTab == 'Staking' && isIncompatible && (
            <View
              style={{
                height: Dimensions.get('screen').height / 2.18,
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  styles.noCoinText,
                  { color: ThemeManager.colors.textColor },
                ]}>
                {activeWallet == 'stc' ? 'Coming Soon' : Constants.UNCOMPATIBLE_WALLET}
              </Text>
            </View>
          )}
          {activeTab == 'SaitaCard' && activeWallet != 0 && (
            <View
              style={{
                height: Dimensions.get('screen').height / 2.18,
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  styles.noCoinText,
                  { color: ThemeManager.colors.textColor },
                ]}>
                {Constants.UNCOMPATIBLE_WALLET}
              </Text>
            </View>
          )}
        </ScrollView>
        {activeWallet == 0 &&
          activeTab == 'SaitaCard' &&
          accessTokenCard == null && (
            <BasicButton
              onPress={() => {
                Singleton.getInstance()
                  .newGetData(Constants.IS_PRIVATE_WALLET)
                  .then(isPrivate => {
                    if (
                      isPrivate == 'btc' ||
                      isPrivate == 'matic' ||
                      isPrivate == 'bnb' ||
                      isPrivate == 'trx' ||
                      isPrivate == 'eth'
                    ) {
                      Singleton.showAlert(Constants.UNCOMPATIBLE_WALLET);
                    } else {
                      Actions.currentScene != 'SaitaCardLogin' &&
                        Actions.SaitaCardLogin({ from: 'Main' });
                    }
                  });
              }}
              btnStyle={{
                position: 'absolute',
                top: '82%',
              }}
              customGradient={{
                marginHorizontal: widthDimen(20),
                width: widthDimen(372),
                alignSelf: 'center',
              }}
              customColor={[Colors.buttonColor1, Colors.buttonColor2]}
              text={'Login'}
            />
          )}
      </View>
      {activeWallet == 0 &&
        activeTab == 'SaitaCard' &&
        accessTokenCard &&
        cardActive && (
          <BasicButton
            onPress={() => onPressPay()}
            btnStyle={{
              position: 'absolute',
              bottom: heightDimen(90),
            }}
            customGradient={{
              marginHorizontal: widthDimen(20),
              width: widthDimen(372),
              alignSelf: 'center',
            }}
            customColor={[Colors.buttonColor1, Colors.buttonColor2]}
            text={LanguageManager.deposit}
          />
        )}
      {activeTab == 'Tokens' && (
        <BasicButton
          onPress={() =>
            Actions.currentScene != 'ManageWallet' &&
            Actions.ManageWallet({ walletList: CoinData || [], from: 'Manage' })
          }
          btnStyle={{
            position: 'absolute',
            bottom: heightDimen(90),
          }}
          customGradient={{
            marginHorizontal: widthDimen(20),
            width: widthDimen(372),
            alignSelf: 'center',
          }}
          customColor={[Colors.buttonColor1, Colors.buttonColor2]}
          text={LanguageManager.addCustomToken}
        />
      )}
      {isLoading && <Loader />}
      <Modal
        visible={showSelectChain}
        animationType="fade"
        transparent={true}
        statusBarTranslucent
        style={{ flex: 1, justifyContent: 'flex-end' }}>
        <SelectNetworkPopUp
          onClose={() => {
            setshowSelectChain(false);
            setActiveTab('Tokens');
          }}
          onPressEth={() => {
            setshowSelectChain(false);
            onSelectChain('eth');
          }}
          onPressBnb={() => {
            setshowSelectChain(false);
            onSelectChain('bnb');
          }}
          onPressStc={() => {
            setshowSelectChain(false);
            Singleton.showAlert('Coming soon!')
            setActiveTab('Tokens')
          }}
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={PinModal}
        onRequestClose={() => setPinModal(false)}>
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
          <SimpleHeader
            back={false}
            backPressed={() => setPinModal(false)}
            title={''}
          />
          <View style={{ paddingHorizontal: widthDimen(22) }}>
            <Text
              style={{
                fontFamily: fonts.semibold,
                alignSelf: 'flex-start',
                fontSize: areaDimen(30),
                lineHeight: areaDimen(37),
                marginTop: heightDimen(30),
                color: ThemeManager.colors.headingText,
              }}>
              Confirm Pin
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: areaDimen(14),
                textAlign: 'left',
                lineHeight: heightDimen(28),
                color: ThemeManager.colors.inActiveColor,
              }}>
              {LanguageManager.enterSixDigitPin}
            </Text>
            <View style={{}}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: heightDimen(30),
                  flexDirection: 'row',
                }}>
                {[0, 1, 2, 3, 4, 5].map((item, index) => {
                  return (
                    <PinInput
                      key={item}
                      isActive={
                        Pin.length == 0
                          ? index == 0
                            ? true
                            : false
                          : Pin.length == index + 1
                      }
                      digit={Pin.length > index ? '*' : ''}
                    />
                  );
                })}
              </View>
            </View>
          </View>
          <View
            style={[
              {
                justifyContent: 'flex-end',
                flex: 1,
                marginTop: heightDimen(102),
              },
            ]}>
            <KeyboardDigit
              updatePin={item => updatePin(item)}
              deletePin={() => deletePin()}
            />
          </View>
        </Wrap>
      </Modal>
      <Modal
        visible={depositModal}
        animationType="fade"
        onRequestClose={() => {
          setDepositModal(false);
        }}
        transparent>
        <DepositModalCard
          onPress2ndPay={onPressBPay}
          onPressPay={onPressPay}
          onClose={() => setDepositModal(false)}
        />
      </Modal>
    </View>
  );
};

export default Wallet;
