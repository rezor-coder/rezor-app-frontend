/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  SafeAreaView,
  BackHandler,
  View,
  Platform,
  Alert
} from 'react-native';
import styles from './SecurityStyle';
import {
  SecuritySwitch,
  SimpleHeader,
  Wrap,
  SecurityLink,
  MainStatusBar,
  BorderLine,
} from '../../common';
import { Fonts, Images, Colors } from '../../../theme';
import { Actions } from 'react-native-router-flux';
import Singleton from '../../../Singleton';
import * as constants from '../../../Constant';
import { LanguageManager, ThemeManager } from '../../../../ThemeManager';
import fonts from '../../../theme/Fonts';
import { areaDimen, heightDimen, widthDimen } from '../../../Utils/themeUtils';
import { testCheckPermission } from '../../../utils';
import { request, PERMISSIONS, openSettings } from "react-native-permissions";
import ReactNativeBiometrics from 'react-native-biometrics';


class Security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
    };
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      Singleton.getInstance()
        .newGetData(constants.ENABLE_PIN)
        .then(enablePin => {
          // alert(enablePin);
          console.warn('MM', 'chk enablePin app lock::::security', enablePin, "enablePin == 'false' ?", enablePin == 'false');
          enablePin == 'false'
            ? this.setState({ isEnabled: false })
            : this.setState({ isEnabled: true });
        });
    });
  }
  backAction = () => {
    //console.warn('MM','i security');
    Actions.pop();
    return true;
  };
  enableDisableAppLock(status) {
    //console.warn('MM','chk status app lock::::', status);
    Singleton.getInstance().newSaveData(constants.ENABLE_PIN, status.toString());
  }

  checkBiometricAvailability() {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject;
      console.log("available:::", available, "biometryType:::", biometryType);
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        console.warn('MM', 'TouchID is supported');
        this.changeStatus()
        // this.setState({showImage: true, showTouch: true, showFace: false});
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        console.warn('MM', 'FaceID is supported');
        this.changeStatus()
        // this.enableBiometrics();
        // this.setState({showImage: true, showTouch: false, showFace: true});
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        this.changeStatus()
        console.warn('MM', 'Biometrics is supported');
        // this.enableBiometrics();
        // this.setState({showImage: true, showTouch: true, showFace: false});
      } else {
        global.showFingerPrint = false;
        console.warn('MM', 'Biometrics not supported');
        if (Platform.OS != 'ios') {
          // Singleton.showAlert('Biometrics not supported.')
        } else {console.log("else::");
          Alert.alert('Face Id Permission', 'Face Id Permissions is not allowed. Please allow it manually from setting.', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            { text: 'Open Settings', onPress: () => {
              this.changeStatus()
              setTimeout(() => {
                openSettings()
              }, 200);
            } },
          ]);
        }

        // this.setState({ showImage: false, showTouch: false, showFace: false });
      }
    });
  }
  enableBiometrics() {
    ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
      .then(resultObject => {
        const { success } = resultObject;
        if (success) {
          console.warn('MM', 'successful biometrics provided', resultObject);
          global.pinShown = false;
          // if (this.props?.refreshToken || this.props?.isFrom == 'splash') {
          //   this.token_api();
          // } else if (this.props?.loginAgain) {
          //   this.refreshToken_expired_api();
          // } else {
          //   this.signInContent();
          // }
        } else {
          //console.warn('MM','user cancelled biometric prompt');
        }
      })
      .catch(() => {
        console.warn('MM', 'biometrics failed');
      });
  }
  changeStatus() {
    // if (this.state.isEnabled) {
    //   Actions.currentScene != 'ConfirmPin' && Actions.ConfirmPin({ redirectTo: 'disablepin', goBack: true, });
    // } else {
    // Actions.currentScene != 'CreatePIN' &&
    //   Actions.CreatePIN({
    //     redirectTo: 'enablepin',
    //     goBack: true,
    //   });
    console.log("called::");
    this.enableDisableAppLock(!this.state.isEnabled)
    this.setState({ isEnabled: !this.state.isEnabled })
    // setTimeout(() => {
    // }, 1000)

    // }
  }

  render() {
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
            title={LanguageManager.Security}
            // rightImage={[styles.rightImgStyle]}
            backImage={ThemeManager.ImageIcons.iconBack}
            titleStyle
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
          <ScrollView style={{ paddingTop: heightDimen(24), flex: 1 }}>
            <View
              style={{
                backgroundColor: ThemeManager.colors.mnemonicsView,
                marginHorizontal: widthDimen(22),
                borderRadius: widthDimen(12),
                shadowColor: ThemeManager.colors.shadowColor,
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3.05,
                elevation: 4,
                marginTop: heightDimen(10)
              }}>
              <SecuritySwitch
                titleStyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: areaDimen(14),
                  fontFamily: fonts.semibold,
                }}
                // disabled={true}
                // style={{paddingVertical: 10, height: 50}}
                title={LanguageManager.faceIdTouchOId}
                toggleSwitch={() => {
                  console.log(">>>>>>>>>>>");
                  let permit = testCheckPermission()
                  console.log(">>>>>>>>>>>", permit);
                  if (this.state.isEnabled) {
                    Actions.currentScene != 'ConfirmPin' && Actions.ConfirmPin({ redirectTo: 'disablepin', goBack: true, });
                  } else {
                    this.checkBiometricAvailability()
                  }
                }}
                isEnabled={this.state.isEnabled}
              />
            </View>

            <View
              style={{
                backgroundColor: ThemeManager.colors.mnemonicsView,
                marginHorizontal: widthDimen(22),
                borderRadius: widthDimen(12),
                marginTop: heightDimen(12),
                shadowColor: ThemeManager.colors.shadowColor,
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3.05,
                elevation: 4,
                marginBottom: heightDimen(10)
              }}>
              <SecurityLink
                style={{
                  borderBottomWidth: 0,
                  // borderBottomColor: Colors.borderColor,
                }}
                textstyle={{
                  color: ThemeManager.colors.textColor,
                  fontSize: areaDimen(14),
                  fontFamily: fonts.semibold,
                }}
                showIcon
                title={LanguageManager.resetYourPin}
                onPress={() =>
                  Actions.currentScene != 'ResetConfirmPin' &&
                  Actions.ResetConfirmPin({ screen: 'ResetConfirmPin' })
                }
              />
            </View>
          </ScrollView>
        </Wrap>
      </>
    );
  }
}

export default Security;
