/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  Linking,
  NativeModules,
  BackHandler,
  Dimensions
} from 'react-native';
import { Wrap } from '../../common/Wrap';
import {
  BorderLine,
  MainStatusBar,
  SimpleHeader,
} from '../../common';
import { Actions } from 'react-native-router-flux';
import images from '../../../theme/Images';
import styles from './SettingStyle';
import {
  logoutUser,
  enableDisableNoti,
  getEnableDisableNotiStatus,
  getSocialList,
  changeThemeAction,
  checkMaintenance,
  clearReducer,
} from '../../../Redux/Actions';
import { Images } from '../../../theme';
import { SettingBar } from '../../common/SettingBar';
import * as constants from './../../../Constant';
import { ActionConst } from 'react-native-router-flux';
import Singleton from '../../../Singleton';
import { connect, useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader/Loader';
import { DAPP_IMG_URL, BASE_IMAGE } from '../../../Endpoints';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { EventRegister } from 'react-native-event-listeners';
import { Platform } from 'react-native';
import { onWalletSwitch } from '../../../Redux/Actions/WallectConnectActions';
import { Modal } from 'react-native';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import DappBrowserSwap from '../DappBrowserSwap/DappBrowserSwap';
import SelectNetworkPopUp from '../../common/SelectNetworkPopUp';
let socialList_init = [
  {
    created_at: '2022-05-20T09:22:31.000Z',
    id: 1,
    image_url: '/images/instagram.png',
    media_link:
      'https://www.instagram.com/reel/Cgz9XcbFVgE/?igshid=NWRhNmQxMjQ=',
    text: 'Instagram',
    updated_at: '2022-06-03T09:50:37.000Z',
  },
  {
    created_at: '2022-05-20T09:22:31.000Z',
    id: 2,
    image_url: '/images/twitter.png',
    media_link: 'https://twitter.com/WeAreSaitama',
    text: 'Twitter',
    updated_at: '2022-06-08T05:03:16.000Z',
  },
  {
    created_at: '2022-05-20T09:22:31.000Z',
    id: 3,
    image_url: '/images/telegram.png',
    media_link: 'https://t.me/SaitamaWorldwide',
    text: 'Telegram',
    updated_at: '2022-05-26T13:05:16.000Z',
  },
  {
    created_at: '2022-05-20T09:22:31.000Z',
    id: 4,
    image_url: '/images/facebook.png',
    media_link: 'https://www.facebook.com/groups/1275234186328559/?ref=share',
    text: 'Facebook',
    updated_at: '2022-05-26T13:05:27.000Z',
  },
  {
    created_at: '2022-05-20T09:22:31.000Z',
    id: 5,
    image_url: '/images/discord.png',
    media_link: 'https://discord.gg/saitama',
    text: 'Discord',
    updated_at: '2022-05-26T13:05:35.000Z',
  },
];
const Languages = [
  { name: 'English', flag: Images.english },
  { name: 'Español', flag: Images.espanol },
  { name: 'Français', flag: Images.france },
  { name: 'Italian', flag: Images.italian },
  { name: 'Português', flag: Images.portugues },
];
let chain = 'eth';
const Setting = props => {
  const liquidityUrl = useSelector(
    state => state?.walletReducer?.dex_data?.liquidityUrl,
  );
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
    BackHandler.addEventListener('hardwareBackPress', backAction)
    props.navigation.addListener('didFocus', () => {
      setShowLiquidity(false)
      setshowSelectChain(false)
      setshowSelectChainLiq(false)
      EventRegister.addEventListener('downModal', () => {
        setShowLiquidity(false)
        setshowSelectChain(false)
        setshowSelectChainLiq(false)
      })
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
      BackHandler.removeEventListener('hardwareBackPress', backAction)
      EventRegister.removeEventListener('downModal')
    }
  }, []);
  const backAction = () => {
    Actions.pop()
    return true
  }

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
          let data = { deviceToken: Singleton.getInstance().device_token };
          let access_token = Singleton.getInstance().access_token;
          //console.warn('MM',data, 'access_token', access_token);
          try {
            dispatch(onWalletSwitch());
          } catch (error) {
            console.log('eror waletswitch', error);
          }
          dispatch(logoutUser({ data, access_token }))
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
              clearReducer(dispatch)
              Singleton.getInstance().device_token = data.deviceToken;
              if (Platform.OS == 'android') {
                const clearApplicationData = NativeModules.RootModule;
              await  clearApplicationData.clearApplicationData();
              }
              Actions.Splash({ type: ActionConst.RESET }, () => { });
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
    Actions.currentScene !== 'Stake' && Actions.Stake({ chain: chain });
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
    Actions.refresh();
   setTimeout(() => {
    EventRegister.emit('themeChanged',val)
   }, 100);
  };
  const onPressStake = () => {
    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (isPrivate == 'btc' || isPrivate == 'matic' || isPrivate == 'trx' || isPrivate=='stc') {
          Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
        } else if (isPrivate == 'eth') {
          onSelectChain('eth');
        } else if (isPrivate == 'bnb') {
          onSelectChain('bnb');
        } else {
          setshowSelectChain(true);
        }
      });
  };
  const onPressLiquidity = () => {
    Singleton.getInstance()
      .newGetData(constants.IS_PRIVATE_WALLET)
      .then(isPrivate => {
        if (isPrivate == 'btc' || isPrivate == 'matic' || isPrivate == 'trx' || isPrivate=='stc') {
          Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
        } else if (isPrivate == 'eth') {
          onSelectChainLiq('eth');
        } else if (isPrivate == 'bnb') {
          onSelectChainLiq('bnb');
        } else {
          setshowSelectChainLiq(true);
        }
      });
  };
  return (
    <>
        <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
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
              Actions.currentScene == 'Setting' && props.navigation.goBack();
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
            borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
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
                  titleStyle={{ color: ThemeManager.colors.lightTextColor }}
                  onPress={() => {
                    setPressActive(true);
                    setTimeout(() => {
                      setPressActive(false);
                    }, 200);
                    Actions.currentScene != 'MultiWalletList' &&
                      Actions.MultiWalletList();
                  }}
                  style={{ borderBottomWidth: 0 }}
                  arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
                />
              </View>

              <View style={styles.card}>
                <SettingBar
                  shadowImage={true}
                  disabled={onPressActive}
                  iconImage={images.icon_stake}
                  iconImageStyle={styles.imageViewStyle}
                  title={LanguageManager.stake}
                  titleStyle={{ color: ThemeManager.colors.lightTextColor }}
                  onPress={() => {
                    setisLoading(true);
                    dispatch(checkMaintenance())
                      .then(res => {
                        setisLoading(false);
                        console.log('res::::checkMaintenance', res);
                        let stakeCheck = res?.data?.find(
                          item => item.type == 'IS_STAKE_MAINTENANCE',
                        );
                        if (stakeCheck?.value == 1) {
                          Singleton.showAlert(stakeCheck?.msg);
                        } else {
                          onPressStake();
                        }
                      })
                      .catch(err => {
                        setisLoading(false);
                        console.log('err::::checkMaintenance', err);
                        onPressStake();
                      });
                  }}
                  style={{ borderBottomWidth: 0 }}
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
                  title={'Liquidity'}
                  titleStyle={{ color: ThemeManager.colors.lightTextColor }}
                  onPress={() => {
                    setisLoading(true);
                    dispatch(checkMaintenance())
                      .then(res => {
                        setisLoading(false);
                        console.log('res::::checkMaintenance', res);
                        let liquidityCheck = res?.data?.find(
                          item => item.type == 'IS_LIQUIDITY_MAINTENANCE',
                        );
                        if (liquidityCheck?.value == 1) {
                          Singleton.showAlert(liquidityCheck?.msg);
                        } else {
                          onPressLiquidity();
                        }
                      })
                      .catch(err => {
                        setisLoading(false);
                        console.log('err::::checkMaintenance', err);
                        onPressLiquidity();
                      });
                  }}
                  style={{ borderBottomWidth: 0 }}
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
                  titleStyle={{ color: ThemeManager.colors.lightTextColor }}
                  onPress={() => {
                    setPressActive(true);
                    setTimeout(() => {
                      setPressActive(false);
                    }, 200);
                    global.currentScreen = 'Settings';
                    Actions.currentScene != 'HistoryComponent' &&
                      Actions.HistoryComponent({ fromSetting: true });
                  }}
                  style={{ borderBottomWidth: 0 }}
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
                  titleStyle={{ color: ThemeManager.colors.lightTextColor }}
                  isDetailText={true}
                  detailText={Singleton.getInstance().CurrencySelected}
                  onPress={() => {
                    setPressActive(true);
                    setTimeout(() => {
                      setPressActive(false);
                    }, 200);
                    Actions.currentScene != 'CurrencyPreference' &&
                      Actions.CurrencyPreference();
                  }}
                  style={{ borderBottomWidth: 0 }}
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
                  titleStyle={{ color: ThemeManager.colors.lightTextColor }}
                  isDetailText={true}
                  detailText={
                    languageIndex > -1 && Languages[languageIndex].name
                  }
                  isDetailIcon={true}
                  detailIcon={
                    languageIndex > -1 && Languages[languageIndex].flag
                  }
                  onPress={() => {
                    setPressActive(true);
                    setTimeout(() => {
                      setPressActive(false);
                    }, 200);
                    Actions.currentScene != 'ChooseLanguage' &&
                      Actions.ChooseLanguage({ from: 'setting' });
                  }}
                  style={{ borderBottomWidth: 0 }}
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
                  titleStyle={{ color: ThemeManager.colors.lightTextColor }}
                  onPress={() => {
                    setPressActive(true);
                    setTimeout(() => {
                      setPressActive(false);
                    }, 200);

                    Actions.currentScene != 'Security' && Actions.Security();
                  }}
                  style={{ borderBottomWidth: 0 }}
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
                  titleStyle={{ color: ThemeManager.colors.lightTextColor }}
                  onPress={() => {
                    setPressActive(true);
                    setTimeout(() => {
                      setPressActive(false);
                    }, 200);

                    Singleton.getInstance()
                      .newGetData(constants.IS_PRIVATE_WALLET)
                      .then(isPrivate => {
                        if (isPrivate == 'btc' || isPrivate == 'trx' ) {
                          Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
                        } else {
                          Actions.currentScene != 'ConnectWithDapp' &&
                            Actions.ConnectWithDapp();
                        }
                      });
                  }}
                  style={{ borderBottomWidth: 0 }}
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
                  titleStyle={{ color: ThemeManager.colors.lightTextColor }}
                  onPress={() => {
                    console.log('walletList:::::', walletList?.length);
                    if (walletList?.length > 0) {
                      Singleton.getInstance()
                        .newGetData(constants.IS_PRIVATE_WALLET)
                        .then(isPrivate => {
                          if (isPrivate == 'btc' || isPrivate == 'trx') {
                            Singleton.showAlert(constants.UNCOMPATIBLE_WALLET);
                          } else {
                            console.log('walletList=======', walletList);
                            Actions.currentScene != 'MultiSender' &&
                              Actions.MultiSender({ walletList: walletList });
                          }
                        });
                    } else {
                      Singleton.showAlert('Please wait until we are fetching your wallet details.');
                      return;
                    }
                  }}
                  style={{ borderBottomWidth: 0 }}
                  imgStyle={[styles.img]}
                  arrowIcon={ThemeManager.ImageIcons.forwardArrowIcon}
                />
              </View>
              <Text
                style={[
                  styles.textStyle,
                  { color: ThemeManager.colors.textColor },
                ]}>
                {LanguageManager.getSupported}
              </Text>
              <View style={[styles.card, { marginVertical: 2 }]}>
                <SettingBar
                  shadowImage={true}
                  disabled={onPressActive}
                  iconImage={images.icon_saita_support}
                  iconImageStyle={styles.imageViewStyle}
                  title={LanguageManager.saitaProSupport}
                  titleStyle={{ color: ThemeManager.colors.lightTextColor }}
                  onPress={() => {
                    Actions.currentScene != 'SaitaProSupport' &&
                      Actions.SaitaProSupport();
                  }}
                  style={{ borderBottomWidth: 0 }}
                  imgStyle={[styles.img]}
                />
              </View>
              <Text
                style={[
                  styles.textStyle,
                  { color: ThemeManager.colors.textColor },
                ]}>
                {LanguageManager.contactUs}
              </Text>
              <FlatList
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
              />
              <View style={{ marginBottom: heightDimen(20) }}>
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
                      { color: ThemeManager.colors.lightTextColor },
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
                setshowSelectChain(false)
              }}
              style={{ flex: 1, justifyContent: 'flex-end' }}>
              <SelectNetworkPopUp
                onClose={() => setshowSelectChain(false)}
                onPressEth={() => {
                  setshowSelectChain(false);
                  onSelectChain('eth');
                }}
                onPressBnb={() => {
                  setshowSelectChain(false);
                  onSelectChain('bnb');
                }}
                onPressStc={()=>{
                  setshowSelectChain(false);
                  Singleton.showAlert('Coming soon!')
                }}
              />
            </Modal>
            <Modal
              visible={showSelectChainLiq}
              animationType="fade"
              transparent={true}
              onRequestClose={() => {
                setshowSelectChainLiq(false)
              }}
              statusBarTranslucent
              style={{ flex: 1, justifyContent: 'flex-end' }}>
              <SelectNetworkPopUp
                onClose={() => setshowSelectChainLiq(false)}
                onPressEth={() => {
                  setshowSelectChainLiq(false);
                  onSelectChainLiq('eth');
                }}
                onPressBnb={() => {
                  setshowSelectChainLiq(false);
                  onSelectChainLiq('bnb');
                }}
                onPressStc={()=>{
                  setshowSelectChainLiq(false);
                  Singleton.showAlert('Coming soon!')
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
          setShowLiquidity(false)
        }}
        style={{ flex: 1,height:Dimensions.get('window').height,width:Dimensions.get('window').width ,}}>
          <Wrap style={{ flex: 1, backgroundColor: ThemeManager.colors.bg }}>
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
              borderColor={{ backgroundColor: ThemeManager.colors.borderColor }}
            />
            <View style={{ flex: 1 }}>
              <DappBrowserSwap
              chain={chain}
                url={liquidityUrl + `?chain=${chain}`}
                item={{ coin_family: chain=='eth'?1:chain=='stc'?4:6 }}
              />
            </View>
          </Wrap>
      </Modal>
    </>
  );
};

const mapStateToProp = state => {
  const { } = state.walletReducer;
  return {};
};

export default connect(mapStateToProp, {
  getSocialList,
  logoutUser,
  enableDisableNoti,
  getEnableDisableNotiStatus,
})(Setting);
