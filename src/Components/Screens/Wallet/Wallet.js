/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Modal,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import * as Constants from '../../../Constant';
import {NavigationStrings} from '../../../Navigation/NavigationStrings';
import {
  getCardList,
  getDexUrls,
  getMyWallets,
  getUserCardAddress,
  getVaultDetails, //Commented for saitacard
  myWalletListSuccess,
  updateListBalances,
  getAppVersion,
} from '../../../Redux/Actions';
import {wallectConnectParamsUpdate} from '../../../Redux/Actions/WallectConnectActions';
import Singleton from '../../../Singleton';
import WalletConnect from '../../../Utils/WalletConnect';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import {getCurrentRouteName, navigate} from '../../../navigationsService';
import fonts from '../../../theme/Fonts';
import images from '../../../theme/Images';
import {exponentialToDecimalWithoutComma} from '../../../utils';
import SelectNetworkPopUp from '../../common/SelectNetworkPopUp';
import {
  BasicButton,
  KeyboardDigit,
  MainHeader,
  PinInput,
  SimpleHeader,
  Wrap,
} from '../../common/index';
import Loader from '../Loader/Loader';
import DepositModalCard from '../SaitaCardBlack/DepositModalCard';
import {Colors, Images} from './../../../theme/index';
import WalletCard from './WalletCard';
import WalletHomeCard from './WalletHomeCard';
import styles from './WalletStyle';
import {
  Notification,
  backAction,
  getRouterDetailsApi,
  addDeepLinkListner,
  getCardDetails,
  coinSelection,
} from './WalletHelper';

