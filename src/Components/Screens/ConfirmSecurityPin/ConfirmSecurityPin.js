/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  ScrollView,
  Text,
  View
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import {
  BasicButton,
  BorderLine,
  KeyboardDigit,
  MainStatusBar,
  PinInput,
  SimpleHeader
} from '../../common';
import { Wrap } from '../../common/Wrap';
import * as constants from './../../../Constant';
import { styles } from './ConfirmSecurityPinStyle';
import { goBack, navigate } from '../../../navigationsService';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';

const windowHeight = Dimensions.get('window').height;
const ConfirmSecurityPin = props => {
  let length = 0;
  const [bioType, setBioType] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setconfirmPin] = useState('');
  const [btnColor, setBtnColor] = useState('');
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setBtnColor(Singleton.getInstance().dynamicColor);
    });
    //console.warn('MM','props=-=-=-=-=-=-=>>>>', props);
  }, [props]);
  useEffect(() => {
    const backAction = () => {
      // //console.warn('MM','i WalletSequrityConfirm');
      goBack();
      // Actions.jump('Security');//Go to security screen
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    // Singleton.getInstance()
    //   .getData(constants.PIN)
    //   .then(pin => {
    // //console.warn('MM','saved pin::::', pin);
    setPin(props?.route?.params.pinFrom);
    //   });

    detectBiometricType();
  }, []);
  const updatePin = (item) => {
    if (item == " " || confirmPin.length == 6) {
      return;
    }
    if (confirmPin.length != 6) {
      setconfirmPin((prev) => {
        return prev + item;
      });
      // if (pin.length == 3) {
      //   submit(pin + item);
      // }
    }
  };
  const deletePin = () => {
    if (confirmPin.length == 0) {
      return;
    }
    setconfirmPin((prev) => prev.slice(0, prev.length - 1));
  };

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
      setconfirmPin('');
      Singleton.showAlert(LanguageManager.enterCorrectPin);
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
      //   }
    } else {
      Singleton.getInstance().newSaveData(constants.PIN, pin);
      // Singleton.getInstance().newSaveData(constants.ENABLE_PIN, 'true');
      navigate(NavigationStrings.Security);
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
      {/* <View style={styles.mainView}> */}
        {/* <ImageBackgroundComponent style={{ height: windowHeight, flex: 1 }}> */}
        <SimpleHeader
          title={LanguageManager.ConfirmPin}
          backImage={ThemeManager.ImageIcons.iconBack}
          titleStyle={{textTransform:'none'}}
          imageShow
          back={false}
          backPressed={() => {
            // props.navigation.state.params.onGoBack();
            props.navigation.goBack();
          }}
        />
         <BorderLine
        borderColor={{ backgroundColor: ThemeManager.colors.viewBorderColor }}
      />
        <ScrollView
          keyboardShouldPersistTaps="always"
          bounces={false}
          style={{ flex: 1 ,}}>
          <View >

            <Text style={[styles.sixDigitPinStyle, { color: ThemeManager.colors.lightTextColor }]}>
              {LanguageManager.reEnterSixDigitPin}
            </Text>

            <View style={styles.viewPinContain}>
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
          style={[
            styles.marginBtn,
            {
              justifyContent: 'flex-end',
              flex: 1,
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
      {/* </View> */}
      <View>
        {/* <TouchableOpacity onPress={() => goBack()} style={styles.btnView2}>
          <Text style={{color: colors.white}}>{LanguageManager.Back}</Text>
        </TouchableOpacity> */}
      </View>
    </Wrap>
  );
};

export default ConfirmSecurityPin;
