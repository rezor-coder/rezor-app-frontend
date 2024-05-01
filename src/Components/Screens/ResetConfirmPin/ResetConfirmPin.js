/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, BackHandler, Alert } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Actions, ActionConst } from 'react-native-router-flux';
import { BasicButton, BorderLine, KeyboardDigit, PinInput, Wrap } from '../../common';
import { Colors } from '../../../theme';
import fonts from '../../../theme/Fonts';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constant';
import { SubHeader, ButtonPrimary } from '../../common';
import ReactNativeBiometrics from 'react-native-biometrics';
import { SimpleHeader } from '../../common';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
class ResetConfirmPin extends Component {
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
  // backAction = () => {
  //   console.log('ffffff');
  //   Alert.alert('Hold on!', 'Are you sure you want to go back?', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => null,
  //       style: 'cancel',
  //     },
  //     { text: 'YES', onPress: () => BackHandler.exitApp() },
  //   ]);
  //   return true;
  // };

  componentDidMount() {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.backAction,
    // );
    if (this.firstTime == false) {
      // this.props.navigation.addListener('didFocus', this.screenFocus);
      // this.props.navigation.addListener('didBlur', this.screenBlur);
      Singleton.getInstance()
        .newGetData(Constants.PIN)
        .then(pin => {
          this.pinCode = pin;
          this.setState({ pinFromStorage: pin });
          global.isOnPinScreen = true;
        });

      // Singleton.getInstance()
      // .newGetData(Constants.ENABLE_PIN)
      // .then(enablePin => {
      //   // alert(enablePin);
      //   //console.warn('MM','chk enablePin app lock::::security', enablePin);
      //   if(enablePin == 'true')
      //   this.checkBiometricAvailability();  
      // })

      // this.checkBiometricAvailability();
    }
    Singleton.getInstance()
      .newGetData(Constants.CURRENCY_SELECTED)
      .then(CurrencySelected => {
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
  componentWillUnmount() {
    // this.backHandler.remove();
  }
  screenBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };
  screenFocus = () => {
    console.log('focus');
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  };
  // backAction = () => {
  //   //console.warn('MM','i confirmPin');
  //   return true;
  // };
  checkBiometricAvailability() {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject;
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        //console.warn('MM','TouchID is supported');
        // this.enableBiometrics();
        this.setState({ showImage: true, showTouch: true, showFace: false });
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        //console.warn('MM','FaceID is supported');
        // this.enableBiometrics();
        this.setState({ showImage: true, showTouch: false, showFace: true });
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        //console.warn('MM','Biometrics is supported');
        // this.enableBiometrics();
        this.setState({ showImage: true, showTouch: true, showFace: false });
      } else {
        global.showFingerPrint = false;
        //console.warn('MM','Biometrics not supported');
        this.setState({ showImage: false, showTouch: false, showFace: false });
      }
    });
  }
  // enableBiometrics() {
  //   ReactNativeBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
  //     .then(resultObject => {
  //       const {success} = resultObject;
  //       if (success) {
  //         //console.warn('MM','successful biometrics provided');
  //         global.pinShown = false;
  //         this.signInContent();
  //       } else {
  //         //console.warn('MM','user cancelled biometric prompt');
  //       }
  //     })
  //     .catch(() => {
  //       //console.warn('MM','biometrics failed');
  //     });
  // }
  // async updatePin(text) {
  //   if (this.state.pin.length == 6) {
  //     return;
  //   }
  //   let pin = this.state.pin + text;
  //   await this.setState({pin});
  //   if (pin.length == 6) {
  //     if (pin == this.pinCode) {
  //       this.pinIsConfirmed();
  //     } else {
  //       //alert("wrong pin")
  //       this.refs.toast.show('Wrong PIN');
  //       this.setState({pin: ''});
  //     }
  //   }
  // }
  // pinIsConfirmed = () => {
  //   if (this.firstTime) {
  //     Singleton.getInstance().saveData(Constants.PIN, this.state.pin);
  //     Singleton.getInstance().saveData(Constants.ENABLE_PIN, 'true');
  //     Actions.currentScene != 'Wallet' && Actions.Wallet();
  //   } else {
  //     this.signInContent();
  //   }
  // };
  signInContent() {
    Singleton.getInstance()
      .newGetData(Constants.login_data)
      .then(res => {
        let response = JSON.parse(res);
        //console.warn('MM',response.access_token);
        //console.warn('MM','***pin content screen**** ', response);
        Singleton.getInstance()
          .newGetData(Constants.multi_wallet_array)
          .then(res => {
            Singleton.getInstance()
              .newGetData(Constants.addresKeyList)
              .then(res => {
                Singleton.getInstance()
                  .newGetData(Constants.coinFamilyKeys)
                  .then(res => {
                    global.firstLogin = true;
                    Singleton.getInstance().access_token =
                      response.access_token;
                    Singleton.getInstance().saveData(
                      Constants.access_token,
                      response.access_token,
                    );
                    Singleton.getInstance().defaultEthAddress =
                      response.defaultEthAddress;
                    Singleton.getInstance().defaultBnbAddress =
                      response.defaultBnbAddress;
                      Singleton.getInstance().defaultStcAddress =
                      response.defaultEthAddress;
                    Singleton.getInstance().walletName = response.walletName;
                    Actions.pop();
                    return;
                  })
                  .catch(error => { });
              })
              .catch(error => { });
          })
          .catch(error => { });
      })
      .catch(error => { });
  }
  popp() {
    Actions.pop();
    Actions.currentScene != 'Account' && Actions.Account();
  }
  // deletePin() {
  //   let pin = this.state.pin;
  //   if (pin.length > 0) {
  //     pin = pin.slice(0, -1);
  //     this.setState({ pin });
  //   }
  // }

  updatePin = (item) => {
    if (item == " " || this.state.pin.length == 6) {
      return;
    }
    if (this.state.pin.length != 6) {
      this.setState({ pin: this.state.pin + item })

      // if (this.state.pin.length == 5) {
      //   console.log("PINNNNN===", this.state.pin + item)
      //   this.checkPin(this.state.pin + item);
      // }
    }
  };
  deletePin = () => {
    if (this.state.pin.length == 0) {
      return;
    }
    this.setState({ pin: this.state.pin.slice(0, this.state.pin.length - 1) })
  };

  goBack() {
    global.isOnPinScreen = false;
  }
  onProceed = () => {
    if (this.state.pin.length == 0) {
      Singleton.showAlert(Constants.ENTERPIN);
      return;
    } else if (
      this.state.pin.toString() === this.state.pinFromStorage.toString()
    ) {
      Actions.currentScene != 'ResetCreatePIN' &&
        Actions.ResetCreatePIN({ pinFrom: this.state.pin });
      this.setState({ pin: '' });
    } else {
      Singleton.showAlert('Wrong Pin');
      this.setState({ pin: '' });
    }
  };
  render() {
    return (
      <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
        
        <SimpleHeader
          title={LanguageManager.resetAPin}
          // rightImage={[styles.rightImgStyle]}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle ={{textTransform:'none'}}
          imageShow
          back={false}
          backPressed={() => {
            // props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();
          }}
        />

        <BorderLine
          borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
        />

        <View style={styles.mainView}>
          <View style={styles.textInputView}>
            <View style={styles.textInput}>
              <Text
                style={[
                  styles.pinText,
                  { color: ThemeManager.colors.lightTextColor },
                ]}>
                {LanguageManager.enterPinAccessWallet}
              </Text>
            </View>
            <View style={[styles.inputView]}>
              {/* <SmoothPinCodeInput
                autoFocus={true}
                password
                mask="﹡"
                cellSize={42}
                codeLength={6}
                cellStyleFocused={{ borderColor: ThemeManager.colors.textColor }}
                cellStyle={[
                  styles.cellStyle,
                  { borderColor: ThemeManager.colors.inputBoxColor },
                ]}
                textStyle={[
                  styles.inputText,
                  { color: ThemeManager.colors.textColor },
                ]}
                value={this.state.pin}
                onTextChange={text => this.setState({ pin: text })}
              /> */}
              {[0, 1, 2, 3, 4, 5].map((item, index) => {
                return (
                  <PinInput
                    key={item}
                    isActive={this.state.pin.length == 0 ? index == 0 ? true : false : this.state.pin.length == index + 1}
                    digit={this.state.pin.length > index ? "*" : ""}
                  />
                );
              })}
            </View>
          </View>
          <View style={{ position: 'absolute', bottom: heightDimen(20), width: '100%' }}>
            <KeyboardDigit
              updatePin={(item) => this.updatePin(item)}
              deletePin={() => this.deletePin()}
            />

            <BasicButton
              onPress={() => {
                this.onProceed();
              }}
              // colors={btnColor}
              btnStyle={styles.btnStyle}
              customGradient={styles.customGrad}
              text="Proceed"
            />
          </View>
          {/* <View style={{ marginTop: 50, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ paddingVertical: 20 }}>
              <Text style={styles.createPinTxt}>{LanguageManager.ConfirmPin}</Text>
            </View>
            <View>
              <Text style={styles.text}>
                {LanguageManager.pinIsRequired}{' '}
              </Text>
              <Text style={styles.text}>{LanguageManager.toAccessTheWallet}</Text>
            </View>
          </View> */}
        </View>
      </Wrap>
    );
  }
}
export default ResetConfirmPin;
export const styles = StyleSheet.create({
  mainView: {
    // backgroundColor: Colors.Darkbg,
    flex: 1,
    alignItems: 'center',
  },
  textInputView: { paddingTop: heightDimen(160) },
  textInput: {
    marginHorizontal: widthDimen(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinText: {
    color: ThemeManager.colors.lightTextColor,
    fontSize: areaDimen(14),
    fontFamily: fonts.regular,
  },
  inputView: { paddingTop: heightDimen(30), flexDirection: 'row', alignItems: 'center' },
  confiemPinView: {
    paddingTop: 60,
    paddingBottom: 65,
  },
  btnStyle: {
    marginTop: heightDimen(32),
    height: heightDimen(60),
    width: '90%',
    alignSelf: 'center',
  },
  cellStyle: {
    borderWidth: 1,
    borderRadius: 12,
    // width: 48,
    // height: 55,
    borderColor: Colors.languageItem,
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
  customGrad: {
    borderRadius: heightDimen(30),
  },
  // btnStyle: {
  //   width: '100%',
  //   height: 50,
  //   marginTop: 35,
  //   paddingHorizontal: 32,
  //   marginBottom: 50,
  // },
  rightImgStyle: { tintColor: Colors.White },
});
