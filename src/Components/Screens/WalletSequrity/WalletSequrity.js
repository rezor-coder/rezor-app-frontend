import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Dimensions, ScrollView, Text, View } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import {
  BasicButton,
  KeyboardDigit,
  MainStatusBar,
  PinInput
} from '../../common';
import { Wrap } from '../../common/Wrap';
import { styles } from './WalletSequrityStyle';

import { useDispatch } from 'react-redux';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import { getInfuraBNBLink, getInfuraLink, getRouterDetails } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { widthDimen } from '../../../Utils/themeUtils';
import { getCurrentRouteName, goBack, navigate } from '../../../navigationsService';
import HeaderwithBackIcon from '../../common/HeaderWithBackIcon';
import * as constants from './../../../Constant';

const windowHeight = Dimensions.get('window').height;
const WalletSequrity = props => {
  let length = 0;
  const [bioType, setBioType] = useState('');
  const [pin, setPin] = useState('');
  const [btnColor, setBtnColor] = useState('');
  const dispatch = useDispatch();
  const otpInput = useRef(null);

  const clearText = () => {
    otpInput.current.clear();
  };

  const setText = () => {
    otpInput.current.setValue('1234');
  };

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setBtnColor(Singleton.getInstance().dynamicColor);
    });
  }, []);
  useEffect(() => {
    getInfuraMainLink();
    getNodeDetails()
    getBNBLink()
    const backAction = () => {
      //console.warn('MM','i WalletSequrity');
      goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    detectBiometricType();
  }, []);


  const getInfuraMainLink = () => {
    dispatch(getInfuraLink())
      .then(response => {
        // console.warn('MM','response==getInfuraMainLink==== create', response);
        constants.mainnetInfuraLink = response.link;
        Singleton.getInstance().ethLink = response.link;
      })
      .catch(error => {
        // console.warn('MM','error==getInfuraMainLink=== create', error);
      });
  };
  const getBNBLink = () => {
    dispatch(getInfuraBNBLink())
      .then(response => {
        // console.warn('MM',' res getInfuraBNB Link===', response);
        // //console.warn('MM','response==getInfuraMainLink====', response);
        constants.mainnetInfuraLinkBNB = response.link;
        Singleton.getInstance().bnbLink = response.link;

      })
      .catch(error => {
        // console.warn('MM','error==getInfuraMainLink===', error);
      });
  }
  const getNodeDetails = () => {
    dispatch(getRouterDetails())
      .then(response => {
        // console.warn('MM',' res node data===', response);
        // constants.SwapRouterAddress = response.data.Router;
        // constants.SwapFactoryAddress = response.data.Factory;
        // constants.StakeSaitamaAddress = response.data.SaitamaAddress;
        // constants.StakingContractAddress = response.data.StakingContractAddress;
        // constants.SwapWethAddress = response.data.WethAddress;
        // constants.SwapRouterBNBAddress = response.data.BnbRouter;

        let instance = Singleton.getInstance()
        instance.SwapRouterAddress = response.data.Router;
        instance.SwapFactoryAddress = response.data.Factory;
        instance.StakeSaitamaAddress = response.data.SaitamaAddress;
        instance.StakingContractAddress = response.data.StakingContractAddress;
        instance.SwapWethAddress = response.data.WethAddress;
        instance.SwapRouterBNBAddress = response.data.BnbRouter;
        instance.SwapWBNBAddress = response.data.WbnbAddress;
        instance.SwapWethAddressSTC = response.data.StcWeth;
        instance.SwapFactoryAddressSTC=response.data.StcFactory;
        instance.SwapFactoryAddressBNB=response.data.BnbFactory;
        // instance.SwapRouterStcAddress = response.data.StcWethAddress;


      })
      .catch(error => {
        //console.warn('MM','error==getInfuraMainLink===', error);
      });
  }

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
      if (props.redirectTo) {
        Singleton.getInstance().newSaveData(constants.ENABLE_PIN, 'true');
        Singleton.getInstance().newSaveData(constants.PIN, pin);
        navigate(NavigationStrings.Security);
      } else {
        Singleton.getInstance().newSaveData(constants.PIN, pin);
        Singleton.getInstance().newSaveData(constants.ENABLE_PIN, 'true');

        // Singleton.getInstance()
        // .getData(constants.PIN)
        // .then(pin => {
        //   //console.warn('MM','get pin::::', pin);
        //   this.pinCode = pin;
        //   // this.setState({pinFromStorage: pin});
        //   // global.isOnPinScreen = true;
        // });
        getCurrentRouteName() != 'WalletSequrityConfirm' &&
        navigate(NavigationStrings.WalletSequrityConfirm);
      }
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
    if (item == " " || pin.length == 6) {
      return;
    }
    if (pin.length != 6) {
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
              {LanguageManager.CreatePin}
            </Text>

            <Text style={[styles.sixDigitPinStyle, { color: ThemeManager.colors.lightTextColor }]}
              numberOfLines={1}>
              {LanguageManager.enterSixDigitPin}
            </Text>

            <View style={styles.viewPinContain}>
              {/* <SmoothPinCodeInput
                autoFocus={true}
                password
                mask="﹡"
                cellSize={42}
                codeLength={6}
                cellStyleFocused={{
                  borderColor: ThemeManager.colors.primary,
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
              /> */}
              {[0, 1, 2, 3, 4, 5].map((item, index) => {
                return (
                  <PinInput
                    key={item}
                    isActive={pin.length == 0 ? index == 0 ? true : false : pin.length == index + 1}
                    digit={pin.length > index ? "*" : ""}
                  />
                );
              })}
            </View>
          </View>

          <View
            style={styles.marginBtn}>

            <KeyboardDigit
              updatePin={(item) => updatePin(item)}
              deletePin={() => deletePin()}
            />

            <BasicButton
              onPress={() => {
                onProceed();
              }}
              btnStyle={styles.btnStyle}
              customGradient={styles.customGrad}
              text={LanguageManager.proceed}
              // text='>>>>>'
            />
          </View>
        </ScrollView>
        {/* </ImageBackgroundComponent> */}
      </View>
      <View></View>
    </Wrap>
  );
};

export default WalletSequrity;
