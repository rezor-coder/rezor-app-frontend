/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  AppState,
  BackHandler,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {Images, Colors} from '../../../theme/';
import {MainHeader, IconText} from '../../common';
import styles from './DashboardStyle';
import FastImage from 'react-native-fast-image';
import fonts from '../../../theme/Fonts';
import {SliderBox} from 'react-native-image-slider-box';
import Singleton from '../../../Singleton';
import * as constants from '../../../Constant';
import {EventRegister} from 'react-native-event-listeners';
import images from '../../../theme/Images';
import {useDispatch, useSelector} from 'react-redux';
import {
  getDashboardWallets,
  walletDataUpdate,
  getAdvertisementList,
  walletFormUpdate,
  getInfuraLink,
  getInfuraBNBLink,
  getRouterDetails,
  getSocialList,
  getMyWallets,
  getDexUrls,
  cardUserdata,
  getVaultDetails,
} from '../../../Redux/Actions';
import messaging from '@react-native-firebase/messaging';
import Loader from '../Loader/Loader';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import {FlatList} from 'react-native';
import {BASE_IMAGE} from '../../../Endpoints';
import {showMessage} from 'react-native-flash-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavigationStrings} from '../../../Navigation/NavigationStrings';
import {
  getCurrentRouteName,
  goBack,
  navigate,
  reset,
} from '../../../navigationsService';
const Dashboard = props => {
  const [viewKey, setViewKey] = useState(new Date());
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const CoinDataMain = useSelector(state => state?.walletReducer?.myWallets);
  const CoinData = useSelector(state => state?.walletReducer?.dashboardWallets);
  const [BANNER, setBANNER] = useState([]);
  const [Page, setPage] = useState(1);
  const [Limit, setLimit] = useState(25);
  const [isLoading, setisLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [onPressActive, setPressActive] = useState(false);
  const [bottomLoading, setBottomLoading] = useState(false);
  const [totalLength, setTotalLength] = useState(CoinData?.length);
  console.log(CoinData.length, 'CoinDataCoinDataCoinData');
  useEffect(() => {
    EventRegister.addEventListener('themeChanged', () => {
      setViewKey(new Date());
    });
    // getWalletData();
    // Notification();
    // Bannerimg();
    let backHandle;
    backHandle = BackHandler.addEventListener('hardwareBackPress', () => {
      if (getCurrentRouteName() == 'Dashboard') {
        getCurrentRouteName() != 'Main' && reset(NavigationStrings.Main);
      } else {
        goBack();
      }
      return true;
    });
    EventRegister.addEventListener('walletAPIEvent', data1 => {
      // getWalletData();
    });
    let focus = props.navigation.addListener('focus', () => {
      if (
        !Singleton.getInstance().xMerchantId ||
        !Singleton.getInstance().xVErsion ||
        !Singleton.getInstance().fingerPrintSeed ||
        !Singleton.getInstance().ethLink ||
        !Singleton.getInstance().bnbLink ||
        !Singleton.getInstance().maticLink 
      ) {
        dispatch(getVaultDetails());
        getInfuraMainLink();
        getBNBLink();
        getNodeDetails();

        dispatch(getSocialList())
          .then(async response => {
            Singleton.getInstance().newSaveData(
              constants.SOCIAL_LINKS,
              JSON.stringify(response.data),
            );
          })
          .catch(error => {});
      }
      Bannerimg();
      setPage(0);
      setBottomLoading(false);

      backHandle = BackHandler.addEventListener('hardwareBackPress', () => {
        if (getCurrentRouteName() == 'Dashboard') {
          getCurrentRouteName() != 'Main' && reset(NavigationStrings.Main);
        } else {
          goBack();
        }
        return true;
      });

      Singleton.getInstance().currentCard = 'black';

      getWalletData();
      // Notification();

      dispatch(walletFormUpdate({prop: 'selectedAddress', value: ''}));
    });
    let blur = props.navigation.addListener('blur', () => {
      backHandle?.remove();
    });

      
    return () => {
      backHandle?.remove();
      blur();
      focus();
      EventRegister.removeEventListener('themeChanged');
    };
  }, []);

  const getInfuraMainLink = () => {
    dispatch(getInfuraLink())
      .then(response => {
        constants.mainnetInfuraLink = response.link;
        Singleton.getInstance().ethLink = response.link;
      })
      .catch(error => {});
  };
  const getBNBLink = () => {
    dispatch(getInfuraBNBLink())
      .then(response => {
        constants.mainnetInfuraLinkBNB = response.link;
        Singleton.getInstance().bnbLink = response.link;
      })
      .catch(error => {});
  };

  const getNodeDetails = () => {
    let access_token = Singleton.getInstance().access_token;
    dispatch(getDexUrls(access_token))
      .then(response => {
        console.warn('MM', 'response==getDexUrls ==== pin', response);
      })
      .catch(error => {
        console.warn('MM', 'error==getDexUrls=== pin', error);
      });
    dispatch(getRouterDetails())
      .then(response => {
        let instance = Singleton.getInstance();
        instance.SwapRouterAddress = response.data.Router;
        instance.SwapFactoryAddress = response.data.Factory;
        instance.StakeSaitamaAddress = response.data.SaitamaAddress;
        instance.StakingContractAddress = response.data.StakingContractAddress;
        instance.SwapWethAddress = response.data.WethAddress;
        instance.SwapRouterBNBAddress = response.data.BnbRouter;
        instance.SwapRouterStcAddress = response.data.StcRouter;
        instance.SwapWBNBAddress = response.data.WbnbAddress;
        instance.SwapWethAddressSTC = response.data.StcWeth;
        instance.SwapFactoryAddressSTC = response.data.StcFactory;
        instance.SwapFactoryAddressBNB = response.data.BnbFactory;
      })
      .catch(error => {});
  };
  const getWalletData = () => {
    Singleton.getInstance().newSaveData(constants.IS_LOGIN, '1');
    Singleton.getInstance()
      .newGetData(constants.DASHBOARD_WALLET_LIST)
      .then(wallet_list => {
        wallet_list == null && setShowLoader(true);
        wallet_list?.length > 0 &&
          dispatch(
            walletDataUpdate({
              prop: 'dashboardWallets',
              value: JSON.parse(wallet_list),
            }),
          );

        // setisLoading(true)
        getMyWalletsData();
      });
  };
  const Bannerimg = () => {
    let access_token = Singleton.getInstance().access_token;
    dispatch(getAdvertisementList({access_token}))
      .then(response => {
        console.log(response,'responseresponseresponse');
        const imgArr = response.data;
        setBANNER(imgArr);
      })
      .catch(error => {});
  };
  const walletListCall = () => {
    let page = Page;
    let limit = Limit;
    let access_token = Singleton.getInstance().access_token;
    Singleton.getInstance()
      .newGetData(constants.addresKeyList)
      .then(addresKeyList => {
        Singleton.getInstance()
          .newGetData(constants.coinFamilyKeys)
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
              .then(response => {})
              .catch(error => {
                setisLoading(false);
              });
          })
          .catch(err => {
            setisLoading(false);
          });
      });
  };
  const getMyWalletsData = () => {
    walletListCall();
    let page = Page;
    let limit = 25;
    let access_token = Singleton.getInstance().access_token;
    Singleton.getInstance()
      .newGetData(constants.addresKeyList)
      .then(addresKeyList => {
        Singleton.getInstance()
          .newGetData(constants.coinFamilyKeys)
          .then(coinFamilyKey => {
            let addrsListKeys = JSON.parse(addresKeyList);
            let coinFamilyKeys = coinFamilyKey?.split(',');
            // showLoader == true ? setisLoading(true) : setisLoading(false);
            dispatch(
              getDashboardWallets({
                page,
                limit,
                addrsListKeys,
                coinFamilyKeys,
                access_token,
              }),
            )
              .then(response => {
                let data = page == 1 ? response : [...CoinData, ...response];
                setBottomLoading(false);
                setTotalLength(data[0]?.totalRecords);
                setisLoading(false);
                dispatch(
                  walletDataUpdate({
                    prop: 'dashboardWallets',
                    value: data,
                  }),
                );
              })
              .catch(error => {
                setisLoading(false);
              });
          })
          .catch(err => {
            setisLoading(false);
          });
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
  const CardItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.cardMain,
          {backgroundColor: ThemeManager.colors.iconBg},
        ]}>
        {item.coin_image ? (
          <FastImage
            source={{
              uri: item.coin_image.includes('https')
                ? item.coin_image
                : BASE_IMAGE + item.coin_image,
            }}
            style={{
              height: areaDimen(38),
              width: areaDimen(38),
              borderRadius: areaDimen(15),
            }}
          />
        ) : (
          <View
            style={[
              styles.imageNameContainer,
              {backgroundColor: Colors.buttonColor2},
            ]}>
            <Text style={{color: 'white'}}>
              {item?.coin_symbol?.toUpperCase().charAt(0)}
            </Text>
          </View>
        )}
        <View
          style={{
            marginLeft: widthDimen(8),
            flex: 1,
          }}>
          <View style={{justifyContent: 'center'}}>
            <Text
              style={[
                styles.coinNameStyle,
                {color: ThemeManager.colors.textColor},
              ]}>
              {item.coin_name.toString().length > 13
                ? item.coin_name.substring(0, 8) + '...'
                : item.coin_name}
              <Text
                style={[
                  styles.coinFamilyText,
                  {color: ThemeManager.colors.inActiveColor},
                ]}>
                {' '}
                {item.is_token == 1
                  ? item?.coin_family == 1
                    ? '(ERC20)'
                    : item?.coin_family == 6
                    ? '(BEP20)'
                    : item?.coin_family == 3
                    ? '(TRC20)'
                    : item?.coin_family == 11
                    ? ' (MATIC ERC20)'
                    // : item?.coin_family == 4
                   // ? ' (SBC24)' //Commented for coming soon
                    : ''
                  : ''}
              </Text>
            </Text>
          </View>
          <Text
            style={[
              styles.coinBalanceText,
              {
                color: ThemeManager.colors.inActiveColor,
              },
            ]}
            numberOfLines={1}>
            {item.balance != 0
              ? Singleton.getInstance().exponentialToDecimal(
                  Singleton.getInstance().toFixed(
                    Singleton.getInstance().exponentialToDecimal(item.balance),
                    constants.CRYPTO_DECIMALS,
                  ),
                ) || 0
              : item.balance}{' '}
            {item.coin_symbol.toUpperCase()}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
        {/* Commented for coming soon */}
          {/* {item.is_stake == 1 && (
            <TouchableOpacity
              style={[
                styles.stakeButton,
                {borderColor: ThemeManager.colors.inActiveColor},
              ]}
              onPress={() => {
                Singleton.getInstance()
                  .newGetData(constants.IS_PRIVATE_WALLET)
                  .then(isPrivate => {
                    if (
                      isPrivate == constants.COIN_SYMBOL.BTC ||
                      isPrivate == constants.COIN_SYMBOL.MATIC ||
                      isPrivate == constants.COIN_SYMBOL.TRX
                    ) {
                      Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
                    } else {
                      getCurrentRouteName() !== 'Stake' &&
                        navigate(NavigationStrings.Stake, {
                          chain: item.coin_family == 1 ? constants.COIN_SYMBOL.ETH : constants.COIN_SYMBOL.BNB,
                        });
                    }
                  });
              }}>
              <Text
                style={[
                  styles.stakeText,
                  {color: ThemeManager.colors.inActiveColor},
                ]}>
                {LanguageManager.stake}
              </Text>
            </TouchableOpacity>
          )} */}
          {/* {item.on_epay == 1 && (
            <TouchableOpacity
              style={[styles.buyButton, { backgroundColor: ThemeManager.colors.primary, }]}
              onPress={() => {
                Singleton.getInstance()
                  .newGetData(constants.IS_PRIVATE_WALLET)
                  .then(isPrivate => {
                    if (
                      isPrivate == 'btc' ||
                      isPrivate == 'matic' ||
                      isPrivate == 'trx'
                    ) {
                      Singleton.showAlert(
                        constants.UNCOMPATIBLE_WALLET,
                      );
                    } else {
                      getCurrentRouteName() != 'Epay' &&
                        Actions.Epay({ selectedItem: item });
                    }
                  });
              }}>
              <Text
                style={[styles.buyText, { color: Colors.white }]}>
                {LanguageManager.buy}
              </Text>
            </TouchableOpacity>
          )} */}
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        backgroundColor: ThemeManager.colors.dashboardBg,
        flex: 1,
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
      <MainHeader
        goback={false}
        searchEnable={false}
        onChangedText={text => {}}
        containerStyle={{backgroundColor: ThemeManager.colors.dashboardBg}}
        onpress3={() => {
          getCurrentRouteName() != 'Notification' &&
            navigate(NavigationStrings.Notification);
        }}
        onpress2={() => {
          getCurrentRouteName() != 'Setting' &&
            props.navigation.navigate('Setting', {
              onGoBack: () => {},
            });
        }}
        onpress1={() => {
          Singleton.getInstance()
            .newGetData(constants.IS_PRIVATE_WALLET)
            .then(isPrivate => {
              if (isPrivate == 'btc' || isPrivate == 'trx') {
                Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
              } else {
                getCurrentRouteName() != 'ConnectWithDapp' &&
                  navigate(NavigationStrings.ConnectWithDapp);
              }
            });
        }}
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
        firstImg={images.walletConnect}
        thridImg={ThemeManager.ImageIcons.bellIcon}
        secondImg={ThemeManager.ImageIcons.setting}
      />
      <ScrollView
        bounces={false}
        stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}
        onScroll={({nativeEvent}) => {
          isCloseToBottom(nativeEvent);
        }}
        scrollEventThrottle={200}>
        <View
          style={{
            width: '100%',
            height: heightDimen(232), //sliderWidth / 1.8,
            alignItems: 'center',
            paddingTop: heightDimen(24),
          }}>
          <SliderBox
            parentWidth={widthDimen(380)}
            images={BANNER.map(a => a.image)}
            autoplay
            circleLoop
            imageLoadingColor={Colors.fadeDot}
            sliderBoxHeight={heightDimen(184)}
            onCurrentImagePressed={index => Linking.openURL(BANNER[index].link)}
            dotColor={ThemeManager.colors.dotColor}
            dotStyle={{
              width: 0,
              height: 0,
            }}
            inactiveDotColor="#90A4AE"
            resizeMode="stretch"
            ImageComponentStyle={{
              borderRadius: areaDimen(5),
              resizeMode: 'stretch',
              backgroundColor: ThemeManager.colors.bg,
            }}
          />
        </View>
        <View
          style={{
            width: '100%',
            borderRadius: areaDimen(10),
            justifyContent: 'center',
            paddingHorizontal: widthDimen(7),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              paddingBottom: heightDimen(10),
            }}>
            {/* <IconText
              tintColor={ThemeManager.colors.headingText}
              onPress={() => {
                Singleton.getInstance()
                  .newGetData(constants.IS_PRIVATE_WALLET)
                  .then(isPrivate => {
                    if (
                      isPrivate == 'btc' ||
                      isPrivate == 'matic' ||
                      isPrivate == 'trx'
                    ) {
                      Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
                    } else {
                      getCurrentRouteName() != 'Epay' && Actions.Epay();
                    }
                  });
              }}
              styleIconText={{ backgroundColor: ThemeManager.colors.iconBg }}
              imageIcon={Images.Buy}
              title={LanguageManager.buy}
            /> */}
            {/* Commented for coming soon */}
            {/* <IconText
              tintColor={ThemeManager.colors.headingText}
              disabled={onPressActive}
              onPress={() => {
                if (global.disconnected) {
                  Singleton.showAlert(constants.NO_NETWORK);
                  return;
                }
                Singleton.getInstance()
                  .newGetData(constants.IS_PRIVATE_WALLET)
                  .then(isPrivate => {
                    if (
                      isPrivate == constants.COIN_SYMBOL.BTC ||
                      isPrivate == constants.COIN_SYMBOL.MATIC ||
                      isPrivate == constants.COIN_SYMBOL.BNB ||
                      isPrivate == constants.COIN_SYMBOL.TRX ||
                      isPrivate == constants.COIN_SYMBOL.ETH ||
                      isPrivate == constants.COIN_SYMBOL.STC
                    ) {
                      Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
                    } else {
                      Singleton.getInstance()
                        .newGetData(constants.access_token_cards)
                        .then(access_token_cards => {
                          // if (access_token_cards == null) {
                          //   getCurrentRouteName() != 'SaitaCardWelcome' &&
                          //     Actions.SaitaCardWelcome();
                          // } else {
                          //   getCurrentRouteName() != 'SaitaCardsInfo' &&
                          //     Actions.SaitaCardsInfo({ from: 'Dashboard' });
                          // }
                          // Singleton.showAlert('Coming soon!')
                          navigate(NavigationStrings.SaitaCardDashBoard);
                        });
                      setPressActive(true);
                      setTimeout(() => {
                        setPressActive(false);
                      }, 200);
                    }
                  });
              }}
              styleIconText={{backgroundColor: ThemeManager.colors.iconBg}}
              imageIcon={Images.saitaCard}
              title={'SaitaCard'}
            /> */}
            <IconText
              tintColor={ThemeManager.colors.headingText}
              onPress={() => {
                let item = {coin_family: 1};
                Singleton.getInstance()
                  .newGetData(constants.IS_PRIVATE_WALLET)
                  .then(isPrivate => {
                    if (
                      isPrivate == 'btc' ||
                      isPrivate == 'matic' ||
                      isPrivate == 'trx'
                    ) {
                      Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
                    } else {
                      getCurrentRouteName() != 'Trade' &&
                        navigate(NavigationStrings.Trade, {chain: isPrivate});
                    }
                  });
              }}
              styleIconText={{backgroundColor: ThemeManager.colors.iconBg}}
              imageIcon={Images.swap}
              title={LanguageManager.swap}
            />
            <IconText
              tintColor={ThemeManager.colors.headingText}
              onPress={() => {
                if (CoinData.length == 0) {
                  Singleton.showAlert('Please enable your wallet for Send.');
                  return;
                }
                getCurrentRouteName() != 'Send' &&
                  navigate(NavigationStrings.Send, {
                    walletList: CoinDataMain,
                    from: 'Send',
                  });
              }}
              styleIconText={{backgroundColor: ThemeManager.colors.iconBg}}
              imageIcon={Images.send}
              title="Send"
            />
          </View>
        </View>
        <View key={2}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderRadius: 8,
              paddingTop: 12,
              paddingHorizontal: 20,
              width: '100%',
              backgroundColor: ThemeManager.colors.dashboardBg,
            }}>
            <View>
              <Text
                style={{
                  color: ThemeManager.colors.textColor,
                  fontSize: 16,
                  fontFamily: fonts.semibold,
                }}>
                {LanguageManager.assets}
              </Text>
            </View>
          </View>
        </View>
        <FlatList
          data={CoinData}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  height: Dimensions.get('screen').height / 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    styles.noCoinText,
                    {color: ThemeManager.colors.textColor},
                  ]}>
                  {LanguageManager.noCoinEnabled}
                </Text>
              </View>
            );
          }}
          contentContainerStyle={{paddingVertical: heightDimen(10)}}
          style={{paddingBottom: heightDimen(80)}}
          renderItem={CardItem}
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
                  <ActivityIndicator color={ThemeManager.colors.headingText} />
                </View>
              );
            } else {
              return null;
            }
          }}
        />
      </ScrollView>

      {isLoading && <Loader loader={isLoading} />}
    </View>
  );
};
export default Dashboard;
