/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  BackHandler,
  Alert,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import {
  Wrap,
  Multibtn,
  BasicButton,
  MainStatusBar,
  PinInput,
  KeyboardDigit,
} from '../../common';
import { EventRegister } from 'react-native-event-listeners';
import { Colors } from '../../../theme';
import fonts from '../../../theme/Fonts';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import { SubHeader, ButtonPrimary } from '../../common';
import ReactNativeBiometrics from 'react-native-biometrics';
import { Images } from '../../../theme';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import {
  getInfuraLink,
  getInfuraBNBLink,
  getRouterDetails,
  createWallet,
  getDexUrls
} from '../../../Redux/Actions';
import { connect } from 'react-redux';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import { APIClient } from '../../../Api';
import { API_REFRESH_TOKEN } from '../../../Endpoints';
import Loader from '../Loader/Loader';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import DeviceInfo from 'react-native-device-info';
const windowHeight = Dimensions.get('window').height;
let buildNumber = DeviceInfo.getVersion();
class ConfirmPin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      pin: '',
      showImage: false,
      showTouch: false,
      showFace: false,
      pinFromStorage: '',
    };

    this.pinCode = props.pin | '';
    this.firstTime = props.firstTime || false;
  }

  componentDidMount() {
    Constants.isFirstTime = false;
    this.getInfuraMainLink();
    this.getInfuraBNB();
    this.getRouterDetailsApi();
    this.getDexUrlsMain();
    // this.updateSTCKeys();
    // //console.warn('MM','chk frst tym:::', this.firstTime);
    if (this.firstTime == false) {
      this.props.navigation.addListener('didFocus', this.screenFocus);
      this.props.navigation.addListener('didBlur', this.screenBlur);
      Singleton.getInstance()
        .newGetData(Constants.PIN)
        .then(pin => {
          //console.warn('MM','saved pin::::', pin);
          this.pinCode = pin;
          this.setState({ pinFromStorage: pin });
          global.isOnPinScreen = true;
        });
      Singleton.getInstance()
        .newGetData(Constants.ENABLE_PIN)
        .then(enablePin => {
          // alert(enablePin);
          //console.warn('MM','chk enablePin app lock::::security', enablePin);
          // if (enablePin == 'true') {
          this.checkBiometricAvailability();
          // }
        });
    }
    Singleton.getInstance()
      .newGetData(Constants.CURRENCY_SELECTED)
      .then(CurrencySelected => {
        // //console.warn('MM','CurrencySelected--- ', CurrencySelected);
        Singleton.getInstance()
          .newGetData(Constants.CURRENCY_SYMBOL)
          .then(CurrencySymbol => {
            if (CurrencySelected == null || CurrencySelected == 'null') {
              Singleton.getInstance().CurrencySelected = 'USD';
              Singleton.getInstance().CurrencySymbol = '$';
            } else {
              Singleton.getInstance().CurrencySelected = CurrencySelected;
              Singleton.getInstance().CurrencySymbol = CurrencySymbol;
            }
          });
      });
  }
  updateSTCKeys() {
    let newGetData = Singleton.getInstance().newGetData;
    let newSaveData = Singleton.getInstance().newSaveData;
    newGetData(Constants.UPDATE_STC_ASYNC_KEY).then(async update_async => {
      // Alert.alert('update_async'+update_async+buildNumber)
      if (update_async != 'true') {
        // Alert.alert('update_async logged'+buildNumber)
        newGetData(Constants.coinFamilyKeys).then(async res => {
          console.log("JSON", res,typeof res );
          // let coinFamilyKeys = res?.split(',')
       
          let coinFamilyKeys =  ["1", "2", "6", "11", "3"]
          console.log("coinFamilyKeys", coinFamilyKeys ,coinFamilyKeys?.length);
          console.log("coinFamilyKeys  1",coinFamilyKeys);
          // Alert.alert('coinFamilyKeys'+coinFamilyKeys)
          if (coinFamilyKeys?.length > 1) {
            if (!coinFamilyKeys?.toString()?.includes('4')) {
              coinFamilyKeys = [1, 2, 6, 11, 3, 4]
            }
          }
          console.log("coinFamilyKeys  11",coinFamilyKeys,typeof coinFamilyKeys);
         await newSaveData(Constants.coinFamilyKeys,coinFamilyKeys)
        //  Alert.alert('Update'+coinFamilyKeys)
         await newSaveData(Constants.UPDATE_STC_ASYNC_KEY,'true')
        })
      }
    });
  };
  getInfuraMainLink = () => {
    this.props
      .getInfuraLink()
      .then(response => {
        // console.warn('MM','response==getInfuraMainLink==== pin', response);
        Constants.mainnetInfuraLink = response.link;
        Singleton.getInstance().ethLink = response.link
        // Constants.mainnetInfuraLinkMatic = 
      })
      .catch(error => {
        //console.warn('MM','error==getInfuraMainLink=== pin', error);
      });
  };
  getDexUrlsMain = () => {
    let access_token = Singleton.getInstance().access_token
    this.props
      .getDexUrls(access_token)
      .then(response => {
        // console.warn('MM','response==getDexUrls ==== pin', response);
      })
      .catch(error => {
        // console.warn('MM','error==getDexUrls=== pin', error);
      });
  };
  getInfuraBNB = () => {
    this.props
      .getInfuraBNBLink()
      .then(response => {
        //console.warn('MM','response==bnb ==== pin', response);
        Constants.mainnetInfuraLinkBNB = response.link;
        Singleton.getInstance().bnbLink = response.link;
      })
      .catch(error => {
        //console.warn('MM','error==getInfuraMainLink=== pin', error);
      });
  };
  getRouterDetailsApi = () => {
    this.props
      .getRouterDetails()
      .then(response => {
        console.warn('MM', 'response== router ==== pin', response);
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

  screenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }
  screenFocus = () => {
    this.checkBiometricAvailability(true)
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  };
  backAction = () => {
    //console.warn('MM','******* chk Actions.currentScene', Actions.currentScene);
    //console.warn('MM','*******  confirmPin', this.props.goBack);
    this.props.goBack == true && Actions.pop();
    return true;
  };
  checkBiometricAvailability(isONlyCheck) {
    console.log("checkBiometric called", isONlyCheck);
    ReactNativeBiometrics.isSensorAvailable().then(async resultObject => {
      const { available, biometryType } = resultObject;
      let isBiometricEnabled = await Singleton.getInstance().newGetData(Constants.ENABLE_PIN)
      console.log("isBiometricEnabled:;::", isBiometricEnabled);
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        console.warn('MM', 'Touch ID is supported');
        if (isBiometricEnabled == 'true') {
          !isONlyCheck && this.enableBiometrics();
          this.setState({ showImage: true, showTouch: true, showFace: false });
        }

      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        console.warn('MM', 'FaceID is supported');
        if (isBiometricEnabled == 'true') {
          !isONlyCheck && this.enableBiometrics();
          this.setState({ showImage: true, showTouch: true, showFace: false });
        }
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        console.warn('MM', 'Biometrics is supported');
        if (isBiometricEnabled == 'true') {
          !isONlyCheck && this.enableBiometrics();
          this.setState({ showImage: true, showTouch: true, showFace: false });
        }
      } else {
        global.showFingerPrint = false;
        console.warn('MM', 'Biometrics not supported');
        await Singleton.getInstance().newSaveData(Constants.ENABLE_PIN, 'false')
        this.setState({ showImage: false, showTouch: false, showFace: false });

      }
    });
  }
  enableBiometrics() {
    ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
      .then(resultObject => {
        const { success } = resultObject;
        if (success) {
          // //console.warn('MM','successful biometrics provided');
          global.pinShown = false;
          if (this.props?.refreshToken || this.props?.isFrom == 'splash') {
            this.token_api();
          } else if (this.props?.loginAgain) {
            this.refreshToken_expired_api();
          } else {
            this.signInContent();
          }
        } else {
          //console.warn('MM','user cancelled biometric prompt');
        }
      })
      .catch(() => {
        //console.warn('MM','biometrics failed');
      });
  }

  async token_api() {
    let refreshToken = await Singleton.getInstance().newGetData(
      Constants.refresh_token,
    );
    let token = await Singleton.getInstance().newGetData(
      Constants.access_token,
    );
    this.setState({ isLoading: true });
    APIClient.getInstance()
      .post(API_REFRESH_TOKEN, { refreshToken }, token)
      .then(async res => {
        if (res?.status) {
          this.setState({ isLoading: false });
          let instance = Singleton.getInstance();
          await instance.newSaveData(
            Constants.refresh_token,
            res?.refreshToken,
          );
          await instance.newSaveData(Constants.access_token, res?.access_token);

          let oldMultiWAllet = JSON.parse(
            await instance.newGetData(Constants.multi_wallet_array),
          );
          let activeWallet = JSON.parse(
            await instance.newGetData(Constants.ACTIVE_WALLET),
          );

          activeWallet.user_jwtToken = res?.access_token;
          activeWallet.refreshToken = res?.refreshToken;

          let login_data = JSON.parse(
            await instance.newGetData(Constants.login_data),
          );
          login_data.access_token = res?.access_token;
          activeWallet.login_data = login_data;

          let newMultiWallet = oldMultiWAllet?.map(item => {
            return item?.defaultWallet ? activeWallet : item;
          });
          await instance.newSaveData(
            Constants.login_data,
            JSON.stringify(login_data),
          );
          await instance.newSaveData(
            Constants.multi_wallet_array,
            JSON.stringify(newMultiWallet),
          );
          await instance.newSaveData(
            Constants.ACTIVE_WALLET,
            JSON.stringify(activeWallet),
          );
          this.signInContent();
        } else {
          if (res?.logout) {
            this.refreshToken_expired_api();
          }
        }
      })
      .catch(err => {
        if (err?.logout) {
          this.refreshToken_expired_api();
        } else {
          Singleton.showAlert(err?.message || 'Token Expired');
          this.setState({ isLoading: false });
        }
      });
  }

  async refreshToken_expired_api() {
    let instance = Singleton.getInstance();
    let activeWallet = JSON.parse(
      await instance.newGetData(Constants.ACTIVE_WALLET),
    );
    let loginRequest = activeWallet?.loginRequest;
    let existingWallets = JSON.parse(
      await instance.newGetData(Constants.multi_wallet_array),
    );
    let wallet_name = activeWallet.walletName;
    let device_token = loginRequest?.device_token;

    this.props
      .createWallet({
        address: loginRequest?.address,
        wallet_addresses: loginRequest?.wallet_addresses,
        wallet_name,
        device_token,
      })
      .then(async response => {
        this.setState({ isLoading: false });

        await instance.newSaveData(Constants.access_token, response.data.token);
        await instance.newSaveData(
          Constants.refresh_token,
          response.data?.refreshToken,
        );

        let newWalletData = activeWallet;
        newWalletData.refreshToken = response.data.refreshToken;
        newWalletData.user_jwtToken = response.data.token;
        await instance.newSaveData(
          Constants.ACTIVE_WALLET,
          JSON.stringify(newWalletData),
        );

        let newLoginData = JSON.parse(
          await instance.newGetData(Constants.login_data),
        );
        newLoginData.access_token = response.data.token;
        await instance.newSaveData(
          Constants.login_data,
          JSON.stringify(newLoginData),
        );

        let newWalletArray = existingWallets.map(item => {
          let element;
          if (item?.defaultWallet) {
            element = newWalletData;
          } else {
            element = item;
          }
          return element;
        });
        await instance.newSaveData(
          Constants.multi_wallet_array,
          JSON.stringify(newWalletArray),
        );
        this.signInContent();
      })
      .catch(err => {
        this.setState({ isLoading: false });
        Singleton.showAlert(err?.message || Constants.SOMETHING_WRONG);
      });
  }

  signInContent() {
    Singleton.getInstance()
      .newGetData(Constants.login_data)
      .then(res => {
        let response = JSON.parse(res);
        global.firstLogin = true;
        Singleton.getInstance().access_token = response.access_token;
        Singleton.getInstance().defaultEthAddress = response?.defaultEthAddress;
        Singleton.getInstance().defaultMaticAddress =
          response?.defaultMaticAddress;
        Singleton.getInstance().defaultBtcAddress = response?.defaultBtcAddress;
        Singleton.getInstance().defaultBnbAddress = response?.defaultBnbAddress;
        Singleton.getInstance().defaultTrxAddress = response?.defaultTrxAddress;
        Singleton.getInstance().defaultStcAddress = response?.defaultEthAddress;
        Singleton.getInstance().walletName = response.walletName;

        if (this.props?.redirectTo == 'RecoveryPhrase') {
          Actions.currentScene != 'RecoveryPhrase' &&
            Actions.RecoveryPhrase({
              screenType: this.props.screenType,
              walletItem: this.props.walletItem,
            });
          return;
        }
        if (this.props?.redirectTo == 'ExportPrivateKeys') {
          Actions.currentScene != 'ExportPrivateKeys' &&
            Actions.ExportPrivateKeys({
              screenType: this.props.screenType,
              walletItem: this.props.walletItem,
            });
          return;
        }
        if (this.props?.redirectTo == 'disablepin') {
          Singleton.getInstance().newSaveData(Constants.ENABLE_PIN, 'false');
          Actions.jump('Security');
          return;
        }
        if (this.props?.redirectTo == 'saitaPin') {
          this.props.getVerified(true);
          Actions.jump('SaitaCardsInfo');
          return;
        } else {
          if (this.props.isFrom == 'splash') {
            Actions.Main({ type: ActionConst.RESET });
            Actions.jump('Wallet');
            Singleton.getInstance()
              .newGetData(Constants.IS_PRIVATE_WALLET)
              .then(isPrivateWallet => {
                if (isPrivateWallet != 'btc' && isPrivateWallet != 'trx') {
                  console.log("global.isDeepLink:::::>>>>>111", global.isDeepLink, Actions.currentScene);
                  if (global.isDeepLink) {
                    console.log("global.isDeepLink:::::>>>>>", global.isDeepLink, Actions.currentScene);
                    if (Actions.currentScene !== 'ConnectWithDapp111') {
                      console.log("global.isDeepLink:::::>>5555555555>>>111", global.isDeepLink, Actions.currentScene);
                      Actions.ConnectWithDapp({ url: global.deepLinkUrl })
                    } else {
                      console.log("global.isDeepLink:::::>>666666666666>>>1111", global.isDeepLink, Actions.currentScene);
                      EventRegister.emit('wallet_connect_event', global.deepLinkUrl)
                    }
                  }
                  if (global.wcTxnPopup) {
                    Singleton.getInstance().walletConnectRef?.showWalletData(true);
                  }
                }
              });

          } else {
            ;
            if (global.isNotification) {
              Actions.currentScene != 'Notification' &&
                Actions.Notification({ from: 'Pin' });
              global.isNotification = false;
              return;
            }
            Actions.pop();
            if (Singleton.getInstance().isOtpModal) {
              EventRegister.emit('otpModal', true);
            } else if (Singleton.getInstance().istxnModal) {
              EventRegister.emit('txnModal', true);
            }
            Singleton.getInstance()
              .newGetData(Constants.IS_PRIVATE_WALLET)
              .then(isPrivateWallet => {
                if (isPrivateWallet != 'btc' && isPrivateWallet != 'trx') {
                  if (global.isDeepLink) {
                    console.log("global.isDeepLink:::::>>>>>", global.isDeepLink, Actions.currentScene);
                    if (Actions.currentScene !== 'ConnectWithDapp') {
                      console.log("global.isDeepLink:::::>>5555555555>>>", global.isDeepLink, Actions.currentScene);
                      Actions.ConnectWithDapp({ url: global.deepLinkUrl })
                    } else {
                      console.log("global.isDeepLink:::::>>666666666666>>>", global.isDeepLink, Actions.currentScene);
                      EventRegister.emit('wallet_connect_event', global.deepLinkUrl)
                    }
                  }
                  if (global.wcTxnPopup) {
                    //console.log('Called Pop callRequest');
                    Singleton.getInstance().walletConnectRef?.showWalletData(true);
                  }
                }
              });
          }
        }
      })
      .catch(error => {
        //console.warn('MM','>>>>', error);
      });
  }
  popp() {
    Actions.pop();
    Actions.currentScene != 'Account' && Actions.Account();
  }
  deletePin() {
    let pin = this.state.pin;
    if (pin.length > 0) {
      pin = pin.slice(0, -1);
      this.setState({ pin });
    }
  }
  goBack() {
    global.isOnPinScreen = false;
  }

  onProceed() {
    if (this.state.pin.length == 0) {
      Singleton.showAlert(Constants.ENTERPIN);
      return;
    } else if (
      this.state.pin.toString() === this.state.pinFromStorage.toString()
    ) {
      if (this.firstTime) {
        this.props?.redirectTo == 'RecoveryPhrase'
          ? Actions.RecoveryPhrase()
          : Actions.currentScene != 'Main' && Actions.Main();
      } else {
        if (this.props?.redirectTo == 'RecoveryPhrase') {
          Actions.currentScene != 'RecoveryPhrase' &&
            Actions.RecoveryPhrase({
              screenType: this.props.screenType,
              walletItem: this.props.walletItem,
            });
          return;
        }
        if (this.props?.redirectTo == 'ExportPrivateKeys') {
          Actions.currentScene != 'ExportPrivateKeys' &&
            Actions.ExportPrivateKeys({
              screenType: this.props.screenType,
              walletItem: this.props.walletItem,
            });
          return;
        }
        if (this.props?.refreshToken || this.props?.isFrom == 'splash') {
          this.token_api();
        } else if (this.props?.loginAgain) {
          this.refreshToken_expired_api();
        } else {
          this.signInContent();
        }
      }
    } else {
      Singleton.showAlert('Wrong Pin');
      this.setState({ pin: '' });
    }
  }

  checkPin(value) {
    if (value.length == 6) {
      setTimeout(() => {
        this.onProceed();
      }, 650);
    }
  }

  updatePin = item => {
    if (item == ' ' || this.state.pin.length == 6) {
      return;
    }
    if (this.state.pin.length != 6) {
      this.setState({ pin: this.state.pin + item });

      if (this.state.pin.length == 5) {
        this.checkPin(this.state.pin + item);
      }
    }
  };
  deletePin = () => {
    if (this.state.pin.length == 0) {
      return;
    }
    this.setState({ pin: this.state.pin.slice(0, this.state.pin.length - 1) });
  };

  render() {
    return (
      <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
        <MainStatusBar
          backgroundColor={ThemeManager.colors.bg}
          barStyle={
            ThemeManager.colors.themeColor === 'light'
              ? 'dark-content'
              : 'light-content'
          }
        />
        <View style={styles.mainView}>
          {(this.props?.redirectTo == 'RecoveryPhrase' ||
            this.props?.redirectTo == 'ExportPrivateKeys') && (
              <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} />
            )}
          <View style={{ marginHorizontal: widthDimen(22) }}>
            <Text
              style={[
                styles.labelCreatePin,
                { color: ThemeManager.colors.headingText },
              ]}>
              {LanguageManager.ConfirmPin}
            </Text>

            <Text
              style={[
                styles.msgPinStyle,
                { color: ThemeManager.colors.lightTextColor },
              ]}>
              {LanguageManager.reEnterSixDigitPin}
            </Text>

            <View style={[styles.viewPinContain]}>
              {[0, 1, 2, 3, 4, 5].map((item, index) => {
                return (
                  <PinInput
                    key={item}
                    isActive={
                      this.state.pin.length == 0
                        ? index == 0
                          ? true
                          : false
                        : this.state.pin.length == index + 1
                    }
                    digit={this.state.pin.length > index ? '*' : ''}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.marginBtn}>
            <KeyboardDigit
              updatePin={item => this.updatePin(item)}
              deletePin={() => this.deletePin()}
            />
          </View>
        </View>
        {this.state.isLoading && <Loader />}
      </Wrap>
    );
  }
}

const mapStateToProp = state => {
  return {
  };
};

export default connect(mapStateToProp, {
  getInfuraLink,
  getInfuraBNBLink,
  getRouterDetails,
  getDexUrls,
  createWallet,
})(ConfirmPin);

export const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  textInputView: { paddingTop: 40 },
  textInput: {
    alignSelf: 'flex-start',
    marginLeft: -10,
  },
  pinText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  viewPinContain: {
    marginTop: heightDimen(60),
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
  confiemPinView: {
    paddingTop: 60,
    paddingBottom: 65,
  },
  msgPinStyle: {
    fontFamily: fonts.regular,
    fontSize: areaDimen(14),
    textAlign: 'left',
    lineHeight: heightDimen(28),
  },

  cellStyle: {
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 10,
  },
  inputText: {
    fontSize: 20,
    color: '#fff',
  },

  cellFocus: { borderColor: '#fff' },

  createPinTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.regular,
  },
  text: {
    color: Colors.fadetext,
    alignSelf: 'center',
    fontFamily: fonts.regular,
  },
  btnView2: {
    marginTop: 30,
    alignSelf: 'center',
    height: 40,
    width: 50,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
  },
  backIconStyle: {
    tintColor: Colors.white,
    width: 20,
    height: 20,
  },

  backTouchable: {
    marginTop: 20,
    marginStart: 20,
    padding: 5,
    alignSelf: 'flex-start',
  },

  imgBackStyle: { width: 20, height: 20, tintColor: Colors.white },

  customBack: { tintColor: Colors.white },

  btnStyle: {
    width: '100%',
    height: 50,
    marginTop: 20,
    paddingHorizontal: 32,
    marginTop: 10,
  },

  customGrad: {
    borderRadius: 12,
  },

  labelCreatePin: {
    fontFamily: fonts.semibold,
    alignSelf: 'flex-start',
    fontSize: areaDimen(30),
    lineHeight: areaDimen(37),
    marginTop: heightDimen(30),
  },
  marginBtn: {
    justifyContent: 'flex-end',
    flex: 1,
    marginTop: heightDimen(150),
  },
});
