/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  NativeModules,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {connect, useDispatch, useSelector} from 'react-redux';
import {LanguageManager, ThemeManager} from '../../../../ThemeManager';
import {DAPP_IMG_URL} from '../../../Endpoints';
import {NavigationStrings} from '../../../Navigation/NavigationStrings';
import {
  changeThemeAction,
  checkMaintenance,
  clearReducer,
  enableDisableNoti,
  getEnableDisableNotiStatus,
  getSocialList,
  logoutUser,
} from '../../../Redux/Actions';
import {onWalletSwitch} from '../../../Redux/Actions/WallectConnectActions';
import Singleton from '../../../Singleton';
import {areaDimen, heightDimen, widthDimen} from '../../../Utils/themeUtils';
import {
  getCurrentRouteName,
  goBack,
  navigate,
  reset,
} from '../../../navigationsService';
import {Images} from '../../../theme';
import images from '../../../theme/Images';
import {BorderLine, MainStatusBar, SimpleHeader} from '../../common';
import SelectNetworkPopUp from '../../common/SelectNetworkPopUp';
import {SettingBar} from '../../common/SettingBar';
import {Wrap} from '../../common/Wrap';
import DappBrowserSwap from '../DappBrowserSwap/DappBrowserSwap';
import Loader from '../Loader/Loader';
import * as constants from './../../../Constant';
import styles from './SettingStyle';
let socialList_init = [
  // {
  //   created_at: '2022-05-20T09:22:31.000Z',
  //   id: 1,
  //   image_url: '/images/instagram.png',
  //   media_link:
  //     'https://www.instagram.com/reel/Cgz9XcbFVgE/?igshid=NWRhNmQxMjQ=',
  //   text: 'Instagram',
  //   updated_at: '2022-06-03T09:50:37.000Z',
  // },
  // {
  //   created_at: '2022-05-20T09:22:31.000Z',
  //   id: 2,
  //   image_url: '/images/twitter.png',
  //   media_link: 'https://twitter.com/WeAreSaitama',
  //   text: 'Twitter',
  //   updated_at: '2022-06-08T05:03:16.000Z',
  // },
  // {
  //   created_at: '2022-05-20T09:22:31.000Z',
  //   id: 3,
  //   image_url: '/images/telegram.png',
  //   media_link: 'https://t.me/SaitamaWorldwide',
  //   text: 'Telegram',
  //   updated_at: '2022-05-26T13:05:16.000Z',
  // },
  // {
  //   created_at: '2022-05-20T09:22:31.000Z',
  //   id: 4,
  //   image_url: '/images/facebook.png',
  //   media_link: 'https://www.facebook.com/groups/1275234186328559/?ref=share',
  //   text: 'Facebook',
  //   updated_at: '2022-05-26T13:05:27.000Z',
  // },
  // {
  //   created_at: '2022-05-20T09:22:31.000Z',
  //   id: 5,
  //   image_url: '/images/discord.png',
  //   media_link: 'https://discord.gg/saitama',
  //   text: 'Discord',
  //   updated_at: '2022-05-26T13:05:35.000Z',
  // },
];
const Languages = [
  {name: 'English', flag: Images.english},
  {name: 'Español', flag: Images.espanol},
  {name: 'Français', flag: Images.france},
  {name: 'Italian', flag: Images.italian},
  {name: 'Português', flag: Images.portugues},
];
let chain = constants.COIN_SYMBOL.ETH;
const Setting = props => {
  const liquidityUrl = useSelector(
    state => state?.walletReducer?.dex_data?.liquidityUrl,
  );
  console.log(liquidityUrl, 'liquidityUrl:::::');
  const dispatch = useDispatch();
  const [linkList, setlinkList] = useState(socialList_init);
  const [isLoading, setisLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [onPressActive, setPressActive] = useState(false);
  const walletList = useSelector(state => state?.walletReducer?.myWallets);
  const [showSelectChain, setshowSelectChain] = useState(false);
  const [showSelectChainLiq, setshowSelectChainLiq] = useState(false);
  const [showLiquidity, setShowLiquidity] = useState(false);
  const [languageIndex, setLanguageIndex] = useState(-1);
  const [theme, setTheme] = useState(1);

  useEffect(() => {
    EventRegister.addEventListener('themeChanged', data => {
      setTheme(data);
    });
  }, [theme]);
  useEffect(() => {
    if (walletList?.length > 0) {
      setLoader(false);
    }
    setTimeout(() => {
      if (loader) {
        setLoader(false);
      }
    }, 5000);
  }, [walletList]);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    props.navigation.addListener('focus', () => {
      setShowLiquidity(false);
      setshowSelectChain(false);
      setshowSelectChainLiq(false);
      EventRegister.addEventListener('downModal', () => {
        // setShowLiquidity(false)
        setshowSelectChain(false);
        setshowSelectChainLiq(false);
      });
      global.stop_pin = false;
      global.currentScreen = 'tabs';
      Singleton.getInstance()
        .newGetData(constants.SOCIAL_LINKS)
        .then(socialLinks => {
          console.log('MM', 'socialLinks', socialLinks);
          if (socialLinks) {
            let data = JSON.parse(socialLinks);
            setlinkList(data);
          }
        });
      Singleton.getInstance()
        .newGetData(constants.LangauageIndex)
        .then(res => {
          console.log('LangauageIndex= ', res);
          if (res == null) {
            setLanguageIndex(0);
          } else {
            setLanguageIndex(res);
          }
        });
    });
    socialLinkList();

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
      EventRegister.removeEventListener('downModal');
    };
  }, []);
  const backAction = () => {
    goBack();
    return true;
  };

  const logoutPressed = () => {
    Alert.alert(constants.APP_NAME, constants.USER_LOGOUT_CHECK, [
      {
        text: 'NO',
        // onPress: () =>  console.warn('MM','Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          setisLoading(true);
          let data = {deviceToken: Singleton.getInstance().device_token};
          let access_token = Singleton.getInstance().access_token;
          //console.warn('MM',data, 'access_token', access_token);
          try {
            Singleton?.getInstance()?.walletConnectRef?.showWalletData?.(false);
            dispatch(onWalletSwitch());
          } catch (error) {
            console.log('eror waletswitch', error);
          }
          dispatch(logoutUser({data, access_token}))
            .then(async res => {
              constants.isFirstTime = true;
              //console.warn('MM','res logout devicetoken::::::::::', res);
              await Singleton.getInstance().clearStorageNew();
              Singleton.getInstance().dynamicColor = '';
              setisLoading(false);
              Singleton.getInstance().newSaveData(
                constants.device_token,
                data.deviceToken,
              );
              clearReducer(dispatch);
              Singleton.getInstance().device_token = data.deviceToken;
              if (Platform.OS == 'android') {
                const clearApplicationData = NativeModules.RootModule;
                await clearApplicationData.clearApplicationData();
              }
              reset(NavigationStrings.WelcomeScreen);
            })
            .catch(err => {
              setisLoading(false);
              Singleton.showAlert(err);
              //console.warn('MM','err logout devicetoken:::::::::', err);
            });
        },
      },
    ]);
  };
  const socialLinkList = () => {
    dispatch(getSocialList())
      .then(async response => {
        setlinkList(response.data);
        Singleton.getInstance().newSaveData(
          constants.SOCIAL_LINKS,
          JSON.stringify(response.data),
        );
      })
      .catch(error => {
        //console.warn('MM','error=socialLinkList====', error);
      });
  };
  const onSelectChain = chain => {
    getCurrentRouteName() !== 'Stake' &&
      navigate(NavigationStrings.Stake, {chain: chain});
  };
  const onSelectChainLiq = chainSelected => {
    chain = chainSelected;
    setShowLiquidity(true);
  };
  const onChangeTheme = async () => {
    let themeValue = '0';
    if (ThemeManager.colors.themeColor === 'dark') {
      console.log('dark theme:::::');
      // light
      var val = 'theme2';
      await Singleton.getInstance().newSaveData(constants.IS_THEME_ENABLE, val);
      await Singleton.getInstance().newSaveData(
        constants.CURRENT_THEME_MODE,
        JSON.stringify(0),
      );
      themeValue = '0';
    } else {
      console.log('light theme:::::');
      var val = 'theme1';
      await Singleton.getInstance().newSaveData(constants.IS_THEME_ENABLE, val);
      await Singleton.getInstance().newSaveData(
        constants.CURRENT_THEME_MODE,
        JSON.stringify(1),
      );
      themeValue = '1';
    }
    ThemeManager.setLanguage(val);
    dispatch(changeThemeAction(themeValue));
    // Actions.refresh();
    setTimeout(() => {
      EventRegister.emit('themeChanged', val);
    }, 100);
  };
  const onPressStake = () => {
    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (
          isPrivate == constants.COIN_SYMBOL.BTC ||
          isPrivate == constants.COIN_SYMBOL.MATIC ||
          isPrivate == constants.COIN_SYMBOL.TRX ||
          isPrivate == constants.COIN_SYMBOL.STC
        ) {
          Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
        } else if (isPrivate == constants.COIN_SYMBOL.ETH) {
          onSelectChain(constants.COIN_SYMBOL.ETH);
        } else if (isPrivate == constants.COIN_SYMBOL.BNB) {
          onSelectChain(constants.COIN_SYMBOL.BNB);
        } else {
          setshowSelectChain(true);
        }
      });
  };
  const onPressLiquidity = () => {
    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (
          isPrivate == constants.COIN_SYMBOL.BTC ||
          isPrivate == constants.COIN_SYMBOL.MATIC ||
          isPrivate == constants.COIN_SYMBOL.TRX
        ) {
          Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
        } else if (isPrivate == constants.COIN_SYMBOL.ETH) {
          onSelectChainLiq(constants.COIN_SYMBOL.ETH);
        } else if (isPrivate == constants.COIN_SYMBOL.BNB) {
          onSelectChainLiq('bsc');
        } else if (isPrivate == constants.COIN_SYMBOL.STC) {
          onSelectChainLiq('sbc');
        } else {
          setshowSelectChainLiq(true);
        }
      });
  };
  return (
    <>
      <Wrap style={{backgroundColor: ThemeManager.colors.bg}}>
        <MainStatusBar
          backgroundColor={ThemeManager.colors.bg}
          barStyle={
            ThemeManager.colors.themeColor === 'light'
              ? 'dark-content'
              : 'light-content'
          }
        />
        <SimpleHeader
          title={LanguageManager.profileSettings}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle
          imageShow
          back={false}
          backPressed={() => {
            getCurrentRouteName() == 'Setting' && props.navigation.goBack();
          }}
          secondRightImage={ThemeManager.ImageIcons.themeLight}
          plusIconStyle={{
            height: areaDimen(21),
            width: areaDimen(39),
            resizeMode: 'contain',
          }}
          onPresssecondRightImage={onChangeTheme}
        />
        <BorderLine
          borderColor={{backgroundColor: ThemeManager.colors.viewBorderColor}}
        />
        <View
          style={{
            flex: 1,
            //  padding: widthDimen(10)
          }}>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <Text
              style={[
                styles.textStyle,
                {
                  color: ThemeManager.colors.textColor,
                  marginTop: heightDimen(24),
                },
              ]}>
              {LanguageManager.account}
            </Text>
            <View style={[styles.card]}>
              <SettingBar
                shadowImage={true}
                disabled={onPressActive}
                iconImage={images.icon_manage_wallet}
                iconImageStyle={styles.imageViewStyle}
                imgStyle={[styles.img]}
                title={LanguageManager.MultiWallet}
                titleStyle={{color: ThemeManager.colors.lightTextColor}}
                onPress={() => {
                  setPressActive(true);
                  setTimeout(() => {
                    setPressActive(false);
                  }, 200);
                  getCurrentRouteName() != 'MultiWalletList' &&
                    navigate(NavigationStrings.MultiWalletList);
                }}
                style={{borderBottomWidth: 0}}
                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
              />
            </View>

            <View style={styles.card}>
              <SettingBar
                shadowImage={true}
                disabled={onPressActive}
                iconImage={images.icon_stake}
                iconImageStyle={styles.imageViewStyle}
                title={'Stake (Coming soon)'} //Commented for coming soon {LanguageManager.stake}
                titleStyle={{color: ThemeManager.colors.lightTextColor}}
                onPress={() => {
                  return;
                }}
                //Commented for coming soon
                // onPress={() => {
                //   setisLoading(true);
                //   dispatch(checkMaintenance())
                //     .then(res => {
                //       setisLoading(false);
                //       console.log('res::::checkMaintenance', res);
                //       let stakeCheck = res?.data?.find(
                //         item => item.type == 'IS_STAKE_MAINTENANCE',
                //       );
                //       if (stakeCheck?.value == 1) {
                //         Singleton.showAlert(stakeCheck?.msg);
                //       } else {
                //         onPressStake();
                //       }
                //     })
                //     .catch(err => {
                //       setisLoading(false);
                //       console.log('err::::checkMaintenance', err);
                //       onPressStake();
                //     });
                // }}
                style={{borderBottomWidth: 0}}
                imgStyle={[styles.img]}
                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
              />
            </View>
            <View style={styles.card}>
              <SettingBar
                shadowImage={true}
                disabled={onPressActive}
                iconImage={images.icon_liquidity}
                iconImageStyle={styles.imageViewStyle}
                title={'Liquidity (Coming soon)'} //Commented for coming soon
                titleStyle={{color: ThemeManager.colors.lightTextColor}}
                onPress={() => {
                  return;
                }}
                //Commented for coming soon
                // onPress={() => {
                //   setisLoading(true);
                //   dispatch(checkMaintenance())
                //     .then(res => {
                //       setisLoading(false);
                //       console.log('res::::checkMaintenance', res);
                //       let liquidityCheck = res?.data?.find(
                //         item => item.type == 'IS_LIQUIDITY_MAINTENANCE',
                //       );
                //       if (liquidityCheck?.value == 1) {
                //         Singleton.showAlert(liquidityCheck?.msg);
                //       } else {
                //         onPressLiquidity();
                //       }
                //     })
                //     .catch(err => {
                //       setisLoading(false);
                //       console.log('err::::checkMaintenance', err);
                //       onPressLiquidity();
                //     });
                // }}
                style={{borderBottomWidth: 0}}
                imgStyle={[styles.img]}
                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
              />
            </View>
            <View style={styles.card}>
              <SettingBar
                shadowImage={true}
                disabled={onPressActive}
                iconImage={images.icon_history}
                iconImageStyle={styles.imageViewStyle}
                title={LanguageManager.History}
                titleStyle={{color: ThemeManager.colors.lightTextColor}}
                onPress={() => {
                  setPressActive(true);
                  setTimeout(() => {
                    setPressActive(false);
                  }, 200);
                  global.currentScreen = 'Settings';
                  getCurrentRouteName() != 'HistoryComponent' &&
                    navigate(NavigationStrings.HistoryComponent, {
                      fromSetting: true,
                    });
                }}
                style={{borderBottomWidth: 0}}
                imgStyle={[styles.img]}
                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
              />
            </View>

            <View style={[styles.card]}>
              <SettingBar
                shadowImage={true}
                disabled={onPressActive}
                iconImage={images.icon_currency}
                iconImageStyle={styles.imageViewStyle}
                title={LanguageManager.Preferences}
                titleStyle={{color: ThemeManager.colors.lightTextColor}}
                isDetailText={true}
                detailText={Singleton.getInstance().CurrencySelected}
                onPress={() => {
                  setPressActive(true);
                  setTimeout(() => {
                    setPressActive(false);
                  }, 200);
                  getCurrentRouteName() != 'CurrencyPreference' &&
                    navigate(NavigationStrings.CurrencyPreference);
                }}
                style={{borderBottomWidth: 0}}
                imgStyle={[styles.img]}
                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
              />
            </View>

            <View style={[styles.card]}>
              <SettingBar
                shadowImage={true}
                disabled={onPressActive}
                iconImage={images.icon_language}
                iconImageStyle={styles.imageViewStyle}
                title={LanguageManager.chooselanguage}
                titleStyle={{color: ThemeManager.colors.lightTextColor}}
                isDetailText={true}
                detailText={languageIndex > -1 && Languages[languageIndex].name}
                isDetailIcon={true}
                detailIcon={languageIndex > -1 && Languages[languageIndex].flag}
                onPress={() => {
                  setPressActive(true);
                  setTimeout(() => {
                    setPressActive(false);
                  }, 200);
                  getCurrentRouteName() != 'ChooseLanguage' &&
                    navigate(NavigationStrings.ChooseLanguage, {
                      from: 'setting',
                    });
                }}
                style={{borderBottomWidth: 0}}
                imgStyle={[styles.img]}
                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
              />
            </View>
            <View style={[styles.card]}>
              <SettingBar
                shadowImage={true}
                disabled={onPressActive}
                iconImage={images.icon_security}
                iconImageStyle={styles.imageViewStyle}
                title={LanguageManager.Security}
                titleStyle={{color: ThemeManager.colors.lightTextColor}}
                onPress={() => {
                  setPressActive(true);
                  setTimeout(() => {
                    setPressActive(false);
                  }, 200);

                  getCurrentRouteName() != 'Security' &&
                    navigate(NavigationStrings.Security);
                }}
                style={{borderBottomWidth: 0}}
                imgStyle={[styles.img]}
                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
              />
            </View>
            <View style={[styles.card]}>
              <SettingBar
                shadowImage={true}
                disabled={onPressActive}
                iconImage={images.icon_wallet_connect}
                iconImageStyle={styles.imageViewStyle}
                title={LanguageManager.WalletConnect}
                titleStyle={{color: ThemeManager.colors.lightTextColor}}
                onPress={() => {
                  setPressActive(true);
                  setTimeout(() => {
                    setPressActive(false);
                  }, 200);

                  Singleton.getInstance()
                    .newGetData(constants.IS_PRIVATE_WALLET)
                    .then(isPrivate => {
                      if (
                        isPrivate == constants.COIN_SYMBOL.BTC ||
                        isPrivate == constants.COIN_SYMBOL.TRX
                      ) {
                        Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
                      } else {
                        getCurrentRouteName() != 'ConnectWithDapp' &&
                          navigate(NavigationStrings.ConnectWithDapp);
                      }
                    });
                }}
                style={{borderBottomWidth: 0}}
                imgStyle={[styles.img]}
                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
              />
            </View>
            <View style={[styles.card]}>
              <SettingBar
                shadowImage={true}
                disabled={onPressActive}
                iconImage={images.icon_bulk_transfer}
                iconImageStyle={styles.imageViewStyle}
                title={'Bulk Transfer'}
                titleStyle={{color: ThemeManager.colors.lightTextColor}}
                onPress={() => {
                  console.log('walletList:::::', walletList?.length);
                  if (walletList?.length > 0) {
                    Singleton.getInstance()
                      .newGetData(constants.IS_PRIVATE_WALLET)
                      .then(isPrivate => {
                        if (
                          isPrivate == constants.COIN_SYMBOL.BTC ||
                          isPrivate == constants.COIN_SYMBOL.TRX
                        ) {
                          Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
                        } else {
                          console.log('walletList=======', walletList);
                          getCurrentRouteName() != 'MultiSender' &&
                            navigate(NavigationStrings.MultiSender, {
                              walletList: walletList,
                            });
                        }
                      });
                  } else {
                    Singleton.showAlert(
                      'Please wait until we are fetching your wallet details.',
                    );
                    return;
                  }
                }}
                style={{borderBottomWidth: 0}}
                imgStyle={[styles.img]}
                arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
              />
            </View>
            <Text
              style={[
                styles.textStyle,
                {color: ThemeManager.colors.textColor},
              ]}>
              {LanguageManager.getSupported}
            </Text>
            <View style={[styles.card, {marginVertical: 2}]}>
              <SettingBar
                shadowImage={true}
                disabled={onPressActive}
                iconImage={images.icon_rezor_support}
                iconImageStyle={styles.imageViewStyle}
                title={LanguageManager.rezorSupport}
                titleStyle={{color: ThemeManager.colors.lightTextColor}}
                onPress={() => {
                  getCurrentRouteName() != 'RezorSupport' &&
                    navigate(NavigationStrings.RezorSupport);
                }}
                style={{borderBottomWidth: 0}}
                imgStyle={[styles.img]}
              />
            </View>
            {/* <Text
                style={[
                  styles.textStyle,
                  { color: ThemeManager.colors.textColor },
                ]}>
                {LanguageManager.contactUs}
              </Text> */}
            {/* <FlatList
                data={linkList}
                renderItem={({ item }) => (
                  <View style={[styles.card, {}]}>
                    <SettingBar
                      disabled={onPressActive}
                      iconImage={{ uri: DAPP_IMG_URL + item.image_url }} //TODO: - Uncomment this for Prod
                      iconImageStyle={[
                        styles.imageViewSocialMediaStyle,
                        {
                          borderRadius: areaDimen(50),
                        },
                      ]}
                      title={item.text}
                      titleStyle={{ color: ThemeManager.colors.lightTextColor }}
                      onPress={() => {
                        setPressActive(true);
                        setTimeout(() => {
                          setPressActive(false);
                        }, 200);
                        Linking.openURL(item.media_link);
                      }}
                      style={{ borderBottomWidth: 0 }}
                      imgStyle={{
                        height: widthDimen(38),
                        width: widthDimen(38),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                )}
              /> */}
            <View style={{marginBottom: heightDimen(20)}}>
              <TouchableOpacity
                onPress={() => {
                  setPressActive(true);
                  setTimeout(() => {
                    setPressActive(false);
                  }, 200);
                  logoutPressed();
                }}
                style={[styles.logoutBtnStyle]}>
                <Image
                  style={styles.logoutIconStyle}
                  source={images.icon_logout}
                />
                <Text
                  style={[
                    styles.titleLogoutStyle,
                    {color: ThemeManager.colors.lightTextColor},
                  ]}>
                  {LanguageManager.Logout}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Modal
            visible={showSelectChain}
            animationType="fade"
            transparent={true}
            statusBarTranslucent
            onRequestClose={() => {
              setshowSelectChain(false);
            }}
            style={{flex: 1, justifyContent: 'flex-end'}}>
            <SelectNetworkPopUp
              isDisableStc={true}
              onClose={() => setshowSelectChain(false)}
              onPressEth={() => {
                setshowSelectChain(false);
                onSelectChain(constants.COIN_SYMBOL.ETH);
              }}
              onPressBnb={() => {
                setshowSelectChain(false);
                onSelectChain(constants.COIN_SYMBOL.BNB);
              }}
              onPressStc={() => {
                setshowSelectChain(false);
                onSelectChain(constants.COIN_SYMBOL.STC);
              }}
            />
          </Modal>
          <Modal
            visible={showSelectChainLiq}
            animationType="fade"
            transparent={true}
            onRequestClose={() => {
              setshowSelectChainLiq(false);
            }}
            statusBarTranslucent
            style={{flex: 1, justifyContent: 'flex-end'}}>
            <SelectNetworkPopUp
              onClose={() => setshowSelectChainLiq(false)}
              onPressEth={() => {
                setshowSelectChainLiq(false);
                onSelectChainLiq(constants.COIN_SYMBOL.ETH);
              }}
              onPressBnb={() => {
                setshowSelectChainLiq(false);
                onSelectChainLiq('bsc');
              }}
              onPressStc={() => {
                setshowSelectChainLiq(false);
                onSelectChainLiq('sbc');
              }}
            />
          </Modal>

          {(isLoading || loader) && <Loader />}
        </View>
      </Wrap>
      <Modal
        visible={showLiquidity}
        animationType="fade"
        transparent={false}
        onRequestClose={() => {
          setShowLiquidity(false);
        }}
        style={{
          flex: 1,
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
        }}>
        <Wrap style={{flex: 1, backgroundColor: ThemeManager.colors.bg}}>
          <MainStatusBar
            backgroundColor={ThemeManager.colors.bg}
            barStyle={
              ThemeManager.colors.themeColor === 'light'
                ? 'dark-content'
                : 'light-content'
            }
          />
          <SimpleHeader
            title={'Liquidity'}
            backImage={ThemeManager.ImageIcons.iconBack}
            titleStyle
            imageShow
            back={false}
            backPressed={() => {
              setShowLiquidity(false);
            }}
          />
          <BorderLine
            borderColor={{backgroundColor: ThemeManager.colors.borderColor}}
          />
          <View style={{flex: 1}}>
            <DappBrowserSwap
              chain={chain}
              url={liquidityUrl + `?chainId=${chain}`}
              // url={'https://www.new-dex.saita.pro/liquidity/liquidity-form' + `?chainId=${chain}`}
              item={{
                coin_family:
                  chain == constants.COIN_SYMBOL.ETH
                    ? 1
                    : chain == 'sbc'
                    ? 4
                    : 6,
              }}
            />
          </View>
        </Wrap>
      </Modal>
    </>
  );
};

const mapStateToProp = state => {
  const {} = state.walletReducer;
  return {};
};

export default connect(mapStateToProp, {
  getSocialList,
  logoutUser,
  enableDisableNoti,
  getEnableDisableNotiStatus,
})(Setting);
