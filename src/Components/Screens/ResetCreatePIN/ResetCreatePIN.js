/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  View
} from 'react-native';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import * as constants from '../../../Constant';
import { NavigationStrings } from '../../../Navigation/NavigationStrings';
import Singleton from '../../../Singleton';
import { getCurrentRouteName, navigate } from '../../../navigationsService';
import {
  BasicButton,
  BorderLine,
  KeyboardDigit,
  MainStatusBar,
  PinInput,
  SimpleHeader
} from '../../common';
import { Wrap } from '../../common/Wrap';
import { styles } from './ResetCreatePINStyle';
let length = 0;
const windowHeight = Dimensions.get('window').height;
const ResetCreatePIN = props => {
  const [pin, setPin] = useState('');
  const [confirmPin, setconfirmPin] = useState('');
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
  //     Singleton.getInstance().saveData(constants.PIN, pin);
  //     // Singleton.getInstance().saveData(constants.ENABLE_PIN, 'true');
  //     Singleton.showAlert(constants.UPDATEDPIN);
  //     getCurrentRouteName() != 'Dashboard' && Actions.Dashboard();
  //   }
  // };
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

  const onProceed = () => {
    if (pin.length == 0 || pin.length < 6) {
      Singleton.showAlert(constants.ENTERPIN);
      return;
    } else {
      getCurrentRouteName() != 'ConfirmSecurityPin' &&
      navigate(NavigationStrings.ConfirmSecurityPin, { pinFrom: pin });
      setPin('')
      // }
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
      {/* <ImageBackgroundComponent style={{ height: windowHeight, flex: 1 }}> */}
      {/* <HeaderwithBackIcon iconLeft={ThemeManager.ImageIcons.iconBack} /> */}
      <SimpleHeader
        title={LanguageManager.EnterPin}
        // rightImage={[styles.rightImgStyle]}
        backImage={ThemeManager.ImageIcons.iconBack}
        titleStyle ={{textTransform:'none'}}
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
        style={{ flex: 1 }}>
        <View style={{}}>

          <Text style={[styles.sixDigitPinStyle, { color: ThemeManager.colors.lightTextColor }]}>
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
                  // length = text.length;
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
              onPress={() => goBack()}
              style={styles.btnView2}>
              <Text style={{color: colors.white}}>{LanguageManager.Back}</Text>
            </TouchableOpacity>
          </View>
        */}
      </ScrollView>
      {/* </ImageBackgroundComponent> */}
    </Wrap>
  );
};
export default ResetCreatePIN;
