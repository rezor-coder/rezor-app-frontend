import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { Wrap } from '../../common/Wrap';
import { Actions } from 'react-native-router-flux';
import images from '../../../theme/Images';
import { styles } from './WalletSecurityConfirmStyle';
import ReactNativeBiometrics from 'react-native-biometrics';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import {
  SubHeader,
  SimpleHeader,
  BasicButton,
  MainStatusBar,
  PinInput,
  KeyboardDigit,
} from '../../common';
import colors from '../../../theme/Colors';
import fonts from '../../../theme/Fonts';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import * as constants from './../../../Constant';
import Singleton from '../../../Singleton';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';

const windowHeight = Dimensions.get('window').height;
const WalletSequrityConfirm = props => {
  let length = 0;
  const [bioType, setBioType] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [btnColor, setBtnColor] = useState('');
  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      setBtnColor(Singleton.getInstance().dynamicColor);
    });
  }, [props]);

  useEffect(() => {
    const backAction = () => {
      // //console.warn('MM','i WalletSequrityConfirm');
      Actions.pop();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    Singleton.getInstance()
      .newGetData(constants.PIN)
      .then(pin => {
        console.warn('MM', 'saved pin::::', pin);
        setPin(pin);
      });

    detectBiometricType();
  }, []);

  const onProceed = () => {
    if (pin.length == 0 || pin.length < 6) {
      Singleton.showAlert(constants.ENTERPIN);
      return;
    }
    // if (confirmPin.length == 0 || confirmPin.length < 6) {
    //   Singleton.showAlert(constants.CONFIRMPIN),;
    //   return;
    // }
    // if (pin != confirmPin) {
    //   Singleton.showAlert(constants.CHECKPIN);
    //   return;
    // }
    else if (pin != confirmPin) {

      Singleton.showAlert(LanguageManager.enterCorrectPin);
      setConfirmPin('')
      //   if (props.redirectTo) {
      //     Singleton.getInstance().saveData(constants.ENABLE_PIN, 'true');
      //     Singleton.getInstance().saveData(constants.PIN, pin);
      //     Actions.jump('Security');
      //   } else {
      //     Singleton.getInstance().saveData(constants.PIN, pin);
      //     Singleton.getInstance().saveData(constants.ENABLE_PIN, 'true');

      //     // Singleton.getInstance()
      //     // .getData(constants.PIN)
      //     // .then(pin => {
      //     //   //console.warn('MM','get pin::::', pin);
      //     //   this.pinCode = pin;
      //     //   // this.setState({pinFromStorage: pin});
      //     //   // global.isOnPinScreen = true;
      //     // });
      //     Actions.currentScene != 'ConfirmPin' && Actions.ConfirmPin();
      //   }
    } else {
      Singleton.getInstance().newSaveData(constants.PIN, pin);
      Singleton.getInstance().newSaveData(constants.ENABLE_PIN, 'true');

      Actions.currentScene != 'CreateOrImportWallet' &&
        Actions.replace('CreateOrImportWallet');
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
  const updatePin = (item) => {
    if (item == " " || confirmPin.length == 6) {
      return;
    }
    if (confirmPin.length != 6) {
      setConfirmPin((prev) => {
        return prev + item;
      });
      // if (confirmPin.length == 3) {
      //   submit(confirmPin + item);
      // }
    }
  };
  const deletePin = () => {
    if (confirmPin.length == 0) {
      return;
    }
    setConfirmPin((prev) => prev.slice(0, prev.length - 1));
  };

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
        {/* <ImageBackgroundComponent style={{ height: windowHeight, flex: 1 }}> */}
        <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} />
        <ScrollView
          keyboardShouldPersistTaps="always"
          bounces={false}
          style={{ flex: 1 }}>
          <View style={{ marginHorizontal: widthDimen(20) }}>

            <Text
              style={[
                styles.labelCreatePin,
                { color: ThemeManager.colors.headingText },
              ]}>
              {LanguageManager.ConfirmPin}
            </Text>

            <Text style={[styles.sixDigitPinStyle, { color: ThemeManager.colors.lightTextColor }]}>
              {LanguageManager.reEnterSixDigitPin}
            </Text>

            <View style={styles.viewPinContain}>
              {/* <SmoothPinCodeInput
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
                value={confirmPin}
                onTextChange={text => {
                  if (constants.NUMBER_ONLY_REGEX.test(text)) {
                    length = text.length;
                    setConfirmPin(text);
                  }
                }}
              /> */}
              {[0, 1, 2, 3, 4, 5].map((item, index) => {
                return (
                  <PinInput
                    key={item}
                    isActive={confirmPin.length == 0 ? index == 0 ? true : false : confirmPin.length == index + 1}
                    digit={confirmPin.length > index ? "*" : ""}
                  />
                );
              })}
            </View>
          </View>
          <View
            style={[styles.marginBtn,
            {
              // justifyContent: 'flex-end',
              // flex: 1,
              // ...ifIphoneX(
              //   {
              //     marginTop: -100,
              //   },
              //   {
              //     marginBottom: 40,
              //   },
              // ),
            },
            ]}>
            <KeyboardDigit
              updatePin={(item) => updatePin(item)}
              deletePin={() => deletePin()}
            />
            <BasicButton
              onPress={() => {
                onProceed();
              }}
              // colors={btnColor}
              btnStyle={styles.btnStyle}
              customGradient={styles.customGrad}
              text={LanguageManager.proceed}
            />
          </View>
        </ScrollView>
        {/* </ImageBackgroundComponent> */}
      </View>
      <View>
        {/* <TouchableOpacity onPress={() => Actions.pop()} style={styles.btnView2}>
          <Text style={{color: colors.white}}>{LanguageManager.Back}</Text>
        </TouchableOpacity> */}
      </View>
    </Wrap>
  );
};

export default WalletSequrityConfirm;