const tabs = ['Tokens', 'Staking (Coming soon)'];
const Wallet = props => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const CoinData = useSelector(state => state?.walletReducer?.myWallets || []);
  const {totalBalance, lastDepositData} = useSelector(
    state => state?.walletReducer,
  );

  const [accessTokenCard, setAccessTokenCard] = useState(null);
  const [isIncompatible, setInCompatible] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const gradientColor = ['#9ABFFF', '#4C80FF', '#6F6CFF', '#4C80FF'];
  const [viewKey, setViewKey] = useState(new Date());
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
  const [Page, setPage] = useState(1);
  const [bottomLoading, setBottomLoading] = useState(false);
  const [totalLength, setTotalLength] = useState(CoinData?.length);

  const [isMandatory, setIsMandatory] = useState(false);
  const [requiredVersion, setRequiredVersion] = useState(null);
  let access_token = Singleton.getInstance().access_token;

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
        setIsMandatory(res[0]?.mandatoryUpdate);
        setRequiredVersion(res[0]?.latestVersionCode);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    const checkVersionAndPromptUpdate = () => {
      const currentVersion = DeviceInfo.getBuildNumber();
      if (
        isMandatory &&
        parseInt(currentVersion, 10) < parseInt(requiredVersion, 10)
      ) {
        promptUpdate();
      }
    };

    checkAppVersion(); // Assuming this fetches and updates `requiredVersion` and `isMandatory`
    const timeout = setTimeout(() => {
      checkVersionAndPromptUpdate();
    }, 5000);

    return () => clearTimeout(timeout); // Cleanup on component unmount
  }, [requiredVersion, isMandatory]);

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
    getRouterDetailsApi(dispatch);
    // dispatch(getVaultDetails()); //Commented for saitacard
    EventRegister.addEventListener('themeChanged', () => {
      setViewKey(new Date());
    });
    initialCall();
    let backHandle = null;
    backHandle = BackHandler.addEventListener('hardwareBackPress', backAction);
    Singleton.getInstance()
      .newGetData(Constants.access_token_cards)
      .then(res => {
        setAccessTokenCard(res);
      });
    EventRegister.addEventListener('requestFromDapp', data => {
      dispatch(
        wallectConnectParamsUpdate({
          prop: 'wcTransactionInfo',
          value: data?.payload,
        }),
      );
      dispatch(
        wallectConnectParamsUpdate({
          prop: 'wcCoinFamily',
          value: data?.coinFamily,
        }),
      );
      if (getCurrentRouteName() != 'ConfirmPin') {
        Singleton.getInstance().walletConnectRef?.showWalletData(true);
      } else {
        global.wcTxnPopup = true;
      }
    });
    EventRegister.addEventListener('downModal', () => {
      setPinModal(false);
    });
    addDeepLinkListner();
    let focus = props.navigation.addListener('focus', () => {
      setPage(0);
      setBottomLoading(false);
      Notification();
      getRouterDetailsApi(dispatch);
      setPinModal(false);
      backHandle = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      setActiveTab('Tokens');
      initialCall();
    });
    let blur = props.navigation.addListener('blur', () => {
      backHandle?.remove();
    });
    return () => {
      backHandle?.remove();
      focus();
      blur();
      EventRegister.removeEventListener('themeChanged');
      EventRegister.removeEventListener('downModal');
    };
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDetails();
  }, []);

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
        } else if (
          isPrivate != Constants.COIN_SYMBOL.BNB &&
          isPrivate != Constants.COIN_SYMBOL.ETH &&
          isPrivate != 0
        ) {
          setInCompatible(true);
        } else {
          setInCompatible(false);
        }
      });
    // getCardDetails();
    getDetails();
  };

  const getDetails = async () => {
    let access_token = Singleton.getInstance().access_token;
    dispatch(getDexUrls(access_token));
    getMyWalletsData();
    // setisLoading(true);
    Singleton.getInstance()
      .newGetData(Constants.multi_wallet_array)
      .then(res => {
        let data = JSON.parse(res);
        if (Array.isArray(data)) {
          setWalletsDetailData.push(data);
          setCheckIsArray(true);
        } else {
          setWalletsDetailData.push(Object.entries(data));
          setCheckIsArray(false);
        }
      });
  };
  const getList = () => {
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
    let limit = 25;
    let access_token = Singleton.getInstance().access_token;
    Singleton.getInstance()
      .newGetData(Constants.addresKeyList)
      .then(addresKeyList => {
        Singleton.getInstance()
          .newGetData(Constants.coinFamilyKeys)
          .then(coinFamilyKey => {
            let addrsListKeys = JSON.parse(addresKeyList);
            let coinFamilyKeys = coinFamilyKey?.split(',');
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
                let data = page == 1 ? response : [...CoinData, ...response];
                setBottomLoading(false);
                setTotalLength(data[0]?.totalRecords);
                myWalletListSuccess(dispatch, data);
                setisLoading(false);
                setRefreshing(false);
              })
              .catch(error => {
                setRefreshing(false);
                setRefreshing(false);
                setisLoading(false);
              });
          })
          .catch(err => {
            setRefreshing(false);
            setisLoading(false);
            setRefreshing(false);
          });
      });
  };
  const getMyWalletsData = () => {
    dispatch(updateListBalances())
      .then(res => {
        getList();
      })
      .catch(err => {
        getList();
        setisLoading(false);
      });
  };
  const isCloseToBottom = async ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    let bottomReached =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    if (bottomReached && totalLength > CoinData?.length && !bottomLoading) {
      setBottomLoading(true);
      setPage(Page + 1);
      getMyWalletsData(false, false);
    }
  };

  const leftComponent = () => {
    return (
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center', flex: 0.7}}
        onPress={() => {
          getCurrentRouteName() != 'MultiWalletList' &&
            navigate(NavigationStrings.MultiWalletList);
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
    getCurrentRouteName() !== 'Stake' &&
      navigate(NavigationStrings.Stake, {chain: chain});
  };
  const onPressStake = () => {
    Singleton.getInstance()
      .newGetData(Constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (
          isPrivate == Constants.COIN_SYMBOL.BTC ||
          isPrivate == Constants.COIN_SYMBOL.MATIC ||
          isPrivate == Constants.COIN_SYMBOL.TRX ||
          isPrivate == Constants.COIN_SYMBOL.STC
        ) {
        } else if (isPrivate == Constants.COIN_SYMBOL.ETH) {
          onSelectChain(Constants.COIN_SYMBOL.ETH);
        } else if (isPrivate == Constants.COIN_SYMBOL.BNB) {
          onSelectChain(Constants.COIN_SYMBOL.BNB);
        } else {
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
            renderItem={({item, index}) => (
              <WalletCard
                item={item}
                onPress={coinSelection}
                showBalance={showBalance}
              />
            )}
            ListFooterComponent={() => {
              if (bottomLoading) {
                return (
                  <View
                    style={{
                      padding: areaDimen(20),
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingBottom: areaDimen(30),
                    }}>
                    <ActivityIndicator
                      color={ThemeManager.colors.headingText}
                    />
                  </View>
                );
              } else {
                return null;
              }
            }}
          />
        );
      }
      case 'SaitaCard': {
        if (activeWallet == 0) {
          if (!accessTokenCard) {
            return (
              <View style={[styles.cardContainer, {height: heightDimen(392)}]}>
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
              <View style={[styles.cardContainer, {height: heightDimen(392)}]}>
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
      case 'Staking (Coming soon)': {
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
        // setisLoading(true);
        let data = {
          full_name: user.full_name,
          email: user.email,
          mobile_no: user.mobile_no,
          card_name: card?.name,
          card_status: card?.card_status,
          card_id: card?.card_id,
        };
        let res = await dispatch(getUserCardAddress({data}));
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
        getCurrentRouteName() != 'SaitaCardDepositBinance' &&
          navigate(NavigationStrings.SaitaCardDepositBinance, {
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
            getCurrentRouteName() != 'SaitaCardDepositQr' &&
              navigate(NavigationStrings.SaitaCardDepositQr, {
                myAddress: wallet?.wallet[0]?.address,
                token: wallet?.access_token,
                tokenListItem: [],
                fees: selectedItem?.card_fee,
              });
          })
          .catch(err => {
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
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.bg,
        position: 'relative',
        paddingTop: insets.top,
      }}
      key={viewKey}>
      <StatusBar
        backgroundColor={ThemeManager.colors.bg}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <View style={styles.container}>
        <MainHeader
          leftComponent={leftComponent}
          goback={false}
          searchEnable={false}
          onpress2={() => {
            getCurrentRouteName() != 'Setting' &&
              navigate(NavigationStrings.Setting);
          }}
          onpress1={() =>
            Singleton.getInstance()
              .newGetData(Constants.IS_PRIVATE_WALLET)
              .then(isPrivate => {
                if (
                  isPrivate == Constants.COIN_SYMBOL.BTC ||
                  isPrivate == Constants.COIN_SYMBOL.TRX
                ) {
                  Singleton.showAlert(Constants.UNCOMPATIBLE_WALLET);
                } else {
                  getCurrentRouteName() != 'ConnectWithDapp' &&
                    navigate(NavigationStrings.ConnectWithDapp, {
                      fromWallet: true,
                    });
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
          onChangedText={text => {}}
          onpress3={() => {
            getCurrentRouteName() != 'Notification' &&
              navigate(NavigationStrings.Notification);
          }}
          secondImg={ThemeManager.ImageIcons.setting}
          firstImg={images.walletConnect}
          thridImg={ThemeManager.ImageIcons.bellIcon}
        />
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
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
          onScroll={({nativeEvent}) => {
            isCloseToBottom(nativeEvent);
          }}
          scrollEventThrottle={200}
          showsVerticalScrollIndicator={false}>
          {gradientColor ? (
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0.8, y: 1}}
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
                <Text style={styles.balanceTextStyle}>{`${
                  Singleton.getInstance().CurrencySymbol
                } `}</Text>

                <Text
                  style={[
                    styles.balanceTextStyle,
                    {
                      marginLeft: widthDimen(0),
                      paddingBottom: !showBalance ? heightDimen(15) : 0,
                    },
                  ]}>{`${
                  showBalance
                    ? Singleton.getInstance().toFixed(
                        exponentialToDecimalWithoutComma(totalBalance || 0),
                        2,
                      )
                    : '...'
                } `}</Text>
                <TouchableOpacity
                  onPress={() => setShowBalance(!showBalance)}
                  style={{padding: areaDimen(10)}}>
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
                  style={{paddingHorizontal: widthDimen(10)}}
                  onPress={() => {
                    global.currentScreen = 'Settings';
                    getCurrentRouteName() != 'HistoryComponent' &&
                      navigate(NavigationStrings.HistoryComponent, {
                        fromSetting: true,
                      });
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
                    if (tab == 'Staking (Coming soon)') {
                      return; //Commented for coming soon onPressStake();
                    }
                    if (tab == 'SaitaCard') {
                      getCardDetails();
                    }
                    setActiveTab(tab);
                  }}
                  customGradient={[
                    styles.tabStyle,
                    {width: widthDimen(358 / 2)},
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
            <View style={{height: Dimensions.get('screen').height / 3}}>
              <Text
                style={[
                  styles.noCoinText,
                  {color: ThemeManager.colors.textColor},
                ]}>
                {LanguageManager.noCoinEnabled}
              </Text>
            </View>
          )}
          {activeTab == 'Staking (Coming soon)' && isIncompatible && (
            <View
              style={{
                height: Dimensions.get('screen').height / 2.18,
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  styles.noCoinText,
                  {color: ThemeManager.colors.textColor},
                ]}>
                {activeWallet == Constants.COIN_SYMBOL.STC
                  ? 'Coming Soon'
                  : Constants.UNCOMPATIBLE_WALLET}
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
                  {color: ThemeManager.colors.textColor},
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
                getCurrentRouteName() != 'SaitaCardLogin' &&
                  navigate(NavigationStrings.SaitaCardLogin, {from: 'Main'});
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
            getCurrentRouteName() != 'ManageWallet' &&
            navigate(NavigationStrings.ManageWallet, {
              walletList: CoinData || [],
              from: 'Manage',
            })
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
      {isLoading && <Loader loader={isLoading} />}
      <Modal
        visible={showSelectChain}
        animationType="fade"
        transparent={true}
        statusBarTranslucent
        style={{flex: 1, justifyContent: 'flex-end'}}>
        <SelectNetworkPopUp
          isDisableStc={true}
          onClose={() => {
            setshowSelectChain(false);
            setActiveTab('Tokens');
          }}
          onPressEth={() => {
            setshowSelectChain(false);
            onSelectChain(Constants.COIN_SYMBOL.ETH);
          }}
          onPressBnb={() => {
            setshowSelectChain(false);
            onSelectChain(Constants.COIN_SYMBOL.BNB);
          }}
          onPressStc={() => {
            setshowSelectChain(false);
            // Singleton.showAlert('Coming soon!')
            onSelectChain(Constants.COIN_SYMBOL.STC);
          }}
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={PinModal}
        onRequestClose={() => setPinModal(false)}>
        <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
          <SimpleHeader
            back={false}
            backPressed={() => setPinModal(false)}
            title={''}
          />
          <View style={{paddingHorizontal: widthDimen(22)}}>
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
