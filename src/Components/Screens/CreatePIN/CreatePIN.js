/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  ScrollView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import colors from '../../../theme/Colors';
import {
  BasicButton,
  ImageBackgroundComponent,
  MainStatusBar,
  SubHeader,
} from '../../common';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { Wrap } from '../../common/Wrap';
import { ButtonPrimary } from '../../common/ButtonPrimary';
import { styles } from './CreatePINStyle';
import Singleton from '../../../Singleton';
import * as constants from './../../../Constant';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import { getInfuraLink, getInfuraBNBLink, getRouterDetails } from '../../../Redux/Actions';
import { connect, useDispatch, useSelector } from 'react-redux';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import ReactNativeBiometrics from 'react-native-biometrics';

const windowHeight = Dimensions.get('window').height;
let length = 0;
const CreatePIN = props => {
  const [pin, setPin] = useState('');
  const dispatch = useDispatch();
  const [confirmPin, setconfirmPin] = useState('');
  const [bioType, setBioType] = useState('');

  useEffect(() => {
    getInfuraMainLink();
    const backAction = () => {
      //console.warn('MM','i CreatePIN');
      Actions.pop();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const getInfuraMainLink = () => {
    dispatch(getInfuraLink())
      .then(response => {
        // //console.warn('MM','response==getInfuraMainLink==== create', response);
        constants.mainnetInfuraLink = response.link;
        Singleton.getInstance().ethLink = response.link
        getBNBLink()
      })
      .catch(error => {
        //console.warn('MM','error==getInfuraMainLink=== create', error);
      });
  };
  const getBNBLink = () => {
    dispatch(getInfuraBNBLink())
      .then(response => {
        //console.warn('MM',' res getInfuraBNB Link===', response);
        // //console.warn('MM','response==getInfuraMainLink====', response);
        constants.mainnetInfuraLinkBNB = response.link;
        Singleton.getInstance().bnbLink = response.link;
        getNodeDetails()
      })
      .catch(error => {
        //console.warn('MM','error==getInfuraMainLink===', error);
      });
  }
  const getNodeDetails = () => {
    dispatch(getRouterDetails())
      .then(response => {
        let instance = Singleton.getInstance()
        instance.SwapRouterAddress = response.data.Router;
        instance.SwapFactoryAddress = response.data.Factory;
        instance.StakeSaitamaAddress = response.data.SaitamaAddress;
        instance.StakingContractAddress = response.data.StakingContractAddress;
        instance.SwapWethAddress = response.data.WethAddress;
        instance.SwapRouterBNBAddress = response.data.BnbRouter;
        instance.SwapRouterStcAddress = response.data.StcRouter;
        instance.SwapWBNBAddress = response.data.WbnbAddress;
        instance.SwapWethAddressSTC = response.data.StcWeth;
        instance.SwapFactoryAddressSTC=response.data.StcFactory;
        instance.SwapFactoryAddressBNB=response.data.BnbFactory;
      })
      .catch(error => {
        //console.warn('MM','error==getInfuraMainLink===', error);
      });
  }
  useEffect(() => {
    detectBiometricType();
  }, []);
  // const onProceed = () => {
  //   if (pin.length == 0 || pin.length < 6) {
  //     Singleton.showAlert(constants.ENTERPIN);
  //     return;
  //   }
  //   // if (confirmPin.length == 0 || confirmPin.length < 6) {
  //   //   Singleton.showAlert(constants.CONFIRMPIN);
  //   //   return;
  //   // }
  //   // if (pin != confirmPin) {
  //   //   Singleton.showAlert(constants.CHECKPIN);
  //   //   return;
  //   // }
  //   else {
  //     // if (props.redirectTo) {
  //     //   Singleton.getInstance().saveData(constants.ENABLE_PIN, 'true');
  //     //   Singleton.getInstance().saveData(constants.PIN, pin);
  //     //   Actions.jump('Security');
  //     // } else {
  //     //   Singleton.getInstance().saveData(constants.PIN, pin);
  //     //   Singleton.getInstance().saveData(constants.ENABLE_PIN, 'true');
  //     //   // Singleton.getInstance()
  //     //   // .getData(constants.PIN)p
  //     //   // .then(pin => {
  //     //   //   //console.warn('MM','get pin::::', pin);
  //     //   //   this.pinCode = pin;
  //     //   //   // this.setState({pinFromStorage: pin});
  //     //   //   // global.isOnPinScreen = true;
  //     //   // });
  //     //   Actions.currentScene != 'WalletSequrityConfirm' &&
  //     //     Actions.replace('WalletSequrityConfirm');
  //     // }
  //   }
  // };
  const onProceed = () => {
    if (pin.length == 0 || pin.length < 6) {
      Singleton.showAlert(constants.ENTERPIN);
      return;
    }
    // if (confirmPin.length == 0 || confirmPin.length < 6) {
    //   Singleton.showAlert(constants.CONFIRMPIN);
    //   return;
    // }
    // if (pin != confirmPin) {
    //   Singleton.showAlert(constants.CHECKPIN);
    //   return;
    // }
    else {
      // if (props.redirectTo) {
      //   Singleton.getInstance().saveData(constants.ENABLE_PIN, 'true');
      //   Singleton.getInstance().saveData(constants.PIN, pin);
      //   Actions.jump('Security');
      // } else {
      // Singleton.getInstance().saveData(constants.PIN, pin);
      // Singleton.getInstance().saveData(constants.ENABLE_PIN, 'true');sss

      // Singleton.getInstance()
      // .getData(constants.PIN)
      // .then(pin => {
      //   //console.warn('MM','get pin::::', pin);
      //   this.pinCode = pin;
      //   // this.setState({pinFromStorage: pin});
      //   // global.isOnPinScreen = true;
      // });
      Actions.currentScene != 'ConfirmSecurityPin' &&
        Actions.replace('ConfirmSecurityPin', { pinFrom: pin });
      // }
    }
  };
  const detectBiometricType = async () => {
    const { biometryType, available } =
      await ReactNativeBiometrics.isSensorAvailable();
    //console.warn('MM','-=-=-=-=-=-=>', biometryType);
    //console.warn('MM','++++', available);
    if (available && biometryType === ReactNativeBiometrics.TouchID) {
      setBioType(LanguageManager.Touchid);
    } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
      setBioType(LanguageManager.Faceid);
    } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
      setBioType(LanguageManager.Biometrics);
    } else {
      //console.warn('MM','Biometrics not supported');
    }
  };
  // const onProceed = () => {
  //   if (pin.length == 0 || pin.length < 6) {
  //     Singleton.showAlert(constants.ENTERPIN);
  //     return;
  //   }
  //   if (confirmPin.length == 0 || confirmPin.length < 6) {
  //     Singleton.showAlert(constants.CONFIRMPIN);
  //     return;
  //   }
  //   if (pin != confirmPin) {
  //     Singleton.showAlert(constants.CHECKPIN);
  //     return;
  //   } else {
  //     if (props.redirectTo) {
  //       Singleton.getInstance().saveData(constants.ENABLE_PIN, 'true');
  //       Singleton.getInstance().saveData(constants.PIN, pin);
  //       Actions.currentScene != 'Security' && Actions.jump('Security');
  //     } else {
  //       Singleton.getInstance().saveData(constants.PIN, pin);
  //       Singleton.getInstance().saveData(constants.ENABLE_PIN, 'true');
  //       Actions.currentScene != 'CreateWallet' && Actions.CreateWallet();
  //     }
  //   }
  // };
  // //console.warn('MM','IOS---', Dimensions.get('screen').height);

  const Digit = useCallback(({ digit, onPress }) => {
    return (
      <>
        {digit == " " ? (
          <View style={[styles.digit, styles.rightLine]}>
            <Text
              style={{
                fontSize: 23,
                fontFamily: fonts.bold,
                color: ThemeManager.colors.textColor,
              }}
            >
              {digit}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={
              digit == "1" || digit == "2"
                ? [styles.digit, styles.topRightLine]
                : digit == "3"
                  ? [styles.digit, styles.topLine]
                  : digit == "4" ||
                    digit == "5" ||
                    digit == "7" ||
                    digit == "8" ||
                    digit == " " ||
                    digit == "0"
                    ? [styles.digit, styles.rightLine]
                    : [styles.digit]
            }
          >
            <Text
              style={{
                fontSize: 23,
                fontFamily: fonts.bold,
                color: ThemeManager.colors.textColor,
              }}
            >
              {digit}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  }, []);

  const DigitImage = useCallback(({ onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.digitImage}>
        <Image
          source={ThemeManager.ImageIcons.delImage}
          style={{
            height: 20,
            width: 20,
            tintColor: ThemeManager.colors.textColor,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }, []);
  const updatePin = (item) => {
    if (item == " " || pin.length == 4) {
      return;
    }

    if (pin.length != 4) {
      setPin((prev) => {
        return prev + item;
      });
      // if (pin.length == 3) {
      //   submit(pin + item);
      // }
    }
  };
  const deletePin = () => {
    if (pin.length == 0) {
      return;
    }

    setPin((prev) => prev.slice(0, prev.length - 1));
  };

  return (
    <Wrap style={{ backgroundColor: ThemeManager.colors.bg }}>
      <MainStatusBar
        backgroundColor={ThemeManager.colors.backgroundColor}
        barStyle={
          ThemeManager.colors.themeColor === 'light'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <ImageBackgroundComponent style={{ height: windowHeight, flex: 1 }}>
        <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} />
        <ScrollView
          keyboardShouldPersistTaps="always"
          bounces={false}
          style={{ flex: 1 }}>
          <View style={{ height: windowHeight - 200 }}>
            <Text
              style={[
                styles.labelCreatePin,
                { color: ThemeManager.colors.textColor },
              ]}>
              {LanguageManager.CreatePin}
            </Text>

            <Text style={styles.sixDigitPinStyle}>
              {LanguageManager.enterSixDigitPin}
            </Text>

            <View style={styles.viewPinContain}>
              <SmoothPinCodeInput
                autoFocus={true}
                password
                mask="﹡"
                cellSize={42}
                codeLength={6}
                cellStyleFocused={{
                  borderColor: ThemeManager.colors.textColor,
                }}
                cellStyle={[
                  styles.cellStyle,
                  { borderColor: ThemeManager.colors.inputBoxColor },
                ]}
                textStyle={[
                  styles.inputText,
                  { color: ThemeManager.colors.textColor },
                ]}
                value={pin}
                onTextChange={text => {
                  if (constants.NUMBER_ONLY_REGEX.test(text)) {
                    length = text.length;
                    setPin(text);
                  }
                }}
              />
            </View>
          </View>

          <View
            style={[
              styles.marginBtn,
              {
                justifyContent: 'flex-end',
                flex: 1,
                ...ifIphoneX(
                  {
                    marginTop: -100,
                  },
                  {
                    marginBottom: 40,
                  },
                ),
              },
            ]}>

            <View
              style={{
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "0"].map(
                (item, index) => {
                  return (
                    <Digit
                      key={index}
                      digit={item}
                      onPress={() => updatePin(item)}
                    />
                  );
                }
              )}

              <DigitImage onPress={() => deletePin()} />
            </View>
            <BasicButton
              onPress={() => {
                onProceed();
              }}
              btnStyle={styles.btnStyle}
              customGradient={styles.customGrad}
              text={LanguageManager.proceed}
            />
          </View>

          {/* <View style={styles.mainView}>
            <Text
              style={[
                styles.labelCreatePin,
                {color: ThemeManager.colors.textColor},
              ]}>
              {LanguageManager.CreatePin}
            </Text>
            <View style={styles.textInputView}>
              <View style={styles.textInput}>
                <Text style={styles.pinText}>{LanguageManager.EnterPin}</Text>
              </View>
              <View style={[styles.inputView]}>
                <SmoothPinCodeInput
                  autoFocus={true}
                  password
                  mask="﹡"
                  cellSize={42}
                  codeLength={6}
                  cellStyleFocused={{
                    borderColor: ThemeManager.colors.textColor,
                  }}
                  cellStyle={[
                    styles.cellStyle,
                    {borderColor: ThemeManager.colors.inputBoxColor},
                  ]}
                  textStyle={[
                    styles.inputText,
                    {color: ThemeManager.colors.textColor},
                  ]}
                  value={pin}
                  onTextChange={text => {
                    length = text.length;
                    setPin(text);
                  }}
                />
              </View>
            </View>
            <View style={styles.confiemPinView}>
              <View style={styles.textInput}>
                <Text style={styles.pinText}>{LanguageManager.ConfirmPin}</Text>
              </View>
              <View style={styles.inputView}>
                <SmoothPinCodeInput
                  password
                  mask="﹡"
                  cellSize={42}
                  codeLength={6}
                  cellStyleFocused={{
                    borderColor: ThemeManager.colors.textColor,
                  }}
                  cellStyle={[
                    styles.cellStyle,
                    {borderColor: ThemeManager.colors.inputBoxColor},
                  ]}
                  textStyle={[
                    styles.inputText,
                    {color: ThemeManager.colors.textColor},
                  ]}
                  value={confirmPin}
                  onTextChange={text => setconfirmPin(text)}
                />
              </View>
            </View>
            <ButtonPrimary
              btnstyle={styles.btnStyle}
              onpress={() => onProceed()}
              colors={Singleton.getInstance().dynamicColor}
              text={LanguageManager.proceed}
            />

            <View style={styles.pinRequiredTextWrap}>
              <Text style={styles.text}>{LanguageManager.PinReq}</Text>
            </View>
            <TouchableOpacity
              onPress={() => Actions.pop()}
              style={styles.btnView2}>
              <Text style={{color: colors.white}}>{LanguageManager.Back}</Text>
            </TouchableOpacity>
          </View>
        */}
        </ScrollView>
      </ImageBackgroundComponent>
    </Wrap>
  );
};

export default CreatePIN;
